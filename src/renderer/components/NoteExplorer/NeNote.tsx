import React, { useState, useEffect, } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import NoteContextMenu, { NoteContext } from './NoteContextMenu';
import { type NeNote } from '../../redux/boxSlice';

export interface NeNoteProps {
  note: NeNote;
}

const NeNote: React.FC<NeNoteProps> = ({ note }) => {
  const [editing, setEditing] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const name = note.path[note.path.length - 1];

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
        <span>editing</span>
      ) : (
        <span className="text-xs text-text-primary">{name}</span>
      )}
    </div>
  )
}

export default NeNote;
