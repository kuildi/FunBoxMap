import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from '../../services/store';
import PointsList from './points-list';

it('PointsList renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
        <Provider store={store}>
            <PointsList />
        </Provider>
        , div);
});