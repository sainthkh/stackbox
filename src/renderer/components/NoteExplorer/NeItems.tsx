import React, { useState, useEffect, } from 'react';
import { type NeItem } from '../../redux/boxSlice';
import NeFolder from './NeFolder';
import NeNote from './NeNote';
import NeTBANote from './NeTBANote';

export interface NeItemProps {
  items: NeItem[];
  level: number;
}

const NeItems: React.FC<NeItemProps> = ({
  items,
  level,
}) => {
  return (
    <>
      {items.map((item) => {
        if (item.type === 'folder') {
          return <NeFolder key={item.id} folder={item} level={level} />;
        } else if (item.type === 'note') {
          return <NeNote key={item.id} note={item} level={level} />;
        } else if (item.type === 'tba-note') {
          return <NeTBANote key={item.id} tbaNote={item} level={level} />;
        }
      })}
    </>
  )
}

export default NeItems;
