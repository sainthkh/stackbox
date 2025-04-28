import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import FileExplorer from './components/FileExplorer';
import MarkdownEditor from './components/MarkdownEditor';
import { Note, Folder } from './types';

const App: React.FC = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [activeNote, setActiveNote] = useState<Note | null>(null);

  // Load notes from sample-box on startup
  useEffect(() => {
    try {
      const sampleBoxPath = path.resolve('./sample-box');
      
      // Check if directory exists
      if (fs.existsSync(sampleBoxPath)) {
        const files = fs.readdirSync(sampleBoxPath);
        
        const notes = files
          .filter(file => file.endsWith('.md'))
          .map(file => {
            const filePath = path.join(sampleBoxPath, file);
            const content = fs.readFileSync(filePath, 'utf-8');
            
            // Get title from filename without extension
            const title = file.replace(/\.md$/, '');
            
            return {
              id: `note-${uuidv4()}`,
              title,
              content,
              lastModified: fs.statSync(filePath).mtime.getTime(),
            };
          });
        
        // Create folder with the loaded notes
        const sampleFolder: Folder = {
          id: 'sample-box',
          name: 'Sample Box',
          notes,
        };
        
        setFolders([sampleFolder]);
        
        // Set the first note as active if available
        if (notes.length > 0) {
          setActiveNote(notes[0]);
        }
      }
    } catch (error) {
      console.error('Error loading sample notes:', error);
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