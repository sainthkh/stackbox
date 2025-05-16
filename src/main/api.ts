import { FilePath } from '../types';

// TODO: decide if this is the right place for these note types.
export type SavedItem = SavedNote | SavedFolder;
export type SavedItemType = 'note' | 'folder';

export type SavedBox = {
  path: FilePath;
  items: SavedItem[];
}

export type SavedNote = {
  type: 'note';
  path: FilePath;
}

export type SavedFolder = {
  type: 'folder';
  path: FilePath;
  expanded: boolean;
  items: SavedItem[];
}

export type OpenedNote = {
  path: FilePath;
}

export interface StartupData {
  box: SavedBox;
  openedNotes: OpenedNote[];
}

// ElectronAPI interface for TypeScript
export interface ElectronAPI {
  startup: () => Promise<StartupData>;
  loadFolder: (folderPath: FilePath) => Promise<SavedItem[]>;
  renameNote: (oldPath: FilePath, newName: string) => Promise<boolean>;
  createNewNote: (notePaht: FilePath) => Promise<boolean>;
  loadNote: (notePath: FilePath) => Promise<string>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
