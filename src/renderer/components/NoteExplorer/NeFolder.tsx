import React, { useState, useEffect, } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { type NeFolder, toggleFolder, addTBANoteToFolder } from '../../redux/boxSlice';
import NeContextMenu from './NeContextMenu';
import { ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import NeItems from './NeItems';
import { getPaddingLeft } from '../util';

type FolderContextCommand =
  | 'add-new-note'
  ;

export interface NeFolderProps {
  folder: NeFolder;
  level: number;
}

const NeFolder: React.FC<NeFolderProps> = ({
  folder,
  level,
}) => {
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
    <>
      <div
        className={`folder-name items-center py-1 pr-3 text-xs cursor-pointer hover:bg-sidebar-active`}
        style={{
          paddingLeft: getPaddingLeft(level),
        }}
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
      </div>
      {folder.expanded && <NeItems items={folder.items} level={level + 1} />}
    </>
  )
}

export default NeFolder;
