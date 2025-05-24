import React, { useState, useEffect, } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import NeItems from './NeItems';

interface NoteExplorerProps {
}

const NoteExplorer: React.FC<NoteExplorerProps> = ({
}) => {
  const box = useAppSelector(state => state.box);

  return (
    <div
      id="notes"
      className="h-full bg-sidebar-bg border-r border-border overflow-y-auto"
    >
      <NeItems
        items={box.noteTree.items}
        level={0}
      />
    </div>
  )
}

export default NoteExplorer;
