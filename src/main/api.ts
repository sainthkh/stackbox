export type FilePath = string[];

// TODO: decide if this is the right place for these note types.
export type FeItem = FeNote | FeFolder;

export type FeBox = {
  path: FilePath;
  name: string;
  items: FeItem[];
}

export type FeNote = {
  path: FilePath;
  name: string;
}

export type FeFolder = {
  path: FilePath;
  name: string;
  expanded: boolean;
  items: FeItem[];
}

export type OpenedNote = {
  path: FilePath;
  name: string;
  content: string;
  lastModified: number;
}

export interface StartupData {
  box: FeBox;
  openedNotes: OpenedNote[];
}

// ElectronAPI interface for TypeScript
export interface ElectronAPI {
  startup: () => Promise<StartupData>;
  loadNotes: (directoryPath: string) => Promise<Array<{
    filePath: string;
    fileName: string;
    lastModified: number;
  }>>;
  readFile: (filePath: string) => Promise<string>;
  writeFile: (filePath: string, content: string) => Promise<boolean>;
  resolvePath: (relativePath: string) => Promise<string>;
  uuid: () => Promise<string>;
  renameFile: (oldPath: string, newPath: string) => Promise<boolean>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}