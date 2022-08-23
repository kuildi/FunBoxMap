import {
    ADD_POINT,
    REMOVE_POINT,
    DRAG_SORT,
    UPDATE_POINTS,
    UPDATE_DUR_DIS
} from "../actions/constants";

const initialState = {
    points: [],
    duration: null,
    distance: null,
}

export const pathPoints = (state = initialState, action) => {
    switch (action.type) {
        case ADD_POINT: {
            return {
                ...state,
                points: [...state.points, action.point]
            };
        }
        case REMOVE_POINT: {
            return {
                ...state,
                points: [...state.points].filter(item => item.pointKey !== action.key)
            };
        }
        case UPDATE_POINTS: {
            const newPointsArr = [...state.points];

            newPointsArr[action.index].text = action.text;

            return {
                ...state,
                points: [...newPointsArr]
            };
        }
        case UPDATE_DUR_DIS: {
            return {
                ...state,
                duration: action.duration,
                distance: action.distance
            };
        }
        case DRAG_SORT: {
            const newPointsArr = [...state.points];
            const indexTo = newPointsArr.indexOf(newPointsArr.find(item => item.pointKey === action.hoverIndex));
            const indexFrom = newPointsArr.indexOf(newPointsArr.find(item => item.pointKey === action.dragIndex));
            const dragItem = newPointsArr[indexFrom];

            // Удалим перетаскиваемый элемент и вставим его на нужную позицию
            newPointsArr.splice(indexFrom, 1);
            newPointsArr.splice(indexTo, 0, dragItem);

            return {
                ...state,
                points: newPointsArr
            }
        }
        default: {
            return state;
        }
    }
}