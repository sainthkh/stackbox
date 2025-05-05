import React, { useState, useEffect, } from 'react';
import { Note, Folder } from '../redux/notesSlice';
import FolderContextMenu, { FolderContextMenuData } from './FolderContextMenu';
import NoteContextMenu, { NoteContextMenuData } from './NoteContextMenu';
import EditableFileName from './EditableFileName';
import { ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

interface FileExplorerProps {
  folders: Folder[];
  activeNote: Note | null;
  expandedFolders: string[];
  onSelectNote: (note: Note) => void;
  onCreateNote: (folderId: string) => void;
  onToggleFolder: (folderId: string) => void;
  onRenameNote: (noteId: string, newName: string) => void;
}

const isFolderExpanded = (folderId: string, expandedFolders: string[]) => {
  return expandedFolders.includes(folderId);
}

const FileExplorer: React.FC<FileExplorerProps> = ({
  folders,
  activeNote,
  expandedFolders,
  onSelectNote,
  onCreateNote,
  onToggleFolder,
  onRenameNote
}) => {
  const [folderContextMenu, setFolderContextMenu] = useState<FolderContextMenuData | null>(null);
  const [noteContextMenu, setNoteContextMenu] = useState<NoteContextMenuData | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  const handleFolderContextMenu = (e: React.MouseEvent, folderId: string) => {
    e.preventDefault();
    e.stopPropagation();

    setFolderContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      folderId
    });
  };

  const handleNoteContextMenu = (e: React.MouseEvent, folderId: string, note: Note) => {
    e.preventDefault();
    e.stopPropagation();

    setNoteContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      folderId,
      noteId: note.id
    });
  };

  const handleNoteRename = (noteId: string) => {
    setEditingNoteId(noteId);
  };

  const handleFinishEdit = (noteId: string, newName: string) => {
    onRenameNote(noteId, newName);
    setEditingNoteId(null);
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
  };

  // Handle F2 key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2' && activeNote) {
        setEditingNoteId(activeNote.id);
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeNote]);

  return (
    <div className="h-full bg-sidebar-bg border-r border-border overflow-y-auto">
      <FolderContextMenu
        contextMenuData={folderContextMenu}
        onCreateNote={onCreateNote}
        setContextMenu={setFolderContextMenu}
      />
      <NoteContextMenu
        contextMenuData={noteContextMenu}
        onRenameNote={handleNoteRename}
        setContextMenu={setNoteContextMenu}
      />
      <div id="notes">
        {folders.map(folder => (
          <div key={folder.id}>
            <div
              className="folder-name flex items-center px-3 py-1 text-xs cursor-pointer hover:bg-sidebar-active"
              onClick={() => onToggleFolder(folder.id)}
              onContextMenu={(e) => handleFolderContextMenu(e, folder.id)}
            >
              {isFolderExpanded(folder.id, expandedFolders)
                ? <ChevronDownIcon className="h-4 w-4 mr-2" />
                : <ChevronRightIcon className="h-4 w-4 mr-2" />
              }
              <span>{folder.name}</span>
            </div>

            {isFolderExpanded(folder.id, expandedFolders) && (
              <div className="pl-4">
                {folder.notes.map(note => (
                  <div
                    key={note.id}
                    className={`note-name flex items-center px-3 py-1 text-xs cursor-pointer hover:bg-sidebar-active ${activeNote?.id === note.id ? 'bg-sidebar-active' : ''}`}
                    onClick={() => onSelectNote(note)}
                    onContextMenu={(e) => handleNoteContextMenu(e, folder.id, note)}
                  >
                    <EditableFileName
                      name={note.title || 'Untitled'}
                      isEditing={editingNoteId === note.id}
                      onFinishEdit={(newName) => handleFinishEdit(note.id, newName)}
                      onCancelEdit={handleCancelEdit}
                    />
                  </div>
                ))}
                {folder.notes.length === 0 && (
                  <div className="px-3 py-2 text-sm text-text-secondary italic">
                    No notes
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileExplorer;