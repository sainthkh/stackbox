import React, { useState, useEffect, } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import NeItems from './NeItems';
import { useOutsideClick } from '../hooks';
import {
  focusNoteExplorer,
  beginRename,
} from '../../redux/boxSlice';

interface NoteExplorerProps {
}

const NoteExplorer: React.FC<NoteExplorerProps> = ({
}) => {
  const dispatch = useAppDispatch();
  const box = useAppSelector(state => state.box);
  const focused = useAppSelector(state => state.box.noteTree.hasFocus);
  const openNotePath = useAppSelector(state => state.box.openNote?.notePath);

  const ref = React.useRef<HTMLDivElement>(null);

  useOutsideClick(ref, () => {
    dispatch(focusNoteExplorer(false));
  })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (focused && e.key === 'F2') {
        dispatch(beginRename(openNotePath || null));
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    }
  })

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    dispatch(focusNoteExplorer(true));
  }

  return (
    <div
      ref={ref}
      id="notes"
      className="h-full bg-sidebar-bg border-r border-border overflow-y-auto"
      onClick={handleClick}
    >
      <NeItems
        items={box.noteTree.items}
        level={0}
      />
    </div>
  )
}

export default NoteExplorer;
