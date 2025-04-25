import React, { useState } from 'react';

const App: React.FC = () => {
  const [notes, setNotes] = useState<string[]>([]);
  const [currentNote, setCurrentNote] = useState<string>('');

  const handleAddNote = () => {
    if (currentNote.trim() !== '') {
      setNotes([...notes, currentNote]);
      setCurrentNote('');
    }
  };

  return (
    <div className="app">
      <h1>Notes App</h1>
      <div className="note-input">
        <textarea
          value={currentNote}
          onChange={(e) => setCurrentNote(e.target.value)}
          placeholder="Type your note here..."
          rows={5}
        />
        <button onClick={handleAddNote}>Add Note</button>
      </div>
      <div className="notes-list">
        <h2>Your Notes</h2>
        {notes.length === 0 ? (
          <p>No notes yet. Add some!</p>
        ) : (
          <ul>
            {notes.map((note, index) => (
              <li key={index}>{note}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default App;