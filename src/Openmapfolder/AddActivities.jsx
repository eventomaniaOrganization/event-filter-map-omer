import React, { useState } from 'react'
import { fetchNominatim } from './fetchNominatim'

const AddActivities = ({activities, setActivities}) => {

    //allt som rör en ny aktivitet
    const [newActivity, setNewActivity] = useState({
        title: "",
        startDate: "",
        endDate: "",
        notes: "",
        address: "",
        location: null,
    })
    //Här stryr du om du vill visa förslag när du skriver i adressfältet
    const [suggestions, setSuggestions] = useState([])

    const addActivity = () => {
      // validera alla fält
      if (
        !newActivity.title ||
        !newActivity.startDate ||
        !newActivity.endDate ||
        !newActivity.location
      ){
        alert("Alla fält och plats är obligatoriska!")
        return;
      }
      //se till att start datum är före
      if(new Date(newActivity.startDate) >= new Date(newActivity.endDate)){
        alert("Startdatum måste vara före slutdatum!")
        return;
      }
      //sätt in i listan
      setActivities([...activities, newActivity])

      // töm formuläret
      setNewActivity({
        title: "",
        startDate: "",
        endDate: "",
        notes: "",
        address: "",
        location: null,
      })
    };

    //när vi ändrar adress i input
    const handleAddressChange = async (e) => {
      
      const address = e.target.value
      //uppdatera "newActivity" med ny text
      setNewActivity((prev) => ({...prev, address}))

      if(!address){
        setSuggestions([])
        return;
      }

      // Anropa Nominatim för att få förslag
      const result = await fetchNominatim(address)
      setSuggestions(
        result.map((item) => ({
          display_name: item.name,
          lat: item.coords[0],
          lon: item.coords[1]
        }))
      )
    };

    // När vi klickar på ett förslag i listan
    const handleAddressSelect = (suggestion) => {
      setNewActivity((prev) =>({
        ...prev,
        address: suggestion.display_name,
        location: [parseFloat(suggestion.lat), parseFloat(suggestion.lon)]
      }))
      setSuggestions([])
    }

    //ta bort aktivitet
    const removeActivity = (index) => {
      const uppdateActivity = [...newActivity]
      uppdateActivity.splice(index, 1)
      setActivities(uppdateActivity)
    }


  return (
    <div className='add-activity'>
        <h2>Lägg till aktiviteter</h2>
        {/* Formulär */}
        <input 
        type="text"
        placeholder='Titel'
        value={newActivity.title}
        onChange={(e) => setNewActivity({...newActivity, title: e.target.value})}
        />
        <input 
        type="datetime-local"
        value={newActivity.startDate}
        onChange={(e) => setNewActivity({...newActivity, startDate: e.target.value})}
        />
        <input 
        type="datetime-local"
        value={newActivity.endDate}
        onChange={(e) => setNewActivity({...newActivity, endDate: e.target.value})}
        />
        <textarea
        placeholder='Anteckningar'
        value={newActivity.notes}
        onChange={(e) => setNewActivity({...newActivity, notes: e.target.value})}
        />
        <input 
        type="text"
        placeholder="Skriv address"
        value={newActivity.address}
        onChange={handleAddressChange}
        />
        
        {/* Lista med förslag */}
        {suggestions.length > 0 && (
          <div className='suggestion-list-activity'>
            {suggestions.map((suggestion, i) => (
              <div key={i} onClick={() => handleAddressSelect(suggestion)} className='handle-address-select'>
                {suggestion.display_name}
              </div>
            ))}
          </div>
        )}

        <button onClick={addActivity}>Lägg till</button>

        {/* Lista över alla aktiviteter */}
        <h2>Aktiviteter</h2>
        <ul>
            {activities.map((activity, index) => (
              <li key={index} className='activity-list'>
                <strong>{activity.title}</strong>
                <p>Start: {activity.startDate}</p>
                <p>Slut: {activity.endDate}</p>
                {activity.notes && <p>Anteckningar: {activity.notes}</p>}
                <button onClick={() => removeActivity(index)}>Ta bort</button>
              </li>
            ))}
        </ul>

    </div>
  )
}

export default AddActivities