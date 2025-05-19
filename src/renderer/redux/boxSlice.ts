import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FilePath } from '../../types'
import { StartupData, SavedNote, SavedFolder, SavedItem } from 'src/main/api';

// Note Explorer
export type NeItem =
  | NeNote
  | NeTBANote
  | NeFolder
  ;

export type NeItemType =
  | 'note'
  | 'tba-note'
  | 'folder'
  ;

export type NoteExplorerTree = {
  name: string;
  items: NeItem[];
}

export type NeNote = {
  type: 'note';
  id: number;
  path: FilePath;
}

export type NeTBANote = {
  type: 'tba-note';
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

// OpenNote
export type OpenNote = {
  title: string;
  content: string;
  notePath: FilePath;
}

// Payloads
export type ToggleFolderPayload = {
  folderPath: FilePath;
  items: SavedItem[];
}

export type RenameNotePayload = {
  notePath: FilePath;
  newName: string;
}

export type AddTBANotePayload = {
  notePath: FilePath;
}

export type AddTBANoteToFolderPayload = {
  folderPath: FilePath;
}

export type CancelTBANotePayload = {
  notePath: FilePath;
}

export type TBANoteToNotePayload = {
  notePath: FilePath;
  finalizedPath: FilePath;
}

export type OpenNotePayload = {
  openedNote: OpenNote;
}

// Slice
export interface BoxState {
  noteTree: NoteExplorerTree;
  openNote: OpenNote | null;
}

const initialState: BoxState = {
  noteTree: {
    name: 'root',
    items: [],
  },
  openNote: null,
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

const findFolder = <T extends { folderPath: FilePath }>(items: NeItem[], level: number, props: T, cb: (items: NeItem[], index: number, props: T) => void) => {
  const folderPath = props.folderPath;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.type === 'folder') {
      if (item.path[level] === folderPath[level]) {
        if ((folderPath.length - 1) === level) {
          cb(items, i, props)
        } else {
          findFolder(item.items, level + 1, props, cb);
        }
      }
    }
  }
}

const findNote = <T extends { notePath: FilePath }>(items: NeItem[], level: number, props: T, cb: (items: NeItem[], index: number, props: T) => void) => {
  const notePath = props.notePath;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    if (level !== notePath.length - 1) {
      if (item.type === 'folder' && item.path[level] === notePath[level]) {
        findNote(item.items, level + 1, props, cb)
        break;
      }
    } else {
      if ((item.type === 'note' || item.type === 'tba-note')
        && item.path[level] === notePath[level]) {
        cb(items, i, props)
        break;
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

    addTBANote(state, action: PayloadAction<AddTBANotePayload>) {
      const notePath = action.payload.notePath;
      const noteName = notePath[notePath.length - 1];
      const noteId = getId(noteName);

      const initialName = noteId
        ? idToString(noteId)
        : 'untitled'

      findNote(state.noteTree.items, 0, {
        notePath,
        initialName,
      },
        (items, index, props) => {
          items.splice(index + 1, 0, {
            type: 'tba-note',
            id: generateId(),
            path: [...notePath.slice(0, -1), `${props.initialName}.md`],
          } as NeTBANote);
        }
      )
    },

    cancelTBANote(state, action: PayloadAction<CancelTBANotePayload>) {
      findNote(state.noteTree.items, 0, action.payload,
        (items, index, props) => {
          items.splice(index, 1);
        }
      )
    },

    updateOpenNoteTitle(state, action: PayloadAction<string>) {
      if (state.openNote) {
        state.openNote.title = action.payload;
      }
    },

    updateOpenNoteContent(state, action: PayloadAction<string>) {
      if (state.openNote) {
        state.openNote.content = action.payload;
      }
    },

    // Internal Actions
    addTBANoteToFolderInternal(state, action: PayloadAction<AddTBANoteToFolderPayload>) {
      findFolder(state.noteTree.items, 0, action.payload,
        (items, index, props) => {
          const folder = items[index] as NeFolder

          let firstNote = folder.items.length;

          for (let i = 0; i < folder.items.length - 1; i++) {
            if (folder.items[i].type === 'note') {
              firstNote = i
              break;
            }
          }

          const initialName = 'untitled'

          folder.items.splice(firstNote, 0, {
            type: 'tba-note',
            id: generateId(),
            path: [...props.folderPath, `${initialName}.md`]
          } as NeTBANote)
        }
      )
    },

    toggleFolderInternal(state, action: PayloadAction<ToggleFolderPayload>) {
      findFolder(state.noteTree.items, 0, action.payload,
        (items, index, props) => {
          const folder = items[index] as NeFolder;
          folder.expanded = !folder.expanded;
          folder.items = convertFolderItems(props.items)
        }
      );
    },

    tbaNoteToNoteInternal(state, action: PayloadAction<TBANoteToNotePayload>) {
      findNote(state.noteTree.items, 0, action.payload,
        (items, index, props) => {
          items[index] = {
            type: 'note',
            id: generateId(),
            path: props.finalizedPath,
          } as NeNote

          items.sort((a, b) => {
            if (a.type == 'folder' && b.type == 'note') {
              return -1
            } else if (a.type == 'note' && b.type == 'folder') {
              return 1
            } else {
              const aName = a.path[a.path.length - 1]
              const bName = b.path[b.path.length - 1]

              return aName.localeCompare(bName)
            }
          })
        }
      )
    },

    renameNoteInternal(state, action: PayloadAction<RenameNotePayload>) {
      findNote(state.noteTree.items, 0, action.payload,
        (items, index, props) => {
          const item = items[index]
          item.path[item.path.length - 1] = `${props.newName}.md`
        }
      )

      if (state.openNote) {
        if (state.openNote.notePath.join('/') === action.payload.notePath.join('/')) {
          const { notePath, newName } = action.payload;

          state.openNote.notePath = [...notePath.slice(0, -1), `${newName}.md`]
        }
      }
    },

    openNoteInternal(state, action: PayloadAction<OpenNotePayload>) {
      const { openedNote } = action.payload;
      state.openNote = openedNote;
    },
  },
})

// Simple Actions
export const {
  initialize,
  addTBANote,
  cancelTBANote,
  updateOpenNoteTitle,
  updateOpenNoteContent,
} = boxSlice.actions


// Thunks
const {
  toggleFolderInternal,
  addTBANoteToFolderInternal,
  tbaNoteToNoteInternal,
  renameNoteInternal,
  openNoteInternal,
} = boxSlice.actions;

export const toggleFolder = (folderPath: FilePath) =>
  async (dispatch: any) => {
    const items = await window.electronAPI.loadFolder(folderPath);

    dispatch(toggleFolderInternal({
      folderPath,
      items,
    }));
  }

export const addTBANoteToFolder = (folderPath: FilePath, expanded: boolean) =>
  async (dispatch: any) => {
    if (!expanded) {
      const items = await window.electronAPI.loadFolder(folderPath);

      dispatch(toggleFolderInternal({
        folderPath,
        items,
      }));
    }

    dispatch(addTBANoteToFolderInternal({
      folderPath,
    }));
  }

export const renameNote = (notePath: FilePath, newName: string) =>
  async (dispatch: any) => {
    await window.electronAPI.renameNote(notePath, newName);

    dispatch(renameNoteInternal({
      notePath,
      newName,
    }));
  }

export const saveTBANote = (notePath: FilePath, noteName: string) =>
  async (dispatch: any) => {
    const p = [...notePath.slice(0, -1), `${noteName}.md`]

    await window.electronAPI.createNewNote(p)

    dispatch(tbaNoteToNoteInternal({
      notePath,
      finalizedPath: p,
    }))
  }

export const openNote = (notePath: FilePath) =>
  async (dispatch: any) => {
    const note = await window.electronAPI.loadNote(notePath);
    const title = noteNameFromPath(notePath);

    dispatch(openNoteInternal({
      openedNote: {
        title,
        content: note,
        notePath,
      }
    }));
  }

// Utilities
export const noteName = (note: NeNote | NeTBANote): string => {
  const nameWithExtension = note.path[note.path.length - 1];
  return nameWithExtension.split('.').slice(0, -1).join('.') || nameWithExtension;
}

export const noteNameFromPath = (notePath: FilePath): string => {
  const nameWithExtension = notePath[notePath.length - 1];
  return nameWithExtension.split('.').slice(0, -1).join('.') || nameWithExtension;
}

export type NoteId = {
  domain: string;
  section: string | null;
  notePath: string[];
}

export const getId = (noteName: string): NoteId | false => {
  const codeType0 = /^[A-Z]\d+[a-z]*(?:-| )/ // ex: L1a-0
  const codeType1 = /^[A-Z]\d+\./ // ex: P40.S.3a-1b-2

  if (noteName.match(codeType0)) {
    const domainCode = `[A-Z]`
    const notePath = `\\d+[a-z]*(?:-\\d+[a-z]*)*`;
    const re = new RegExp(`^(${domainCode})(${notePath})`);

    const match = noteName.match(re);

    if (match) {
      const domain = match[1];
      const notePath = match[2].split('-');

      return {
        domain,
        section: null,
        notePath,
      }
    }
  } else if (noteName.match(codeType1)) {
    const domainCode = '[A-Z]\\d+';
    const sectionName = '\\.\\w+\\.';
    const notePath = '\\d+[a-z]*(?:-\\d+[a-z]*)*';
    const re = new RegExp(`^(${domainCode})(${sectionName})(${notePath})`);

    const match = noteName.match(re);

    if (match) {
      const domain = match[1];
      const section = match[2].slice(1, -1);
      const notePath = match[3].split('-');

      return {
        domain,
        section,
        notePath,
      }
    }
  }

  return false
}

export const hadId = (noteName: string): boolean => {
  return !!getId(noteName)
}

export const idToString = (noteId: NoteId): string => {
  const { domain, section, notePath } = noteId;
  if (section) {
    return `${domain}.${section}.${notePath.join('-')}`;
  } else {
    return `${domain}${notePath.join('-')}`;
  }
}

export default boxSlice.reducer
