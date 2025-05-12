import React, { useState, useEffect, } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import NeFolder from './NeFolder';
import NeNote from './NeNote';
import NeTBANote from './NeTBANote';

interface FileExplorerProps2 {
}

const NoteExplorer: React.FC<FileExplorerProps2> = ({
}) => {
  // const dispatch = useAppDispatch();
  const box = useAppSelector(state => state.box);

  console.log(box)

  return (
    <div id="notes" className="h-full bg-sidebar-bg border-r border-border overflow-y-auto">
      <div>
        {box.noteTree.items.map((item) => {
          if (item.type === 'folder') {
            return <NeFolder key={item.id} folder={item} />;
          } else if (item.type === 'note') {
            return <NeNote key={item.id} note={item} />;
          } else if (item.type === 'tba-note') {
            return <NeTBANote key={item.id} tbaNote={item} />;
          }
        })}
      </div>
    </div>
  )
}

export default NoteExplorer;
