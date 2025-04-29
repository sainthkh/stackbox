import React, { useState } from 'react';
import { Note, Folder } from '../types';
import { ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

interface FileExplorerProps {
  folders: Folder[];
  activeNote: Note | null;
  expandedFolders: string[];
  onSelectNote: (note: Note) => void;
  onCreateNote: (folderId: string) => void;
  onToggleFolder: (folderId: string) => void;
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
  onToggleFolder
}) => {

  return (
    <div className="h-full bg-sidebar-bg border-r border-border overflow-y-auto">
      <div id="notes">
        {folders.map(folder => (
          <div key={folder.id}>
            <div
              className="folder-name flex items-center px-3 py-1 text-xs cursor-pointer hover:bg-sidebar-active"
              onClick={() => onToggleFolder(folder.id)}
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
                  >
                    <span className="truncate flex-1">{note.title || 'Untitled'}</span>
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