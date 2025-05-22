import React from 'react';
import { useAppDispatch } from '../../redux/hooks';
import { NeTBANote, noteName, saveTBANote, cancelTBANote } from '../../redux/boxSlice';
import EditableNoteName from './EditableNoteName';
import { getPaddingLeft } from '../util';
import { get } from 'http';

export interface NeTBANoteProps {
  tbaNote: NeTBANote;
  level: number;
}

const NeTBANote: React.FC<NeTBANoteProps> = ({
  tbaNote,
  level,
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
    <div
      style={{
        paddingLeft: getPaddingLeft(level),
      }}
    >
      <EditableNoteName
        name={noteName(tbaNote)}
        onFinishEdit={onFinishEdit}
        onCancelEdit={onCancelEdit}
      />
    </div>
  );
};

export default NeTBANote;
