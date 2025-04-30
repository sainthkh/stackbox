import React, { useState, useRef, useEffect } from 'react';

interface EditableFileNameProps {
  name: string;
  isEditing: boolean;
  onFinishEdit: (newName: string) => void;
  onCancelEdit: () => void;
}

const EditableFileName: React.FC<EditableFileNameProps> = ({
  name,
  isEditing,
  onFinishEdit,
  onCancelEdit,
}) => {
  const [editedName, setEditedName] = useState(name);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      // Select the name part without extension
      const nameWithoutExt = name.replace(/\.md$/, '');
      inputRef.current.setSelectionRange(0, nameWithoutExt.length);
    }
  }, [isEditing, name]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedName(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // Submit on Enter
      const newName = editedName.trim() || name;
      onFinishEdit(newName);
    } else if (e.key === 'Escape') {
      // Cancel on Escape
      onCancelEdit();
    }
  };

  const handleBlur = () => {
    // Submit on blur
    const newName = editedName.trim() || name;
    onFinishEdit(newName);
  };

  if (isEditing) {
    return (
      <input
        id="editable-file-name"
        ref={inputRef}
        type="text"
        value={editedName}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className="w-full bg-transparent text-xs px-0 py-0 border-none focus:outline-none focus:ring-0"
      />
    );
  }

  return (
    <span className="truncate flex-1">{name.replace(/\.md$/, '') || 'Untitled'}</span>
  );
};

export default EditableFileName;