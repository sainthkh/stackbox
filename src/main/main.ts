import { app, BrowserWindow, nativeTheme, ipcMain } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { readFile, writeFile, access, readdir, mkdir, stat } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { FilePath, StartupData, OpenedNote, FeBox, FeFolder, FeNote } from './api';

let mainWindow: BrowserWindow | null;

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath, fs.constants.F_OK);
    return true;
  }
  catch (error) {
    return false;
  }
}

interface BoxConfig {
  expandedFolders: FilePath[];
  openedNotes: FilePath[];
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
    const lastBoxPath = settings.lastBoxPath || path.resolve('./sample-box');
    const rootPath: FilePath = lastBoxPath.split(path.sep) as FilePath;

    const boxConfigPath = path.join(lastBoxPath, '.stackbox', 'config.json');
    const boxConfigExists = await fileExists(boxConfigPath);
    if (!boxConfigExists) {
      await mkdir(path.dirname(boxConfigPath), { recursive: true });
      await writeFile(boxConfigPath, JSON.stringify({}), 'utf-8');
    }

    const boxConfigJson = await readFile(boxConfigPath, 'utf-8');
    const boxConfig: BoxConfig = JSON.parse(boxConfigJson);

    const box: FeBox = {
      path: rootPath,
      name: path.basename(lastBoxPath),
      items: [],
    };

    const files = await readdir(lastBoxPath, { withFileTypes: true });

    for (const file of files) {
      if (file.isDirectory()) {
        box.items.push({
          path: [file.name],
          name: file.name,
          expanded: false,
          items: [],
        } as FeFolder);
      }
      else {
        box.items.push({
          path: [file.name],
          name: file.name,
        } as FeNote);
      }
    }

    const openedNotes: OpenedNote[] = [];

    for (const notePath of [['Welcome to StackBox.md']]) {
      const noteFilePath = path.join(lastBoxPath, ...notePath);
      const noteExists = await fileExists(noteFilePath);
      if (!noteExists) {
        continue;
      }

      if (noteExists) {
        const content = await readFile(noteFilePath, 'utf-8');
        const stats = await stat(noteFilePath);

        openedNotes.push({
          path: notePath,
          name: notePath[notePath.length - 1],
          content,
          lastModified: stats.mtime.getTime(),
        } as OpenedNote);
      }
    }

    return {
      box,
      openedNotes,
    } as StartupData;
  })

  ipcMain.handle('load-notes', async (_, directoryPath) => {
    try {
      const resolvedPath = path.resolve(directoryPath);

      // Check if directory exists
      if (fs.existsSync(resolvedPath)) {
        const files = fs.readdirSync(resolvedPath);

        return files
          .filter(file => file.endsWith('.md'))
          .map(file => {
            const filePath = path.join(resolvedPath, file);
            const content = fs.readFileSync(filePath, 'utf-8');
            const stats = fs.statSync(filePath);

            return {
              filePath,
              fileName: file,
              lastModified: stats.mtime.getTime(),
            };
          });
      }
      return [];
    } catch (error) {
      console.error('Error loading notes:', error);
      throw error;
    }
  });

  ipcMain.handle('read-file', async (_, filePath) => {
    try {
      return fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
      console.error('Error reading file:', error);
      throw error;
    }
  });

  ipcMain.handle('write-file', async (_, filePath, content) => {
    if (noWrite) return true;

    try {
      fs.writeFileSync(filePath, content, 'utf-8');
      return true;
    } catch (error) {
      console.error('Error writing file:', error);
      throw error;
    }
  });

  ipcMain.handle('resolve-path', async (_, relativePath) => {
    return path.resolve(relativePath);
  });

  ipcMain.handle('uuid', async () => {
    return uuidv4();
  });

  ipcMain.handle('rename-file', async (_, oldPath, newPath) => {
    if (noWrite) return true;

    try {
      fs.renameSync(oldPath, newPath);
      return true;
    } catch (error) {
      console.error('Error renaming file:', error);
      throw error;
    }
  });
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