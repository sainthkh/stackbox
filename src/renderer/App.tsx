import React, { useState, useEffect } from 'react';
import FileExplorer from './components/FileExplorer';
import MarkdownEditor from './components/MarkdownEditor';
import { Note, Folder } from './types';

const App: React.FC = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
  const [titleValue, setTitleValue] = useState<string>('');

  // Load notes from sample-box on startup
  useEffect(() => {
    const loadSampleNotes = async () => {
      try {
        // Resolve the sample-box path
        const sampleBoxPath = await window.electronAPI.resolvePath('./sample-box');

        // Get files via IPC
        const files = await window.electronAPI.loadNotes(sampleBoxPath);

        const notes = await Promise.all(
          files.map(async (file) => {
            // Read file content via IPC
            const content = await window.electronAPI.readFile(file.filePath);
            const uuid = await window.electronAPI.uuid();

            // Get title from filename without extension
            const title = file.fileName.replace(/\.md$/, '');

            return {
              id: `note-${uuid}`,
              title,
              content,
              lastModified: file.lastModified,
              filePath: file.filePath,
            };
          })
        );

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
          setTitleValue(notes[0].title);
        }

        // Set the sample folder as expanded
        setExpandedFolders(['sample-box']);
      } catch (error) {
        console.error('Error loading sample notes:', error);
      }
    };

    loadSampleNotes();
  }, []);

  const handleSelectNote = (note: Note) => {
    setActiveNote(note);
    setTitleValue(note.title);
  };

  const handleNoteChange = async (content: string) => {
    if (!activeNote) return;

    // Update the active note content
    const updatedNote = { ...activeNote, content, lastModified: Date.now() };

    // Save the file if it has a filePath
    if (updatedNote.filePath) {
      try {
        await window.electronAPI.writeFile(updatedNote.filePath, content);
      } catch (error) {
        console.error('Error saving note:', error);
      }
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

  const handleCreateNote = async (folderId: string) => {
    try {
      const folder = folders.find(f => f.id === folderId);
      if (!folder) return;

      // Find existing untitled notes to determine name
      const untitledNotes = folder.notes.filter(note =>
        note.title.startsWith('Untitled') || note.title === 'Untitled'
      );

      let title = 'Untitled';

      // If "Untitled" exists, find the next number.
      // Ignore the gaps.
      if (untitledNotes.length > 0) {
        const numbers = untitledNotes
          .map(note => {
            const match = note.title.match(/^Untitled(?: (\d+))?$/);
            return match ? (match[1] ? parseInt(match[1]) : 1) : 0;
          })
          .filter(num => num > 0)
          .sort((a, b) => b - a); // Sort in descending order

        let nextNumber = numbers[0] + 1;

        title = `Untitled ${nextNumber}`;
      }

      // Generate a unique filename
      const filename = `${title}.md`;
      const sampleBoxPath = await window.electronAPI.resolvePath('./sample-box');
      const filePath = `${sampleBoxPath}/${filename}`;

      // Initial content
      const content = ``;

      // Save the file
      await window.electronAPI.writeFile(filePath, content);
      const uuid = await window.electronAPI.uuid();

      const newNote: Note = {
        id: `note-${uuid}`,
        title,
        content,
        lastModified: Date.now(),
        filePath,
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
      setTitleValue(newNote.title);
    } catch (error) {
      console.error('Error creating new note:', error);
    }
  };

  const handleToggleFolder = (folderId: string) => {
    setExpandedFolders(prev =>
      prev.includes(folderId)
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    );
  };

  const handleTitleChange = (value: string) => {
    setTitleValue(value);

    if (activeNote) {
      // Update the note title
      const updatedNote = { ...activeNote, title: value, lastModified: Date.now() };

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
    }
  };
  
  const handleRenameNote = async (noteId: string, newName: string) => {
    try {
      // Find the note to rename
      let foundNote: Note | null = null;
      let foundFolder: Folder | null = null;
      
      for (const folder of folders) {
        const note = folder.notes.find(n => n.id === noteId);
        if (note) {
          foundNote = note;
          foundFolder = folder;
          break;
        }
      }
      
      if (!foundNote || !foundNote.filePath || !foundFolder) return;
      
      // Add .md extension if not present
      const newTitle = newName.endsWith('.md') ? newName : `${newName}.md`;
      const sampleBoxPath = await window.electronAPI.resolvePath('./sample-box');
      const newFilePath = `${sampleBoxPath}/${newTitle}`;
      
      // Rename the physical file
      await window.electronAPI.renameFile(foundNote.filePath, newFilePath);
      
      // Update the note in state
      const updatedNote = {
        ...foundNote,
        title: newName, // Keep the title without .md extension for display
        filePath: newFilePath,
        lastModified: Date.now()
      };
      
      // Update state
      setFolders(prev =>
        prev.map(folder => ({
          ...folder,
          notes: folder.notes.map(note =>
            note.id === noteId ? updatedNote : note
          ),
        }))
      );
      
      // Update active note if it's the one being renamed
      if (activeNote && activeNote.id === noteId) {
        setActiveNote(updatedNote);
        setTitleValue(updatedNote.title);
      }
    } catch (error) {
      console.error('Error renaming file:', error);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-64 h-full">
        <FileExplorer
          folders={folders}
          activeNote={activeNote}
          expandedFolders={expandedFolders}
          onSelectNote={handleSelectNote}
          onCreateNote={handleCreateNote}
          onToggleFolder={handleToggleFolder}
          onRenameNote={handleRenameNote}
        />
      </div>
      <div className="flex-1 h-full">
        <MarkdownEditor
          note={activeNote}
          titleValue={titleValue}
          onTitleChange={handleTitleChange}
          onNoteChange={handleNoteChange}
        />
      </div>
    </div>
  );
};

export default App;