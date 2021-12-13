import { pathPoints } from './index';
import {
    ADD_POINT,
    REMOVE_POINT,
    DRAG_SORT,
    UPDATE_POINTS
} from "../actions/constants";

describe('pathPoints reducer', () => {
    const initialState = { points: [] };

    it('have initial state', () => {
        expect(pathPoints(undefined, {})).toEqual(initialState);
    });

    it('handle add point', () => {
        const newState = { points: [{ text: 'Волгоград', pointKey: 1 }] };
        expect(pathPoints(initialState, {
            type: ADD_POINT,
            point: {
                text: 'Волгоград',
                pointKey: 1
            },
        })).toEqual(newState);
    });

    it('handle remove point', () => {
        const state = { points: [{ text: 'Волгоград', pointKey: 1 }] };
        expect(pathPoints(state, {
            type: REMOVE_POINT,
            key: 1
        })).toEqual(initialState);
    });

    it('handle update points', () => {
        const stateBeforeUpdate = {
            points: [
                { text: 'Москва', pointKey: 2 },
                { text: 'Волгоград', pointKey: 1 }
            ]
        };
        const stateAfterUpdate = {
            points: [
                { text: 'Волгоград', pointKey: 1 },
                { text: 'Москва', pointKey: 2 }
            ]
        };
        expect(pathPoints(stateBeforeUpdate, {
            type: UPDATE_POINTS,
            payload: [
                { text: 'Волгоград', pointKey: 1 },
                { text: 'Москва', pointKey: 2 }
            ]
        })).toEqual(stateAfterUpdate);
    });

    it('handle drag sort', () => {
        const stateBeforeUpdate = {
            points: [
                { text: 'Волгоград', pointKey: 1 },
                { text: 'Москва', pointKey: 2 },
                { text: 'Ульяновск', pointKey: 3 }
            ]
        };
        const stateAfterUpdate = {
            points: [
                { text: 'Ульяновск', pointKey: 3 },
                { text: 'Москва', pointKey: 2 },
                { text: 'Волгоград', pointKey: 1 }
            ]
        };
        expect(pathPoints(stateBeforeUpdate, {
            type: DRAG_SORT,
            hoverIndex: 1,
            dragIndex: 3
        })).toEqual(stateAfterUpdate);
    });
});