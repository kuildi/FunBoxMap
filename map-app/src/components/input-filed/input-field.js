import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { getRandomNum } from '@funboxteam/diamonds';

import { ADD_POINT } from '../../services/actions/constants';
import InputStyles from './input-field.module.css';

const InputField = () => {
    const dispatch = useDispatch();
    const inputRef = useRef(null);

    const addPoint = (e) => {
        if (e.code === 'Enter' && inputRef.current.value  && inputRef.current.value.trim().length) {
            dispatch({
                type: ADD_POINT,
                point: {
                    text: inputRef.current.value,
                    pointKey: getRandomNum(1, 200) //Сгенерируем уникальный ключ, 
                                                   //который поможет при drag-n-drop и удалении точки
                }
            })
            inputRef.current.value = '';
        }
    }

    return (
        <>
            <input
                ref={inputRef}
                onKeyDown={addPoint}
                type='text'
                className={InputStyles.input_field}
                placeholder='Введите адрес'
            ></input>
        </>
    )
}

export default InputField;