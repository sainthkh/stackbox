import React, { useRef, useEffect } from 'react';

export type NoteContextMenuData = {
  visible: boolean;
  x: number;
  y: number;
  folderId: string;
  noteId?: string;
}

interface NoteContextMenuProps {
  contextMenuData: NoteContextMenuData | null;
  onRenameNote: (noteId: string) => void;
  setContextMenu: (data: NoteContextMenuData | null) => void;
}

const NoteContextMenu: React.FC<NoteContextMenuProps> = ({
  contextMenuData,
  onRenameNote,
  setContextMenu,
}) => {
  const contextMenuRef = useRef<HTMLDivElement>(null);

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setContextMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      {contextMenuData && contextMenuData.visible && (
        <div
          ref={contextMenuRef}
          id="note-context-menu"
          className="absolute bg-sidebar-bg border border-border shadow-md rounded z-[1000] overflow-hidden min-w-[150px]"
          style={{ top: contextMenuData.y, left: contextMenuData.x }}
        >
          {contextMenuData.noteId && (
            <div
              id="rename-note"
              className="px-2 py-1 text-xs cursor-pointer text-text-primary transition-colors duration-200 hover:bg-sidebar-active"
              onClick={() => {
                onRenameNote(contextMenuData.noteId!);
                setContextMenu(null);
              }}
            >
              Rename
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default NoteContextMenu;