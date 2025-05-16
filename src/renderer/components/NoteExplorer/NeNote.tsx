import React, { useState, useEffect, } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import NeContextMenu from './NeContextMenu'
import EditableNoteName from './EditableNoteName';
import { type NeNote, noteName, renameNote, addTBANote, openNote, } from '../../redux/boxSlice';

type NoteContextCommand =
  | 'rename'
  | 'new-note'
  ;

export interface NeNoteProps {
  note: NeNote;
}

const NeNote: React.FC<NeNoteProps> = ({ note }) => {
  const dispatch = useAppDispatch();

  const [editing, setEditing] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
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
        setEditing(true);
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
    setEditing(false);
  }

  const onCancelEdit = () => {
    setEditing(false);
  }

  return (
    <div
      className={`note-name flex items-center px-3 py-1 text-xs cursor-pointer hover:bg-sidebar-active`}
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
      {editing ? (
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
