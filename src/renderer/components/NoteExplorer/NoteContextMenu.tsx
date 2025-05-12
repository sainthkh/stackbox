import React, { useRef, useEffect } from 'react';
import { MousePosition } from 'src/types';

export type NoteContextCommand =
  | 'rename'
  | 'subsequent'
  | 'branch-out'
  | 'next-topic'
  ;

export interface NoteContextMenuProps {
  showContextMenu: boolean;
  position: MousePosition;
  closeContextMenu: () => void;
  doMenu: (menu: NoteContextCommand) => void;
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

  const genOnClick = (command: NoteContextCommand) => (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    doMenu(command);
    closeContextMenu();
  }

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
            id="create-subsequent-note"
            className="px-2 py-1 text-xs cursor-pointer text-text-primary transition-colors duration-200 hover:bg-sidebar-active"
            onClick={genOnClick('subsequent')}
          >
            Subsequent Note
          </div>
          <div
            id="branch-out-note"
            className="px-2 py-1 text-xs cursor-pointer text-text-primary transition-colors duration-200 hover:bg-sidebar-active"
            onClick={genOnClick('branch-out')}
          >
            Branch out Note
          </div>
          <div
            id="next-topic-note"
            className="px-2 py-1 text-xs cursor-pointer text-text-primary transition-colors duration-200 hover:bg-sidebar-active"
            onClick={genOnClick('next-topic')}
          >
            Next Topic Note
          </div>
          <div
            id="rename-note"
            className="px-2 py-1 text-xs cursor-pointer text-text-primary transition-colors duration-200 hover:bg-sidebar-active"
            onClick={genOnClick('rename')}
          >
            Rename
          </div>
        </div>
      )}
    </>
  )
}

export default NoteContextMenu;
