import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import styles from './app.module.css';
import InputField from '../input-filed/input-field';
import PointsList from '../points-list/points-list';
import MapComponent from '../map/map';

function App() {

  return (
    <main className={styles.main_container}>
      <section>
        <InputField />
        <DndProvider backend={HTML5Backend}>
          <PointsList />
        </DndProvider>
      </section>
      <MapComponent />
    </main>
  );
}

export default App;
