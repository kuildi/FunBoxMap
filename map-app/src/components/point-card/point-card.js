import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useDrop, useDrag } from 'react-dnd';
import { IoReorderTwoOutline, IoCloseOutline } from "react-icons/io5";

import CardStyles from './point-card.module.css';
import { REMOVE_POINT, DRAG_SORT } from '../../services/actions/constants';

const PointCard = (props) => {
    const dispatch = useDispatch();
    const ref = useRef(null);

    const removePoint = (pointKey) => {
        dispatch({
            type: REMOVE_POINT,
            key: pointKey
        })
    }

    const [, drop] = useDrop({
        accept: 'DRAG_POINT',
        hover(item, monitor) {
            if (!ref.current) {
                return;
            }

            const dragIndex = item.pointKey;
            const hoverIndex = props.pointKey;

            if (dragIndex === hoverIndex) {
                return;
            }

            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;

            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }

            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }

            dispatch({
                type: DRAG_SORT,
                dragIndex: dragIndex,
                hoverIndex: hoverIndex
            })
        }
    });

    const [{ isDragging }, drag] = useDrag({
        type: 'DRAG_POINT',
        item: { ...props },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        })
    });

    const opacity = isDragging ? 0.5 : 1;
    drag(drop(ref));

    return (
        <li ref={ref} className={CardStyles.point_card} style={{ opacity }}>
            <IoReorderTwoOutline className={`${CardStyles.point_icon} ${CardStyles.point_icon__drag}`}/>
            <p className={CardStyles.point_title} title={props.text}>{props.text}</p>
            <button
                className={CardStyles.point_button}
                title='Удалить точку'
                onClick={() => removePoint(props.pointKey)}
            >
                <IoCloseOutline className={`${CardStyles.point_icon} ${CardStyles.point_icon__remove}`} />
            </button>
        </li>
    )
}

export default PointCard;