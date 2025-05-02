// ElectronAPI interface for TypeScript
export interface ElectronAPI {
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