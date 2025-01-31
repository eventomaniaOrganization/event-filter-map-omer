// Routing.jsx
import L from 'leaflet';
import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import 'leaflet-routing-machine';

const Routing = ({ userPosition, event }) => {
    const map = useMap();

    useEffect(() => {
        if (!event || event.length < 2) return;

        const routingControl = L.Routing.control({
            waypoints: [
                L.latLng(userPosition[0], userPosition[1]),
                ...event.map((e) => L.latLng(e[0], e[1])),
            ],
            //
            routeWhileDragging: true,
            lineOptions: {
                styles: [{ color: '#6FA1EC', weight: 4 }]
            },
            //
            createMarker: () => null,
        }).addTo(map);

        return () => {
            map.removeControl(routingControl);
        };
    }, [map, userPosition, event]);

    return null;
};

export default Routing;