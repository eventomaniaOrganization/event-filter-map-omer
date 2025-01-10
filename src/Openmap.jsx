import React, { useEffect, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import * as turf from '@turf/turf';

const customIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const events = [
    { id: 1, name: 'Musikkonsert', latitude: 59.3293, longitude: 18.0686 }, // Stockholm
    { id: 2, name: 'Teknikkonferens', latitude: 57.7089, longitude: 11.9746 }, // Göteborg
    { id: 3, name: 'Matfestival', latitude: 55.604981, longitude: 13.003822 }, // Malmö
];

const Openmap = () => {

    const [userPosition, setUserPosition] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [originalPositions, setOriginalPositions] = useState(null);
 

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userPos = [position.coords.latitude, position.coords.longitude];
                setUserPosition(userPos);
                setOriginalPositions({user: userPos, event: null});
            },
            (error) => console.error("Error fetching position", error),
            { enableHighAccuracy: true }
        );
    }, []);

    const handleEventClick = (event) => {
            setSelectedEvent(event)
            setOriginalPositions((prev) => ({...prev, event: [event.latitude, event.longitude]}))
    };

    const resetPositions = () => {
        if(originalPositions){
            setUserPosition(originalPositions.user);
            setSelectedEvent(originalPositions.event ? {...selectedEvent, ...originalPositions.event}: null);
        }
    }
    
  return (
    <div>
        <h1>Evenemangskarta</h1>
        <button onClick={resetPositions} style={{marginBottom: "10px"}}>
            Återställ
        </button>
        <MapContainer
            center={userPosition || [59.3293, 18.0686]} 
            zoom={5} 
            style={{ height: '500px', width: '100%' }}
        >
            
            <TileLayer 
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' 
                attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
            />

            {/* Visa användarens position */}
            {userPosition && (
                <Marker position={userPosition} icon={customIcon}>
                    <Popup>Din position</Popup>
                </Marker>
            )}
            
            {/* Visa närliggande evenemang */}
            {events.map((event) => (
                <Marker 
                    key={event.id} 
                    position={[event.latitude, event.longitude]} 
                    icon={customIcon} 
                    eventHandlers={{ click: () => setSelectedEvent(event) }}
                >
                    <Popup>
                        <strong>{event.name}</strong>
                    </Popup>
                </Marker>
            ))}

            {/* Visa rutt och avstånd */}
            {userPosition && selectedEvent && (
                <Routing userPosition={userPosition} event={selectedEvent} />
            )}
        </MapContainer>

        {/* visa valt evenemang och avstånd */}
        {userPosition && selectedEvent && (
            <div style={{marginTop: '20px'}}>
                <h2>Valt Evenemang</h2>
                <p>
                    <strong>Evenemang:</strong> {selectedEvent.name}
                    <br />
                    <strong>Avstånd:</strong>{' '}
                    {turf.distance(
                        turf.point([userPosition[1], userPosition[0]]),
                        turf.point([selectedEvent.longitude, selectedEvent.latitude]),
                        {units: "kilometers"}
                    ).toFixed(2)}{' '} km
                    
                </p>
            </div>

        )}

    </div>
  );
};

//routing component

const Routing = ({userPosition, event}) => {
    const map = useMap();


    useEffect(() => {
        const routingControl = L.Routing.control({
            waypoints: [
                L.latLng(userPosition[0], userPosition[1]),
                L.latLng(event.latitude, event.longitude),
            ],
            routeWhileDragging: false,
            lineOptions: {
                styles: [{ color: '#6FA1EC', weight:'4'}]
            },
            creatMarker: () => null,
        }).addTo(map)

        return() => {
            map.removeControl(routingControl);
        };
    }, [map, userPosition, event]); 

    return null;
};

export default Openmap