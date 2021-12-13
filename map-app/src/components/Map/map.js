import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { YMaps, Map } from 'react-yandex-maps';

import { API_KEY, UPDATE_POINTS } from '../../services/actions/constants';

const MapComponent = () => {
    const dispatch = useDispatch();
    const points = useSelector(store => store.pathPoints.points);

    const mapState = { center: [55.750625, 37.626], zoom: 7, controls: [] };
    const [ymaps, setYmaps] = useState(null);
    const routes = useRef(null);

    const getRoute = ref => {
        if (ymaps) {
            let refPoints = [];
            points.forEach(item => refPoints.push(item.text));

            const MyBalloonLayout = ymaps.templateLayoutFactory.createClass(
                "<div class='popover top'>" +
                "<div class='popover-inner'>" +
                "$[properties.request]" +
                "</div>" +
                "</div>"
            );

            const multiRoute = new ymaps.multiRouter.MultiRoute(
                {
                    referencePoints: refPoints,
                    params: {
                        results: 2
                    }
                },
                {
                    balloonPanelMaxMapArea: 0,
                    wayPointDraggable: true,
                    viaPointDraggable: true,
                    routeActiveStrokeWidth: 6,
                    routeActiveStrokeColor: "#fa6600"
                }
            );


            routes.current = multiRoute;
            ref.geoObjects.removeAll();
            ref.geoObjects.add(multiRoute);

            multiRoute.events.add('update', () => {
                let newPoints = multiRoute.getWayPoints();
                let geoObjArr = newPoints.toArray();

                // Выставим центр карты по координатам последней точки
                ref.setCenter(geoObjArr[geoObjArr.length - 1].geometry.getCoordinates());

                newPoints.each((item, i) => {
                    // Добавим кастомный балун для каждой точки
                    ymaps.geoObject.addon.balloon.get(item);
                    item.options.set({
                        balloonContentLayout: MyBalloonLayout
                    });

                    // После драга точки на карте, поле request содержит массив координат
                    // Воспользуемся geocode что бы вернуть новое название точки
                    if (typeof item.properties._data.request != 'string') {
                        ymaps.geocode(item.geometry.getCoordinates(), {
                            results: 1
                        }).then(res => {
                            let newContent = res.geoObjects.get(0) ?
                                res.geoObjects.get(0).properties.get('text') :
                                'Не удалось определить адрес.';

                            // Обновим text соответствующего объекта в оригинальном массиве
                            points[i].text = newContent;

                            // Задаем новое содержимое балуна
                            item.options.set({
                                balloonContentLayout: ymaps.templateLayoutFactory.createClass(
                                    "<div class='popover top'>" +
                                    "<div class='popover-inner'>" +
                                    newContent +
                                    "</div>" +
                                    "</div>"
                                )
                            });
                            dispatch({
                                type: UPDATE_POINTS,
                                payload: points
                            })
                        });
                    }
                });
            });
        }
    }
    return (
        <YMaps query={{ apikey: API_KEY }}>
            <Map
                modules={[
                    "multiRouter.MultiRoute",
                    "geoObject.addon.balloon",
                    "templateLayoutFactory",
                    "geocode"
                ]}
                onLoad={ymaps => setYmaps(ymaps)}
                state={mapState}
                instanceRef={ref => ref && getRoute(ref)}
                width="100%" height="100%"
            />
        </YMaps>
    )
}

export default MapComponent;