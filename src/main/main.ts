import { app, BrowserWindow, nativeTheme, ipcMain } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

let mainWindow: BrowserWindow | null;

// Set up IPC handlers for secure file operations
function setupIpcHandlers() {
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