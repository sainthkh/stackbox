import React, { useRef, useEffect } from 'react';
import { MousePosition } from 'src/types';
import { useOutsideClick } from '../hooks';

export type MenuItem<T> = {
  id: string
  command: T
  content: string
}

export interface ContextMenuProps<T> {
  menuId: string;
  menuItems: MenuItem<T>[]
  showContextMenu: boolean;
  position: MousePosition;
  closeContextMenu: () => void;
  doMenu: (menu: T) => void;
}

export default function NeContextMenu<T>({
  menuId,
  menuItems,
  showContextMenu,
  position,
  closeContextMenu,
  doMenu,
}: ContextMenuProps<T>) {
  const contextMenuRef = useRef<HTMLDivElement>(null);

  useOutsideClick(contextMenuRef, () => closeContextMenu());

  const genOnClick = (command: T) => (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    doMenu(command);
    closeContextMenu();
  }

  const handleOnClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  }

  return (
    <>
      {showContextMenu && (
        <div
          ref={contextMenuRef}
          id={menuId}
          className="absolute bg-sidebar-bg border border-border shadow-md rounded z-[1000] overflow-hidden min-w-[150px]"
          onClick={handleOnClick}
          style={{ top: position.y, left: position.x }}
        >
          {menuItems.map((item, i) => {
            return (
              <div
                id={item.id}
                className="px-2 py-1 text-xs cursor-pointer text-text-primary transition-colors duration-200 hover:bg-sidebar-active"
                onClick={genOnClick(item.command)}
              >
                {item.content}
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
