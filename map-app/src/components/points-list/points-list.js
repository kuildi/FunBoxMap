import React from 'react';
import { useSelector } from 'react-redux';

import ListStyles from './points-list.module.css'
import PointCard  from '../point-card/point-card';

const PointsList = () => {
    const points = useSelector(store => store.pathPoints.points);

    const pointsCards = points.map(item =>
        <PointCard key={item.pointKey} {...item} />
    )

    return (
        <ul className={ListStyles.points_list}>
            {pointsCards}
        </ul>
    )
}

export default PointsList;