import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { type OpenNote, updateOpenNoteContent, updateOpenNoteTitle } from '../redux/boxSlice';

interface MarkdownEditorProps {
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = () => {
  const dispatch = useAppDispatch();
  const { openNote: note } = useAppSelector(state => state.box);

  if (!note) {
    return (
      <div className="flex items-center justify-center h-full text-text-secondary">
        Select a note or create a new one
      </div>
    );
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateOpenNoteTitle(e.target.value));
  };

  const handleTitleBlur = () => {
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(updateOpenNoteContent(e.target.value));
  };

  return (
    <div className="h-full flex flex-col">
      <div className="bg-black border-b border-border p-2 flex justify-between items-center">
        <input
          id="note-title"
          type="text"
          className="bg-transparent text-base font-medium outline-none px-1 w-full"
          value={note.title}
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
          onChange={handleContentChange}
          placeholder="Write your markdown here..."
        />
      </div>
    </div>
  );
};

export default MarkdownEditor;
