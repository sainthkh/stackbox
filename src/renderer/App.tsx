import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import FileExplorer from './components/FileExplorer';
import MarkdownEditor from './components/MarkdownEditor';
import { Note, Folder } from './types';

const App: React.FC = () => {
  // Sample initial data
  const [folders, setFolders] = useState<Folder[]>([
    {
      id: 'folder-1',
      name: 'My Notes',
      notes: [
        {
          id: 'note-1',
          title: 'Welcome to Notes',
          content: '# Welcome to Notes\n\nThis is a markdown editor. You can use it to take notes and format them using markdown syntax.\n\n## Features\n\n- Create and organize notes\n- Format text with markdown\n- Preview your formatted notes\n\n```typescript\n// Example code block\nfunction hello() {\n  console.log("Hello, world!");\n}\n```\n\n> This is a blockquote\n\nEnjoy using Notes!',
          lastModified: Date.now(),
        },
      ],
    },
  ]);

  const [activeNote, setActiveNote] = useState<Note | null>(null);

  // Set the first note as active on load
  useEffect(() => {
    if (folders.length > 0 && folders[0].notes.length > 0) {
      setActiveNote(folders[0].notes[0]);
    }
  }, []);

  const handleSelectNote = (note: Note) => {
    setActiveNote(note);
  };

  const handleNoteChange = (content: string) => {
    if (!activeNote) return;

    // Update the active note content
    const updatedNote = { ...activeNote, content, lastModified: Date.now() };

    // Update the title based on the first line of content
    const titleMatch = content.match(/^#\s+(.*)/);
    if (titleMatch && titleMatch[1]) {
      updatedNote.title = titleMatch[1].substring(0, 50);
    } else {
      const firstLine = content.split('\n')[0];
      updatedNote.title = firstLine.substring(0, 50);
    }

    setActiveNote(updatedNote);

    // Update the note in the folders state
    setFolders(prev =>
      prev.map(folder => ({
        ...folder,
        notes: folder.notes.map(note =>
          note.id === activeNote.id ? updatedNote : note
        ),
      }))
    );
  };

  const handleCreateNote = (folderId: string) => {
    const newNote: Note = {
      id: `note-${uuidv4()}`,
      title: 'Untitled',
      content: '# Untitled',
      lastModified: Date.now(),
    };

    // Add the new note to the folder
    setFolders(prev =>
      prev.map(folder =>
        folder.id === folderId
          ? { ...folder, notes: [newNote, ...folder.notes] }
          : folder
      )
    );

    // Set the new note as active
    setActiveNote(newNote);
  };

  return (
    <div className="flex h-screen">
      <div className="w-64 h-full">
        <FileExplorer
          folders={folders}
          activeNote={activeNote}
          onSelectNote={handleSelectNote}
          onCreateNote={handleCreateNote}
        />
      </div>
      <div className="flex-1 h-full">
        <MarkdownEditor
          note={activeNote}
          onNoteChange={handleNoteChange}
        />
      </div>
    </div>
  );
};

export default App;