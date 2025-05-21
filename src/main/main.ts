import { app, BrowserWindow, nativeTheme, ipcMain } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { readFile, writeFile, access, readdir, mkdir, stat, rename } from 'fs/promises';
import { FilePath } from '../types';
import { StartupData, OpenedNote, SavedBox, SavedItem, SavedFolder, SavedNote } from './api';

import { installExtension, REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';

let mainWindow: BrowserWindow | null;
let boxPath: string;

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath, fs.constants.F_OK);
    return true;
  }
  catch (error) {
    return false;
  }
}

async function loadNote(notePath: FilePath): Promise<string> {
  const filePath = path.join(boxPath, notePath.join(path.sep));

  try {
    return await readFile(filePath, 'utf-8');
  } catch (error) {
    console.error('Error reading file:', error);
    throw error;
  }
}

function isFolderExpanded(folderPath: FilePath, expandedList: FilePath[]): boolean {
  return expandedList.some((expandedPath) => {
    return expandedPath.length === folderPath.length && expandedPath.every((part, index) => part === folderPath[index]);
  });
}

async function loadItems(folderPath: FilePath, boxConfig: BoxConfig): Promise<SavedItem[]> {
  const items: SavedItem[] = [];
  const files = await readdir(path.join(boxPath, ...folderPath), { withFileTypes: true });

  for (const file of files) {
    const newPath = [...folderPath, file.name];

    if (file.isDirectory()) {
      // Skip hidden directories
      if (file.name.startsWith('.')) {
        continue;
      }

      const isExpanded = isFolderExpanded(newPath, boxConfig.expandedFolders);

      items.push({
        type: 'folder',
        path: newPath,
        expanded: isExpanded,
        items: isExpanded
          ? await loadItems(newPath, boxConfig)
          : [],
      } as SavedFolder);
    }
    else {
      items.push({
        type: 'note',
        path: newPath,
      } as SavedNote);
    }
  }

  return items;
}

interface BoxConfig {
  expandedFolders: FilePath[];
  openedNote: FilePath;
}

// Set up IPC handlers for secure file operations
function setupIpcHandlers() {
  const noWrite = process.argv.includes('--test-no-write');

  ipcMain.handle('startup', async () => {
    const userDataPath = app.getPath('userData');

    const settingsPath = path.join(userDataPath, 'settings.json');

    const settingsExists = await fileExists(settingsPath);
    if (!settingsExists) {
      await writeFile(settingsPath, JSON.stringify({}), 'utf-8');
    }

    const settingsJson = await readFile(settingsPath, 'utf-8');
    const settings = JSON.parse(settingsJson);

    // TODO: if lastBoxPath does not exist, we should show welcome screen
    boxPath = settings.lastBoxPath || path.resolve('./sample-box');
    const rootPath: FilePath = boxPath.split(path.sep) as FilePath;

    const boxConfigPath = path.join(boxPath, '.stackbox', 'config.json');
    const boxConfigExists = await fileExists(boxConfigPath);
    if (!boxConfigExists) {
      await mkdir(path.dirname(boxConfigPath), { recursive: true });
      await writeFile(boxConfigPath, JSON.stringify({}), 'utf-8');
    }

    const boxConfigJson = await readFile(boxConfigPath, 'utf-8');
    const boxConfig: BoxConfig = JSON.parse(boxConfigJson);

    const box: SavedBox = {
      path: rootPath,
      items: [],
    };

    box.items = await loadItems([], boxConfig);

    let openedNoteExists = false;
    let openedNoteContent = '';

    if (boxConfig.openedNote && boxConfig.openedNote.length > 0) {
      if (await fileExists(path.join(boxPath, boxConfig.openedNote.join(path.sep)))) {
        openedNoteExists = true;
        openedNoteContent = await loadNote(boxConfig.openedNote);
      }
    }

    const openedNote = openedNoteExists
      ? {
        path: boxConfig.openedNote,
        content: openedNoteContent,
      }
      : null;

    return {
      box,
      openedNote,
    } as StartupData;
  })

  ipcMain.handle('load-folder', async (_, folderPath) => {
    const p = folderPath.join(path.sep);
    const fp = path.join(boxPath, p);

    const items: SavedItem[] = [];
    const files = await readdir(fp, { withFileTypes: true });

    for (const file of files) {
      if (file.isDirectory()) {
        // Skip hidden directories
        if (file.name.startsWith('.')) {
          continue;
        }

        items.push({
          type: 'folder',
          path: [...folderPath, file.name],
          expanded: false,
          items: [],
        } as SavedFolder);
      }
      else {
        items.push({
          type: 'note',
          path: [...folderPath, file.name],
        } as SavedNote);
      }
    }

    return items;
  })

  ipcMain.handle('rename-note', async (_, notePath, newName) => {
    if (noWrite) return true;

    const oldPath = path.join(boxPath, notePath.join(path.sep));
    const newPath = path.join(boxPath, notePath.slice(0, -1).join(path.sep), `${newName}.md`);

    const noteExists = await fileExists(oldPath);
    if (!noteExists) {
      throw new Error(`Note does not exist: ${oldPath}`);
    }
    else {
      await rename(oldPath, newPath);
      return true;
    }
  })

  ipcMain.handle('create-new-note', async (_, notePath) => {
    if (noWrite) return true;

    const filePath = path.join(boxPath, notePath.join(path.sep))

    try {
      await writeFile(filePath, '', 'utf-8');
      return true;
    } catch (error) {
      console.error('Error writing file:', error);
      throw error;
    }
  })

  ipcMain.handle('load-note', async (_, notePath) => {
    return await loadNote(notePath);
  });

  ipcMain.handle('save-note', async (_, notePath, content) => {
    if (noWrite) return true;

    const filePath = path.join(boxPath, notePath.join(path.sep));

    try {
      await writeFile(filePath, content, 'utf-8');
      return true;
    } catch (error) {
      console.error('Error writing file:', error);
      throw error;
    }
  });

  ipcMain.handle('save-box-state', async (_, folders, openedNote) => {
    if (noWrite) return true;

    const boxConfigPath = path.join(boxPath, '.stackbox', 'config.json');

    // In case, the config file does not exist, create it
    const boxConfigExists = await fileExists(boxConfigPath);
    if (!boxConfigExists) {
      await mkdir(path.dirname(boxConfigPath), { recursive: true });
      await writeFile(boxConfigPath, JSON.stringify({}), 'utf-8');
    }

    const boxConfig: BoxConfig = {
      expandedFolders: folders,
      openedNote,
    }

    try {
      await writeFile(boxConfigPath, JSON.stringify(boxConfig), 'utf-8');
      return true;
    } catch (error) {
      console.error('Error writing file:', error);
      throw error;
    }
  })
}

function createWindow() {
  // Set the app to use dark mode
  nativeTheme.themeSource = 'dark';

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: '#1e1e1e', // Dark background color
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    show: false, // Don't show until ready-to-show
  });

  mainWindow.loadFile(path.join(__dirname, '../index.html'));

  // Uncomment to open DevTools by default
  // mainWindow.webContents.openDevTools();

  // Show window when ready to avoid white flash
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  const useExtension = process.argv.includes('--use-extension');

  if (useExtension) {
    installExtension([REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS], { loadExtensionOptions: { allowFileAccess: true } })
      .then(([react, redux]) => console.log(`Added Extension:  ${react.name} ${redux.name}`))
      .catch((err) => console.log('An error occurred: ', err));
  }

  setupIpcHandlers();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
