import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Note } from '../types';

interface MarkdownEditorProps {
  note: Note | null;
  onNoteChange: (content: string) => void;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ note, onNoteChange }) => {
  const [isPreview, setIsPreview] = useState(false);

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
        <div className="text-sm font-medium truncate">
          {note.title || 'Untitled'}
        </div>
        <div>
          <button
            onClick={() => setIsPreview(!isPreview)}
            className={`px-3 py-1 text-xs rounded ${isPreview ? 'bg-accent text-white' : 'bg-sidebar-active text-text-primary'}`}
          >
            {isPreview ? 'Edit' : 'Preview'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {isPreview ? (
          <div className="p-4 overflow-auto h-full overflow-auto">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {note.content}
            </ReactMarkdown>
          </div>
        ) : (
          <textarea
            className="w-full h-full bg-black text-text-primary p-4 resize-none outline-none border-none"
            value={note.content}
            onChange={(e) => onNoteChange(e.target.value)}
            placeholder="Write your markdown here..."
          />
        )}
      </div>
    </div>
  );
};

export default MarkdownEditor;