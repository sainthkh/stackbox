import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FilePath } from '../../types'
import { StartupData, SavedNote, SavedFolder, SavedItem } from 'src/main/api';

export type NeItem = NeNote | NeFolder;
export type NeItemType = 'note' | 'folder';

export type NoteExplorerTree = {
  name: string;
  items: NeItem[];
}

export type NeNote = {
  type: 'note';
  id: number;
  path: FilePath;
}

export type NeFolder = {
  type: 'folder';
  id: number;
  path: FilePath;
  expanded: boolean;
  items: NeItem[];
}

export type ToggleFolderPayload = {
  folderPath: FilePath;
  items: SavedItem[];
}

export interface BoxState {
  noteTree: NoteExplorerTree;
  activeNote: NeNote | null;
}

const initialState: BoxState = {
  noteTree: {
    name: 'root',
    items: [],
  },
  activeNote: null,
}

let id = 0;

const generateId = () => {
  return id++;
}

const savedNoteToNeNote = (note: SavedNote): NeNote => {
  return {
    type: 'note',
    id: generateId(),
    path: note.path,
  }
}

const savedFolderToNeFolder = (folder: SavedFolder): NeFolder => {
  return {
    type: 'folder',
    id: generateId(),
    path: folder.path,
    expanded: folder.expanded,
    items: convertFolderItems(folder.items),
  }
}

const convertFolderItems = (items: SavedItem[]): NeItem[] => {
  return items.map(item => {
    if (item.type === 'note') {
      return savedNoteToNeNote(item as SavedNote);
    } else {
      return savedFolderToNeFolder(item as SavedFolder);
    }
  });
}

const toggleFolderExpanded = (items: NeItem[], payload: ToggleFolderPayload, level: number) => {
  const folderPath = payload.folderPath;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.type === 'folder') {
      if (item.path[level] === folderPath[level]) {
        if ((folderPath.length - 1) === level) {
          item.expanded = !item.expanded;
          item.items = convertFolderItems(payload.items);
        } else {
          toggleFolderExpanded(item.items, payload, level + 1);
        }
      }
    }
  }
}

export const boxSlice = createSlice({
  name: 'box',
  initialState,
  reducers: {
    initialize(state, action: PayloadAction<StartupData>) {
      const { box } = action.payload;
      state.noteTree = {
        name: box.path[box.path.length - 1],
        items: convertFolderItems(box.items),
      };
    },

    toggleFolderInternal(state, action: PayloadAction<ToggleFolderPayload>) {
      toggleFolderExpanded(state.noteTree.items, action.payload, 0);
    }
  },
})

const { toggleFolderInternal } = boxSlice.actions;

export const toggleFolder = (folderPath: FilePath) =>
  async (dispatch: any) => {
    const items = await window.electronAPI.loadFolder(folderPath);

    dispatch(toggleFolderInternal({
      folderPath,
      items,
    }));
  }

export const {
  initialize,
} = boxSlice.actions

export default boxSlice.reducer
