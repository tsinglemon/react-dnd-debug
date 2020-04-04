import React, { Fragment } from 'react';
import styles from './index.css';

import { DndProvider, useDrag, useDrop } from '@/packages/react-dnd/src';
import HTMLBackend from '@/packages/html5-backend/src';

const Box = () => {
  const [, drag] = useDrag({
    item: {
      type: 'card',
    },
    begin(_) {
      console.log('begin', _);
    },

    end(_, monitor) {
      console.log('end', monitor);
    },
  });
  return <div ref={drag} style={{ width: '100px', height: '100px', border: '1px solid' }}>
    拖我
  </div>;
};

const Target = () => {
  const [, drop] = useDrop({
    accept: 'card',
  });
  return <div
    ref={drop}
    style={{ width: '100px', height: '100px', border: '1px solid' }}
  >
    放这里
  </div>;
};

export default function() {
  return (
    <Fragment>
      <DndProvider backend={HTMLBackend}>
        <Box/>
        <Target/>
      </DndProvider>
    </Fragment>
  );
}
