import React, { useState, useEffect, } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { type NeFolder, toggleFolder, addTBANoteToFolder } from '../../redux/boxSlice';
import NeContextMenu from './NeContextMenu';
import { ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import NeNote from './NeNote';
import NeTBANote from './NeTBANote';

type FolderContextCommand =
  | 'add-new-note'
  ;

export interface NeFolderProps {
  folder: NeFolder;
}

const NeFolder: React.FC<NeFolderProps> = ({ folder }) => {
  const dispatch = useAppDispatch();

  const [showContextMenu, setShowContextMenu] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowContextMenu(true);
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const doMenu = (menu: FolderContextCommand) => {
    switch (menu) {
      case 'add-new-note': {
        dispatch(addTBANoteToFolder(
          folder.path,
          folder.expanded,
        ));

        break;
      }
    }
  }

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
      onContextMenu={handleContextMenu}
    >
      <NeContextMenu
        menuId='folder-context-menu'
        menuItems={[
          { id: 'add-new-note', command: 'add-new-note', content: 'Add new note' },
        ]}
        showContextMenu={showContextMenu}
        position={mousePosition}
        closeContextMenu={() => setShowContextMenu(false)}
        doMenu={doMenu}
      />
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
            } else if (item.type === 'tba-note') {
              return <NeTBANote key={item.id} tbaNote={item} />;
            }
          })
        )}
      </div>
    </div>
  )
}

export default NeFolder;
