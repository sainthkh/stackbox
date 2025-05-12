import React from 'react';
import { useAppDispatch } from '../../redux/hooks';
import { NeTBANote, noteName, saveTBANote, cancelTBANote } from '../../redux/boxSlice';
import EditableNoteName from './EditableNoteName';

export interface NeTBANoteProps {
  tbaNote: NeTBANote;
}

const NeTBANote: React.FC<NeTBANoteProps> = ({
  tbaNote,
}) => {
  const dispatch = useAppDispatch();

  const onFinishEdit = (newName: string) => {
    dispatch(saveTBANote(tbaNote.path, newName))
  }

  const onCancelEdit = () => {
    dispatch(cancelTBANote({
      notePath: tbaNote.path,
    }))
  }

  return (
    <div>
      <EditableNoteName
        name={noteName(tbaNote)}
        onFinishEdit={onFinishEdit}
        onCancelEdit={onCancelEdit}
      />
    </div>
  );
};

export default NeTBANote;
