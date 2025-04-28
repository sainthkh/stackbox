import React, { useState } from 'react';
import { Note } from '../types';

interface MarkdownEditorProps {
  note: Note | null;
  onNoteChange: (content: string) => void;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ note, onNoteChange }) => {
  if (!note) {
    return (
      <div className="flex items-center justify-center h-full text-text-secondary">
        Select a note or create a new one
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="bg-sidebar-bg border-b border-border p-2 flex justify-between items-center">
        <div id="note-title" className="text-sm font-medium truncate">
          {note.title || 'Untitled'}
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <textarea
          className="w-full h-full bg-black text-text-primary p-4 resize-none outline-none border-none"
          value={note.content}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder="Write your markdown here..."
        />
      </div>
    </div>
  );
};

export default MarkdownEditor;