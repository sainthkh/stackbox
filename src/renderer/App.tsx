import React, { useEffect } from 'react';
import NoteExplorer from './components/NoteExplorer/NoteExplorer';
import MarkdownEditor from './components/MarkdownEditor';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import {
  initialize,
  saveBoxState,
} from './redux/boxSlice';

const App: React.FC = () => {
  const dispatch = useAppDispatch();

  // Load notes from sample-box on startup
  useEffect(() => {
    dispatch(initialize());

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      dispatch(saveBoxState());
    }

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [dispatch]);

  return (
    <div className="flex h-screen">
      <div className="w-64 h-full">
        <NoteExplorer />
      </div>
      <div className="flex-1 h-full">
        <MarkdownEditor />
      </div>
    </div>
  );
};

export default App;
