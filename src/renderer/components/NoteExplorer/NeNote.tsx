import React, { useState, useEffect, } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import NeContextMenu from './NeContextMenu'
import EditableNoteName from './EditableNoteName';
import {
  type NeNote,
  noteName,
  renameNote,
  addTBANote,
  openNote,
  focusNoteExplorer,
  beginRename,
} from '../../redux/boxSlice';
import { getPaddingLeft, filePathEquals } from '../util';

type NoteContextCommand =
  | 'rename'
  | 'new-note'
  ;

export interface NeNoteProps {
  note: NeNote;
  level: number;
}

const NeNote: React.FC<NeNoteProps> = ({
  note,
  level,
}) => {
  const dispatch = useAppDispatch();
  const hasFocus = useAppSelector(state => state.box.noteTree.hasFocus);

  const rename = useAppSelector(state => state.box.noteTree.rename);
  const isRenaming = rename && filePathEquals(rename, note.path);

  const openNotePath = useAppSelector(state => state.box.openNote?.notePath);
  const isOpen = openNotePath && filePathEquals(openNotePath, note.path);

  const [showContextMenu, setShowContextMenu] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    dispatch(focusNoteExplorer(true));
    dispatch(openNote(note.path));
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowContextMenu(true);
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const doMenu = (menu: NoteContextCommand) => {
    switch (menu) {
      case 'rename': {
        dispatch(beginRename(note.path));
        break;
      }
      case 'new-note': {
        dispatch(addTBANote({
          notePath: note.path,
        }));
        break;
      }
    }
  }

  const onFinishEdit = (newName: string) => {
    dispatch(renameNote(note.path, newName));
    dispatch(beginRename(null));
  }

  const onCancelEdit = () => {
    dispatch(beginRename(null));
  }

  let bg = '';

  if (isOpen && hasFocus) {
    bg = 'bg-blue-800';
  } else if (isOpen && !hasFocus) {
    bg = 'bg-slate-700';
  } else {
    bg = 'hover:bg-sidebar-active'
  }

  return (
    <div
      className={`note-name flex items-center py-1 pr-3 text-xs cursor-pointer ${bg}`}
      style={{
        paddingLeft: getPaddingLeft(level),
      }}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
    >
      <NeContextMenu
        menuId="note-context-menu"
        menuItems={[
          { id: 'add-new-note', command: 'new-note', content: 'Add New Note' },
          { id: 'rename-note', command: 'rename', content: 'Rename' },
        ]}
        showContextMenu={showContextMenu}
        position={mousePosition}
        closeContextMenu={() => setShowContextMenu(false)}
        doMenu={doMenu}
      />
      {isRenaming ? (
        <EditableNoteName
          name={noteName(note)}
          onFinishEdit={onFinishEdit}
          onCancelEdit={onCancelEdit}
        />
      ) : (
        <span className="text-xs text-text-primary">{noteName(note)}</span>
      )}
    </div>
  )
}

export default NeNote;
