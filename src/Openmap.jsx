import React, { useEffect, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';

import { customIcon, activityIcon } from './Openmapfolder/icons';
import { events } from './Openmapfolder/data';
import Routing from './Openmapfolder/Routing';
import DistanceCalculator from './Openmapfolder/DistanceCalculator';

const Openmap = () => {

    const [userPosition, setUserPosition] = useState(null);
    const [activities, setActivities] = useState([])
    const [newActivity, setNewActivity] = useState({
        title: "",
        startDate: "",
        endDate: "",
        notes: "",
        address: "",
        location: null,
    })
    const [suggestions, setSuggestions] = useState([]);
    const [waypoints, setWaypoints] = useState([]);


    const handleEventClick = (event) => {
        const newWaypoint = [event.latitude, event.longitude];
        setWaypoints((prev) => [...prev, newWaypoint]);
    };

    const handleActivityClick = (activity) => {
        const newWaypoint = activity.location;
        setWaypoints((prev) => [...prev, newWaypoint])
    }
    const resetWaypoints = () => {
        setWaypoints([])
    };

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userPos = [position.coords.latitude, position.coords.longitude];
                setUserPosition(userPos);
            },
            (error) => console.error("Error fetching position", error),
            { enableHighAccuracy: true }
        );
    }, []);


    //hantera andressen och hämta förslag
    const handleAddressChange = (e) => {
        const address = e.target.value;
        setNewActivity((prev) => ({...prev, address}));
    };

    //hantera val av adress från förslag
    const handleAddressSelect = (suggestion) => {
        const {lat, lon} = suggestion;
        setNewActivity((prev) => ({
            ...prev,
            address: suggestion.display_name,
            location: [parseFloat(lat), parseFloat(lon)],
        }));
        setSuggestions([]);
    }

    // lägg till aktiviteter
    const addActivity = () => {
        if(!newActivity.title || !newActivity.startDate || !newActivity.endDate || !newActivity.location){
            alert("Alla fält och plats är obligatoriska!");
            return;
        }

        if(new Date(newActivity.startDate) >= new Date(newActivity.endDate)){
            alert("Satrtdatum måste vara före slutdatum");
            return;
        }
        

        setActivities([...activities, newActivity]);
        setNewActivity({
            title: "",
            startDate: "",
            endDate: "",
            notes: "",
            address: "",
            location: null,
        });
    };

    //tabort aktiviteten
    const removeActivity = (index) => {
        const updatedActivities = [...activities]
        updatedActivities.splice(index, 1)
        setActivities(updatedActivities);
    };
    
  return (
    <div>
        <h1>Evenemangskarta</h1>
        <button onClick={resetWaypoints} style={{marginBottom: "10px"}}>
            Återställ
        </button>

        <DistanceCalculator events={events} activities={activities}/>

        <div>
            <h2>Lägg till aktiviteter</h2>
            <input 
            type="text"
            name='title'
            placeholder='Title'
            value={newActivity.title}
            onChange={(e) => setNewActivity({...newActivity, title: e.target.value})}
            />
            <input 
            type="datetime-local"
            name='startDate'
            value={newActivity.startDate}
            onChange={(e) => setNewActivity({...newActivity, startDate: e.target.value})}            
            />
            <input 
            type="datetime-local"
            name='endDate'
            value={newActivity.endDate}
            onChange={(e) => setNewActivity({...newActivity, endDate: e.target.value})}
            />
            <textarea 
            name="notes"
            placeholder='Anteckningar'
            value={newActivity.notes}
            onChange={(e) => setNewActivity({...newActivity, notes: e.target.value})}
            ></textarea>
            <input 
            type="text"
            name='address'
            placeholder="Skriv address"
            value={newActivity.address}
            onChange={handleAddressChange}
            />

            <div style={{ border: "1px solid #ccc", maxHeight: "200px", overflowY: "auto" }}>
                {suggestions.map((suggestion, index) => (
                    <div
                    key={index}
                    style={{ padding: "10px", cursor: "pointer" }}
                    onClick={() => handleAddressSelect(suggestion)}
                    >
                        {suggestion.display_name}
                    </div>
                ))}
            </div>
            <button onClick={addActivity}>Lägg till</button>
        </div>
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
                    eventHandlers={{ click: () => handleEventClick(event) }}
                >
                    <Popup>
                        <strong>{event.name}</strong>
                    </Popup>
                </Marker>
            ))}

            {/* Visa marker för aktiviteter */}
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
                        {activity.notes && <p>Anteckningar: {activity.notes}</p>}
                    </Popup>
                </Marker>
            ))}

            {/* Visa rutt och avstånd */}
            {userPosition && waypoints && (
                <Routing userPosition={userPosition} event={waypoints} />
            )}
        </MapContainer>


        <h2>Aktiviteter</h2>
        <ul>
            {activities.map((activity, index) => (
                <li key={index} style={{ marginBottom: "10px" }}>
                    <strong>{activity.title}</strong>
                    <p>Start: {activity.startDate}</p>
                    <p>Slut: {activity.endDate}</p>
                    <button onClick={() => removeActivity(index)}>Ta bort</button>
                </li>
            ))}
        </ul>

        

    </div>
  );
};

export default Openmap