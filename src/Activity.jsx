import React, { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-routing-machine";

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const activityIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const events = [
  { id: 1, name: "Musikkonsert", latitude: 59.3293, longitude: 18.0686 }, // Stockholm
  { id: 2, name: "Teknikkonferens", latitude: 57.7089, longitude: 11.9746 }, // Göteborg
  { id: 3, name: "Matfestival", latitude: 55.604981, longitude: 13.003822 }, // Malmö
];

const Activity = () => {
  const [userPosition, setUserPosition] = useState(null);
  const [activities, setActivities] = useState([]);
  const [newActivity, setNewActivity] = useState({
    title: "",
    startDate: "",
    endDate: "",
    notes: "",
    address: "",
    location: null,
  });
  const [suggestions, setSuggestions] = useState([]);
  const [selectedTarget, setSelectedTarget] = useState(null);

  // Hämta användarens position
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserPosition([position.coords.latitude, position.coords.longitude]);
      },
      (error) => console.error("Error fetching position", error),
      { enableHighAccuracy: true }
    );
  }, []);

  // Hämta förslag från Nominatim
  const fetchSuggestions = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  // Hantera adressändring och hämta förslag
  const handleAddressChange = (e) => {
    const address = e.target.value;
    setNewActivity((prev) => ({ ...prev, address }));
    fetchSuggestions(address);
  };

  // Hantera val av adress från förslag
  const handleAddressSelect = (suggestion) => {
    const { lat, lon } = suggestion;
    setNewActivity((prev) => ({
      ...prev,
      address: suggestion.display_name,
      location: [parseFloat(lat), parseFloat(lon)],
    }));
    setSuggestions([]);
  };

  // Lägg till aktivitet
  const addActivity = () => {
    if (!newActivity.title || !newActivity.startDate || !newActivity.endDate || !newActivity.location) {
      alert("Alla fält och plats är obligatoriska!");
      return;
    }

    if (new Date(newActivity.startDate) >= new Date(newActivity.endDate)) {
      alert("Startdatum måste vara före slutdatum!");
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

  // Ta bort aktivitet
  const removeActivity = (index) => {
    const updatedActivities = [...activities];
    updatedActivities.splice(index, 1);
    setActivities(updatedActivities);
  };

  return (
    <div>
      <h1>Aktivitetshanterare</h1>
      <div>
        <h2>Lägg till Aktivitet</h2>
        <input
          type="text"
          name="title"
          placeholder="Titel"
          value={newActivity.title}
          onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
        />
        <input
          type="datetime-local"
          name="startDate"
          value={newActivity.startDate}
          onChange={(e) => setNewActivity({ ...newActivity, startDate: e.target.value })}
        />
        <input
          type="datetime-local"
          name="endDate"
          value={newActivity.endDate}
          onChange={(e) => setNewActivity({ ...newActivity, endDate: e.target.value })}
        />
        <textarea
          name="notes"
          placeholder="Anteckningar"
          value={newActivity.notes}
          onChange={(e) => setNewActivity({ ...newActivity, notes: e.target.value })}
        />
        <input
          type="text"
          name="address"
          placeholder="Skriv adress"
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
        center={userPosition || [59.3293, 18.0686]} // Stockholm som standard
        zoom={6}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        />

        {/* Visa användarens position */}
        {userPosition && (
          <Marker position={userPosition} icon={customIcon}>
            <Popup>Din position</Popup>
          </Marker>
        )}

        {/* Visa evenemang */}
        {events.map((event) => (
          <Marker
            key={event.id}
            position={[event.latitude, event.longitude]}
            icon={customIcon}
            eventHandlers={{
              click: () => setSelectedTarget([event.latitude, event.longitude]),
            }}
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
              click: () => setSelectedTarget(activity.location),
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

        {/* Lägg till routing */}
        {selectedTarget && userPosition && <Routing userPosition={userPosition} target={selectedTarget} />}
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

// Routing-komponent för att visa rutten
const Routing = ({ userPosition, target }) => {
  const map = useMap();

  useEffect(() => {
    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(userPosition[0], userPosition[1]),
        L.latLng(target[0], target[1]),
      ],
      routeWhileDragging: true,
      lineOptions: {
        styles: [{ color: "#6FA1EC", weight: 4 }],
      },
      createMarker: () => null, // Ta bort markörer
    }).addTo(map);

    return () => {
      map.removeControl(routingControl); // Ta bort rutten när komponenten avmonteras
    };
  }, [map, userPosition, target]);

  return null;
};

export default Activity;
