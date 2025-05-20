import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { updateOpenNoteContent, updateOpenNoteTitle, renameNote, saveNote } from '../redux/boxSlice';

interface MarkdownEditorProps {
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = () => {
  const dispatch = useAppDispatch();
  const { openNote: note } = useAppSelector(state => state.box);

  if (!note) {
    return (
      <div
        id="no-selected"
        className="flex items-center justify-center h-full text-text-secondary">
        Select a note or create a new one
      </div>
    );
  }

  // Title

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateOpenNoteTitle(e.target.value));
  };

  const handleTitleBlur = () => {
    dispatch(renameNote(note.notePath, note.title));
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  // Content

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(updateOpenNoteContent(e.target.value));
  };

  var timer: NodeJS.Timeout | null = null;

  const handleContentFocus = () => {
    timer = setInterval(() => {
      dispatch(saveNote(note.notePath, note.content));
    }, 100 * 1000)
  }

  const handleContentBlur = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }

    dispatch(saveNote(note.notePath, note.content));
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
          id="note-content"
          className="w-full h-full bg-black text-text-primary p-4 resize-none outline-none border-none"
          value={note.content}
          onFocus={handleContentFocus}
          onBlur={handleContentBlur}
          onChange={handleContentChange}
          placeholder="Write your markdown here..."
        />
      </div>
    </div>
  );
};

export default MarkdownEditor;
