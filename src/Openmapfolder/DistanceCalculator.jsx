import React, { useCallback, useState } from 'react'
import * as turf from "@turf/turf";
import { fetchNominatim } from './fetchNominatim'


const DistanceCalculator = ({events, activities}) => {
    
  const [fromLocation, setFromLocation] = useState({name: "", coords: null})
  const [toLocation, setToLocation] = useState({name: "", coords: null})
  const [fromSuggestions, setFromSuggestions] = useState([])
  const [toSuggestions, setToSuggestions] = useState([])
  const [distanceResult, setDistanceResult] = useState(null);
  
  

   // Funktion som hämtar från Nominatim och SAMTIDIGT kombinerar events & activities:
  const handleSearch = async (query, setSuggestionsFn) => {
    if(!query){
      setSuggestionsFn([]);
      return;
    }

    // Hämta från Nominatim
    const nominatimResult = await fetchNominatim(query);

    // Kombinera med events & activities
    const combineSuggestions = [
      ...events.map((e) => ({name: e.name, coords: [e.latitude, e.longitude]})),
      ...activities.map((a) => ({
        name: a.title, 
        coords: Array.isArray(a.location) ? a.location : [a.location.latitude, a.location.longitude]
      })),
      ...nominatimResult
      
    ];

    // Sätt i state
    setSuggestionsFn(combineSuggestions)
  }

  const calculateDistance = () => {
    if(!fromLocation.coords || !toLocation.coords){
      alert("Välj både Från och Till platser!")
      return;
    }

    const fromPoint = turf.point(fromLocation.coords);
    const toPoint = turf.point(toLocation.coords);
    const options = {units: "kilometers"}

    const distance = turf.distance(fromPoint, toPoint, options)
    setDistanceResult({distance: distance.toFixed(2)})
  }

  const handleLocationChange = useCallback((e, setLocation, setSuggestionsFn) => {
    const value = e.target.value
    setLocation((prev) => ({...prev,name: value}))

    handleSearch(value, setSuggestionsFn)

  },[handleSearch])

  const handleLocationSelect = (location, setLocation, setSuggestions) => {
    setLocation(location);
    setSuggestions([]);
};


  return (
    <>
      <div>
        <label>Från:</label>
        <input
          type='text'
          placeholder='Skriv adress, aktivitet eller evenemang'
          value={fromLocation.name}
          onChange={(e) => handleLocationChange(e, setFromLocation, setFromSuggestions)}
        />
        <ul style={{ border: "1px solid #ccc", maxHeight: "200px", overflowY: "auto" }}>
          {fromSuggestions.map((suggestion, i) => ( 
            <li key={i} 
                onClick={() => handleLocationSelect(suggestion, setFromLocation, setFromSuggestions)}
                style={{ padding: "10px", cursor: "pointer" }}
                value={fromLocation.name}
                > 
              
              {suggestion.name} 
            
            </li>))}
        </ul>
      </div>
      <div>
        <label>Till:</label>
        <input type="text"
               placeholder='Skriv adress, aktivitet eller evenemang'
               value={toLocation.name}
               onChange={(e) => handleLocationChange(e, setToLocation, setToSuggestions)}
        />
        <ul style={{ border: "1px solid #ccc", maxHeight: "200px", overflowY: "auto" }}>
            {toSuggestions.map((suggestion,i) => (
              <li key={i}
                  style={{ padding: "10px", cursor: "pointer" }}
                  value={toLocation.name}
                  onClick={() => handleLocationSelect(suggestion,setToLocation, setToSuggestions)}
                  >
                    {suggestion.name}
              </li>
            ))}
        </ul>
      </div>
      <button onClick={calculateDistance}>Beräkna avstånd</button>
      {distanceResult && (
        <p>
          <strong>Avstånd: </strong> {distanceResult.distance} km
        </p>
      )}
    </>
  )
}

export default DistanceCalculator