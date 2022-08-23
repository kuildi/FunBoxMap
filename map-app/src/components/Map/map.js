import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { YMaps, Map } from 'react-yandex-maps';
import GridLoader from "react-spinners/GridLoader";

import { API_KEY, UPDATE_POINTS, UPDATE_DUR_DIS } from '../../services/actions/constants';
import styles from './map.module.css';

const MapComponent = () => {
    const dispatch = useDispatch();
    const points = useSelector(store => store.pathPoints.points);

    const mapState = {
        center: [55.750625, 37.626],
        zoom: 7,
        controls: []
    };
    const [ymaps, setYmaps] = useState(null);
    const myMap = useRef(null);
    let refPoints = [];

    points.forEach(item => refPoints.push(item.text));

    if (ymaps) {
        let multiRoute = new ymaps.multiRouter.MultiRoute(
            {
                referencePoints: refPoints
            },
            {
                wayPointDraggable: true,
                viaPointDraggable: true,
                boundsAutoApply: true
            }
        );

        const onObjectDrag = () => {
            let newPoints = multiRoute.getWayPoints();

            newPoints.each((item, i) => {
                if (typeof item.properties._data.request != 'string') {
                    ymaps.geocode(item.geometry.getCoordinates(), {
                        results: 1
                    }).then(res => {
                        let newContent = res.geoObjects.get(0) ?
                            res.geoObjects.get(0).properties.get('text') :
                            'Не удалось определить адрес.';

                        if (points[i].text !== newContent) {
                            dispatch({
                                type: UPDATE_POINTS,
                                index: i,
                                text: newContent
                            });
                        }
                    });
                }
            });
        };

        const onMultiRouteSuccess = () => {
            let activeRoute = multiRoute.getActiveRoute();

            if (activeRoute) {
                dispatch({
                    type: UPDATE_DUR_DIS,
                    distance: activeRoute.properties.get('distance').text,
                    duration: activeRoute.properties.get('durationInTraffic').text
                });
            } else {
                dispatch({
                    type: UPDATE_DUR_DIS,
                    duration: null,
                    distance: null
                });
            }
        };

        myMap.current.geoObjects.removeAll();
        myMap.current.geoObjects.add(multiRoute);

        multiRoute.model.events.add('requestsuccess', onMultiRouteSuccess);

        myMap.current.geoObjects.each((object) => {
            object.events.add('dragend', onObjectDrag);
        });
    }

    return (
        <section className={styles.map_container}>
            {!ymaps && <GridLoader />}
            <YMaps query={{ apikey: API_KEY }}>
                <Map
                    modules={[
                        "multiRouter.MultiRoute",
                        "geocode"
                    ]}
                    onLoad={ymaps => setYmaps(ymaps)}
                    state={mapState}
                    instanceRef={myMap}
                    width="100%" height="100%"
                />
            </YMaps>
        </section>
    )
}

export default MapComponent;