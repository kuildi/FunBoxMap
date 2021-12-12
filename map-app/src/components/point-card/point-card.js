import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useDrop, useDrag } from 'react-dnd';
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
        <li ref={ref} style={{ opacity }}>
            <p>{props.text}</p>
            <button onClick={() => removePoint(props.pointKey)}>Remove</button>
        </li>
    )
}

export default PointCard;