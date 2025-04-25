export interface Note {
  id: string;
  title: string;
  content: string;
  lastModified: number;
}

export interface Folder {
  id: string;
  name: string;
  notes: Note[];
}