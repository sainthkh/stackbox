import React, { useRef, useEffect } from 'react';

export type FolderContextMenuData = {
  visible: boolean;
  x: number;
  y: number;
  folderId: string;
  noteId?: string;
}

interface FolderContextMenuProps {
  contextMenuData: FolderContextMenuData | null;
  onCreateNote: (folderId: string) => void;
  onRenameNote?: (noteId: string) => void;
  setContextMenu: (data: FolderContextMenuData | null) => void;
}

const FolderContextMenu: React.FC<FolderContextMenuProps> = ({
  contextMenuData,
  onCreateNote,
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

  const handleCreateUntitledNote = (folderId: string) => {
    // Create the new note with the appropriate title
    onCreateNote(folderId);
    setContextMenu(null);
  };

  return (
    <>
      {contextMenuData && contextMenuData.visible && (
        <div
          ref={contextMenuRef}
          id="folder-context-menu"
          className="absolute bg-sidebar-bg border border-border shadow-md rounded z-[1000] overflow-hidden min-w-[150px]"
          style={{ top: contextMenuData.y, left: contextMenuData.x }}
        >
          <div
            id="create-new-note"
            className="px-2 py-1 text-xs cursor-pointer text-text-primary transition-colors duration-200 hover:bg-sidebar-active"
            onClick={() => handleCreateUntitledNote(contextMenuData.folderId)}
          >
            Create new note
          </div>
        </div>
      )}
    </>
  )
}

export default FolderContextMenu;