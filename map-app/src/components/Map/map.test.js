import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from '../../services/store';
import MapComponent from './map';

it('MapComponent renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
        <Provider store={store}>
            <MapComponent />
        </Provider>
        , div);
});