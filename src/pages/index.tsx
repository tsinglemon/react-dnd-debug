import React from 'react';
import styles from './index.css';

import { DndProvider, useDrag, useDrop } from '@/packages/react-dnd/src';

console.log(DndProvider);

export default function() {
  return (
    <div className={styles.normal}>
      <div className={styles.welcome}/>
      <ul className={styles.list}>
        <li>To get started, edit <code>src/pages/index.js</code> and save to reload.</li>
        <li>
          <a href="https://umijs.org/guide/getting-started.html">
            Getting Started
          </a>
        </li>
      </ul>
    </div>
  );
}
