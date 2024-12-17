import React from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

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
    {
        id: 1,
        name: 'Musikkonsert',
        description: 'En fantastisk kväll med livemusik.',
        position: [59.3293, 18.0686], // Stockholm
    },
    {
        id: 2,
        name: 'Teknikkonferens',
        description: 'Upptäck den senaste tekniken.',
        position: [57.7089, 11.9746], // Göteborg
      },
      {
        id: 3,
        name: 'Matfestival',
        description: 'Prova lokala och internationella maträtter.',
        position: [55.604981, 13.003822], // Malmö
      },
];
const Openmap = () => {
  return (
    <MapContainer center={[59.3293, 18.0686]} zoom={5} style={{ height: '500px', width: '100%' }}>
        <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"/>
        {events.map((event) => (
            event.position && (
                <Marker key={event.id} position={event.position} icon={customIcon} >
                    <Popup>
                        <strong>{event.name}</strong>
                        <br />
                        <p>{event.description}</p>
                    </Popup>
                </Marker>
            )
        ))

        }
    </MapContainer>
  )
}

export default Openmap