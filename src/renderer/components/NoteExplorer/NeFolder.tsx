import React, { useState, useEffect, } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { type NeFolder, toggleFolder } from '../../redux/boxSlice';
import { ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import NeNote from './NeNote';

export interface NeFolderProps {
  folder: NeFolder;
}

const NeFolder: React.FC<NeFolderProps> = ({ folder }) => {
  const dispatch = useAppDispatch();

  const name = folder.path[folder.path.length - 1];

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
    dispatch(toggleFolder(folder.path));
  }

  return (
    <div
      className={`folder-name items-center px-3 py-1 text-xs cursor-pointer hover:bg-sidebar-active`}
      onClick={onClick}
    >
      <div className="flex">
        {folder.expanded
          ? <ChevronDownIcon className="h-4 w-4 mr-2" />
          : <ChevronRightIcon className="h-4 w-4 mr-2" />}
        <span className="text-xs text-text-primary">{name}</span>
      </div>
      <div>
        {folder.expanded && (
          folder.items.map((item) => {
            if (item.type === 'folder') {
              return <NeFolder key={item.id} folder={item} />;
            } else if (item.type === 'note') {
              return <NeNote key={item.id} note={item} />;
            }
          })
        )}
      </div>
    </div>
  )
}

export default NeFolder;
