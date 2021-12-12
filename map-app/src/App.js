import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import './App.css';
import InputField from './components/input-filed/input-field';
import PointsList from './components/points-list/points-list';
import MapComponent from './components/Map/map';

function App() {

  return (
    <div className="App">
      <InputField />
      <DndProvider backend={HTML5Backend}>
        <PointsList />
      </DndProvider>
      <MapComponent />
    </div>
  );
}

export default App;
