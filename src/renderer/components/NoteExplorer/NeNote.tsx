import React, { useState, useEffect, } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { type NeNote } from '../../redux/boxSlice';

export interface NeNoteProps {
  note: NeNote;
}

const NeNote: React.FC<NeNoteProps> = ({ note }) => {
  const name = note.path[note.path.length - 1];

  return (
    <div className={`note-name flex items-center px-3 py-1 text-xs cursor-pointer hover:bg-sidebar-active`}>
      <span className="text-xs text-text-primary">{name}</span>
    </div>
  )
}

export default NeNote;