import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Note {
  id: string;
  title: string;
  content: string;
  lastModified: number;
  filePath?: string;
}

export interface Folder {
  id: string;
  name: string;
  notes: Note[];
}

export interface NotesState {
  folders: Folder[];
  activeNote: Note | null;
  expandedFolders: string[];
  titleValue: string;
}

const initialState: NotesState = {
  folders: [],
  activeNote: null,
  expandedFolders: [],
  titleValue: '',
};

export const notesSlice = createSlice({
  name: 'onotes',
  initialState,
  reducers: {
    setFolders: (state, action: PayloadAction<Folder[]>) => {
      state.folders = action.payload;
    },
    setActiveNote: (state, action: PayloadAction<Note | null>) => {
      state.activeNote = action.payload;
    },
    setExpandedFolders: (state, action: PayloadAction<string[]>) => {
      state.expandedFolders = action.payload;
    },
    setTitleValue: (state, action: PayloadAction<string>) => {
      state.titleValue = action.payload;
    },
    addExpandedFolder: (state, action: PayloadAction<string>) => {
      if (!state.expandedFolders.includes(action.payload)) {
        state.expandedFolders.push(action.payload);
      }
    },
    removeExpandedFolder: (state, action: PayloadAction<string>) => {
      state.expandedFolders = state.expandedFolders.filter(id => id !== action.payload);
    },
    toggleExpandedFolder: (state, action: PayloadAction<string>) => {
      const folderId = action.payload;
      if (state.expandedFolders.includes(folderId)) {
        state.expandedFolders = state.expandedFolders.filter(id => id !== folderId);
      } else {
        state.expandedFolders.push(folderId);
      }
    },
    updateNote: (state, action: PayloadAction<{ noteId: string; updates: Partial<Note> }>) => {
      const { noteId, updates } = action.payload;

      state.folders = state.folders.map(folder => ({
        ...folder,
        notes: folder.notes.map(note =>
          note.id === noteId ? { ...note, ...updates } : note
        ),
      }));

      if (state.activeNote && state.activeNote.id === noteId) {
        state.activeNote = { ...state.activeNote, ...updates };
      }
    },
    addNoteToFolder: (state, action: PayloadAction<{ folderId: string; note: Note }>) => {
      const { folderId, note } = action.payload;

      state.folders = state.folders.map(folder =>
        folder.id === folderId
          ? { ...folder, notes: [note, ...folder.notes] }
          : folder
      );
    },
  },
});

export const {
  setFolders,
  setActiveNote,
  setExpandedFolders,
  setTitleValue,
  addExpandedFolder,
  removeExpandedFolder,
  toggleExpandedFolder,
  updateNote,
  addNoteToFolder,
} = notesSlice.actions;

export default notesSlice.reducer;