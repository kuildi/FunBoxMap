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
                "</div>", {
                // build: function () {
                //     console.log('check');
                //     this.constructor.superclass.build.call(this);
                //     this._element = this.getParentElement().querySelector('.popover');
                //     this.applyElementOffset();
                // },
                // clear: function () {
                //     this.constructor.superclass.clear.call(this);
                // },
                // onSublayoutSizeChange: function () {
                //     MyBalloonLayout.superclass.onSublayoutSizeChange.apply(this, arguments);
                //     this.applyElementOffset();
                //     this.events.fire('shapechange');
                // },
                // applyElementOffset: function () {
                //     Object.assign(this._element.style, {
                //         left: -(this._element.offsetWidth / 2) + 'px',
                //         top: -(this._element.offsetHeight) + 'px'
                //     });
                // }
            });

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

            multiRoute.model.events.add("requestsuccess", function () {
                let newPoints = multiRoute.getWayPoints();

                newPoints.each((item, i) => {
                    console.log(item.properties._data.request);

                    ref.setCenter(item.geometry.getCoordinates());

                    ymaps.geoObject.addon.balloon.get(item);
                    item.options.set({
                        balloonContentLayout: MyBalloonLayout
                    });

                    if (typeof item.properties._data.request != 'string') {
                        ymaps.geocode(item.geometry.getCoordinates(), {
                            results: 1
                        }).then(res => {
                            let newContent = res.geoObjects.get(0) ?
                                res.geoObjects.get(0).properties.get('text') :
                                'Не удалось определить адрес.';

                            points[i].text = newContent;

                            // Задаем новое содержимое балуна в соответствующее свойство метки.
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
                })
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
            />
        </YMaps>
    )
}

export default MapComponent;