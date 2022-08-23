import React from 'react';
import styles from './app.module.css';
import InputField from '../input-filed/input-field';
import PointsList from '../points-list/points-list';
import MapComponent from '../map/map';
import './vars.css'

function App() {
  return (
    <main className={styles.main_container}>
      <section className={styles.controls_container}>
        <InputField />
        <PointsList />
      </section>
      <MapComponent />
    </main>
  );
}

export default App;
