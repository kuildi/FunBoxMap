import React from 'react';
import ReactDOM from 'react-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Provider } from 'react-redux';
import { store } from '../../services/store';
import PointCard from './point-card';

it('PointCard renders without crashing', () => {
    let props = { text: 'Волгоград', pointKey: 1 }
    const div = document.createElement('div');
    ReactDOM.render(
        <Provider store={store}>
            <DndProvider backend={HTML5Backend}>
                <PointCard {...props} />
            </DndProvider>
        </Provider>
        , div);
});