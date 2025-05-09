import { contextBridge, ipcRenderer } from 'electron';
import { FilePath } from '../types';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  startup: () => ipcRenderer.invoke('startup'),
  loadFolder: (folderPath: string) => ipcRenderer.invoke('load-folder', folderPath),
  renameNote: (oldPath: FilePath, newName: string) => ipcRenderer.invoke('rename-note', oldPath, newName),

  // File system operations
  loadNotes: (directoryPath: string) => ipcRenderer.invoke('load-notes', directoryPath),
  readFile: (filePath: string) => ipcRenderer.invoke('read-file', filePath),
  writeFile: (filePath: string, content: string) => ipcRenderer.invoke('write-file', filePath, content),

  // Path operations
  resolvePath: (relativePath: string) => ipcRenderer.invoke('resolve-path', relativePath),
  uuid: () => ipcRenderer.invoke('uuid'),
  renameFile: (oldPath: string, newPath: string) => ipcRenderer.invoke('rename-file', oldPath, newPath),
});
