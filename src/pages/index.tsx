import React, { Fragment } from 'react';
import styles from './index.css';

import { DndProvider, useDrag, useDrop } from '@/packages/react-dnd/src';
import htmlBackend from '@/packages/html5-backend/src';

export default function() {
  return (
    <Fragment>
      <DndProvider backend={htmlBackend}>
        hello
      </DndProvider>
    </Fragment>
  );
}
