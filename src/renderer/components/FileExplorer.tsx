import React, { useState } from 'react';
import { Note, Folder } from '../types';
import { DocumentTextIcon, FolderIcon, PlusIcon } from '@heroicons/react/24/outline';

interface FileExplorerProps {
  folders: Folder[];
  activeNote: Note | null;
  onSelectNote: (note: Note) => void;
  onCreateNote: (folderId: string) => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ folders, activeNote, onSelectNote, onCreateNote }) => {
  const [expandedFolders, setExpandedFolders] = useState<string[]>(folders.map(folder => folder.id));

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev =>
      prev.includes(folderId)
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    );
  };

  return (
    <div className="h-full bg-sidebar-bg border-r border-border overflow-y-auto">
      <div className="px-3 py-4 text-lg text-white font-medium border-b border-border">
        Notes
      </div>
      <div>
        {folders.map(folder => (
          <div key={folder.id}>
            <div
              className="flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-sidebar-active"
              onClick={() => toggleFolder(folder.id)}
            >
              <FolderIcon className="h-4 w-4 mr-2" />
              <span>{folder.name}</span>
              <button
                className="ml-auto text-text-secondary hover:text-text-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  onCreateNote(folder.id);
                }}
              >
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>

            {expandedFolders.includes(folder.id) && (
              <div className="pl-4">
                {folder.notes.map(note => (
                  <div
                    key={note.id}
                    className={`sidebar-item ${activeNote?.id === note.id ? 'bg-sidebar-active' : ''}`}
                    onClick={() => onSelectNote(note)}
                  >
                    <DocumentTextIcon className="h-4 w-4 mr-2" />
                    <span className="truncate">{note.title || 'Untitled'}</span>
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