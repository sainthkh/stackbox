import React from 'react';
import { NeTBANote } from '../../redux/boxSlice';

export interface NeTBANoteProps {
  tbaNote: NeTBANote;
}

const NeTBANote: React.FC<NeTBANoteProps> = ({
  tbaNote,
}) => {
  const notePath = tbaNote.path;
  const initialName = notePath[notePath.length - 1];

  return (
    <div>
      <div className="note-name flex items-center px-3 py-1 text-xs cursor-pointer hover:bg-sidebar-active">
        {initialName}
      </div>
    </div>
  );
};

export default NeTBANote;
