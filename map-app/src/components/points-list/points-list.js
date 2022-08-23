import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import { IoRemove } from 'react-icons/io5';

import ListStyles from './points-list.module.css'
import PointCard from '../point-card/point-card';

const PointsList = () => {
    const points = useSelector(store => store.pathPoints.points);
    const duration = useSelector(store => store.pathPoints.duration);
    const distance = useSelector(store => store.pathPoints.distance);
    const [startY, setStartY] = useState(0);
    const [finishY, setFinishY] = useState(0);

    const backendOptions = {
        enableMouseEvents: true
    }

    const pointsCards = points.map(item =>
        <PointCard key={item.pointKey} {...item} />
    );

    const onTouchStart = (event) => {
        if (event.target.classList.contains(ListStyles.points_container)) {
            setStartY(event.changedTouches[0].clientY)
        }
    }

    const onTouchEnd = (event) => {
        if (event.target.classList.contains(ListStyles.points_container)) {
            setFinishY(event.changedTouches[0].clientY)
        }
    }

    const startPoint = pointsCards[0];
    const finishPoint = pointsCards.length > 1 ? pointsCards[pointsCards.length - 1] : null;
    const refPointsCount = pointsCards.length > 2 ? pointsCards.length - 2 : null;

    const show = pointsCards.length ? ListStyles.points_container__show : '';
    const showInfo = duration ? ListStyles.info__show : '';
    const swiped = startY > finishY;
    const expandContainer = swiped ? ListStyles.points_container__expanded : '';

    const refPoints = <section className={ListStyles.points_ref_points}>{pointsCards.splice(1, pointsCards.length - 2)}</section>;
    const refPointsCounter = refPointsCount && <span className={ListStyles.points_counter}>{refPointsCount}</span>;

    return (
        <>
            <section
                className={`${ListStyles.points_container} ${show} ${expandContainer}`}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
            >
                <IoRemove className={`${ListStyles.swipeable_icon} ${ListStyles._only_mobile}`} />
                <p className={`${ListStyles.info} ${showInfo}`}>
                    {`В пути: ${duration} - ${distance}`}
                </p>
                <DndProvider backend={TouchBackend} options={backendOptions}>
                    <ul className={`${ListStyles.points_list} ${ListStyles._no_mobile}`}>
                        {pointsCards}
                    </ul>
                    <ul className={`${ListStyles.points_list} ${ListStyles._only_mobile}`}>
                        {startPoint}
                        {/* {
                            swiped ?
                                refPoints
                                :
                                refPointsCounter
                        } */}
                        {refPoints}
                        {refPointsCounter}
                        {finishPoint}
                    </ul>
                </DndProvider>
            </section>
        </>
    )
}

export default PointsList;