import React, { useEffect, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';

import { customIcon, activityIcon } from './Openmapfolder/icons';
import { events } from './Openmapfolder/data';
import Routing from './Openmapfolder/Routing';
import DistanceCalculator from './Openmapfolder/DistanceCalculator';
import AddActivities from './Openmapfolder/AddActivities';

const Openmap = () => {

    // userPosition: sparar användarens (din) lat/long från webbläsarens geolokalisering
    const [userPosition, setUserPosition] = useState(null);
    
    // activities: en array av egna aktiviteter (egna events) som man lägger till
    const [activities, setActivities] = useState([])

    // waypoints: en array av koordinater som ska ritas upp som en rutt
    const [waypoints, setWaypoints] = useState([]);

    // useEffect körs en gång när komponenten mountas och försöker hämta din position
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            // Om det lyckas lägger vi in [lat, lng] i userPosition
            (position) => {
                const userPos = [position.coords.latitude, position.coords.longitude];
                setUserPosition(userPos);
            },
            // Om det misslyckas får vi ett error
            (error) => console.error("Error fetching position", error),
            // Extra inställning för bättre noggrannhet
            { enableHighAccuracy: true }
        );
    }, []);// Tom array => körs bara en gång

    // När man klickar på ett event (från events-listan) lägger vi till den platsen i waypoints
    const handleEventClick = (event) => {
        const newWaypoint = [event.latitude, event.longitude];
        setWaypoints((prev) => [...prev, newWaypoint]);
    };

    // När man klickar på en aktivitet lägger vi till den platsen i waypoints
    const handleActivityClick = (activity) => {
        const newWaypoint = activity.location;
        setWaypoints((prev) => [...prev, newWaypoint])
    }

    // Rensar/rensar bort alla waypoints
    const resetWaypoints = () => {
        setWaypoints([])
    };


  return (
    <div>
        <h1>Evenemangskarta</h1>
         {/* Knapp för att rensa waypoints */}
        <button onClick={resetWaypoints} style={{marginBottom: "10px"}}>
            Återställ
        </button>

         {/* Komponent för att söka från/till och beräkna avstånd */}
        <DistanceCalculator events={events} activities={activities}/>

        {/* Här sätter vi upp vår Leaflet-karta */}  
        <MapContainer
            // Om userPosition inte är satt än, använd [59.3293, 18.0686] som default (Stockholm)
            center={userPosition || [59.3293, 18.0686]} 
            zoom={5} 
            style={{ height: '500px', width: '100%' }}
        >
            
             {/* TileLayer är själva "kartan" (OpenStreetMap) */}
            <TileLayer 
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' 
                attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
            />

            {/* Om vi har en userPosition visar vi en Marker där användaren befinner sig */}
            {userPosition && (
                <Marker position={userPosition} icon={customIcon}>
                    <Popup>Din position</Popup>
                </Marker>
            )}
            
            {/* Loopar igenom listan av events (importerad från data) och ritar ut en marker för varje */}
            {events.map((event) => (
                <Marker 
                    key={event.id} 
                    position={[event.latitude, event.longitude]} 
                    icon={customIcon} 
                    eventHandlers={{ click: () => handleEventClick(event) }}
                >
                    <Popup>
                        <strong>{event.name}</strong>
                    </Popup>
                </Marker>
            ))}

            {/* Loopar igenom aktiviteter (egna events) och ritar ut en marker för varje */}
            {activities.map((activity, index) => (
                <Marker
                    key={index}
                    position={activity.location}
                    icon={activityIcon}
                    eventHandlers={{
                        click: () => handleActivityClick(activity),
                    }}
                >
                    <Popup>
                        <strong>{activity.title}</strong>
                        <p>Start: {activity.startDate}</p>
                        <p>Slut: {activity.endDate}</p>
                        {/* Om det finns notes visar vi dem också */}
                        {activity.notes && <p>Anteckningar: {activity.notes}</p>}
                    </Popup>
                </Marker>
            ))}

             {/* Routing komponent (leaflet-routing-machine) som ritar en linje mellan waypoints */}
            {userPosition && waypoints && (
                <Routing userPosition={userPosition} event={waypoints} />
            )}
        </MapContainer>

        {/* Aktivitets-komponent */}
        <AddActivities activities={activities} setActivities={setActivities}/>
        

    </div>
  );
};

export default Openmap