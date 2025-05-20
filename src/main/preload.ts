import { contextBridge, ipcRenderer } from 'electron';
import { FilePath } from '../types';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  startup: () => ipcRenderer.invoke('startup'),
  loadFolder: (folderPath: string) => ipcRenderer.invoke('load-folder', folderPath),
  renameNote: (oldPath: FilePath, newName: string) => ipcRenderer.invoke('rename-note', oldPath, newName),
  createNewNote: (notePath: FilePath) => ipcRenderer.invoke('create-new-note', notePath),
  loadNote: (notePath: FilePath) => ipcRenderer.invoke('load-note', notePath),
  saveNote: (notePath: FilePath, content: string) => ipcRenderer.invoke('save-note', notePath, content),
});
