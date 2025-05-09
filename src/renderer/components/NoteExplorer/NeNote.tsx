import React, { useState, useEffect, } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import NoteContextMenu, { NoteContext } from './NoteContextMenu';
import EditableNoteName from './EditableNoteName';
import { type NeNote, noteName, renameNote } from '../../redux/boxSlice';

export interface NeNoteProps {
  note: NeNote;
}

const NeNote: React.FC<NeNoteProps> = ({ note }) => {
  const dispatch = useAppDispatch();

  const [editing, setEditing] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowContextMenu(true);
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const doMenu = (menu: NoteContext) => {
    switch (menu) {
      case 'rename': {
        setEditing(true);
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
      onContextMenu={handleContextMenu}
    >
      <NoteContextMenu
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
