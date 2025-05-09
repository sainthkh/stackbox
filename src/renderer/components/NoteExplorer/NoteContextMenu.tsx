import React, { useRef, useEffect } from 'react';
import { MousePosition } from 'src/types';

export type NoteContext = 'rename'

export interface NoteContextMenuProps {
  showContextMenu: boolean;
  position: MousePosition;
  closeContextMenu: () => void;
  doMenu: (menu: NoteContext) => void;
}

const NoteContextMenu: React.FC<NoteContextMenuProps> = ({
  showContextMenu,
  position,
  closeContextMenu,
  doMenu,
}) => {
  const contextMenuRef = useRef<HTMLDivElement>(null);

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        closeContextMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      {showContextMenu && (
        <div
          ref={contextMenuRef}
          id="note-context-menu"
          className="absolute bg-sidebar-bg border border-border shadow-md rounded z-[1000] overflow-hidden min-w-[150px]"
          style={{ top: position.y, left: position.x }}
        >
          <div
            id="rename-note"
            className="px-2 py-1 text-xs cursor-pointer text-text-primary transition-colors duration-200 hover:bg-sidebar-active"
            onClick={() => {
              doMenu('rename');
              closeContextMenu();
            }}
          >
            Rename
          </div>
        </div>
      )}
    </>
  )
}

export default NoteContextMenu;
