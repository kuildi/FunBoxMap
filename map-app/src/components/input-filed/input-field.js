import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { ADD_POINT } from '../../services/actions/constants';
import { getRandomNum } from '@funboxteam/diamonds';

const InputField = () => {
    const dispatch = useDispatch();
    const inputRef = useRef(null);

    const addPoint = (e) => {
        if (e.code === 'Enter' && inputRef.current.value) {
            dispatch({
                type: ADD_POINT,
                point: { 
                    text: inputRef.current.value, 
                    pointKey: getRandomNum(1, 200) 
                }
            })
        }
    }

    return (
        <>
            <input ref={inputRef} onKeyDown={addPoint} type='text' placeholder='Введите адрес'></input>
        </>
    )
}

export default InputField;