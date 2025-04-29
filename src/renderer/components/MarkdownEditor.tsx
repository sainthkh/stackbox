import React, { useState } from 'react';
import { Note } from '../types';

interface MarkdownEditorProps {
  note: Note | null;
  onNoteChange: (content: string) => void;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ note, onNoteChange }) => {
  const [titleValue, setTitleValue] = useState(note ? note.title : '');

  if (!note) {
    return (
      <div className="flex items-center justify-center h-full text-text-secondary">
        Select a note or create a new one
      </div>
    );
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitleValue(e.target.value);
  };

  const handleTitleBlur = () => {
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="bg-black border-b border-border p-2 flex justify-between items-center">
        <input
          type="text"
          className="bg-transparent text-base font-medium outline-none px-1 w-full"
          value={titleValue}
          onChange={handleTitleChange}
          onBlur={handleTitleBlur}
          onKeyDown={handleTitleKeyDown}
          autoFocus
        />
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