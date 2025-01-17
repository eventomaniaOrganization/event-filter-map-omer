// Huvudkomponent
import React, { useState } from 'react';

const App = () => {
  const [activities, setActivities] = useState([]);
  const fieldDefaults = {
    title: '',
    startDate: '',
    endDate: '',
    travelTime: '',
    notes: '',
    notify: false,
  };

  const [newActivity, setNewActivity] = useState({ ...fieldDefaults });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewActivity({
      ...newActivity,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const addActivity = () => {
    if (!newActivity.title || !newActivity.startDate || !newActivity.endDate) {
      alert('Titel, startdatum och slutdatum är obligatoriska!');
      return;
    }

    if (new Date(newActivity.startDate) >= new Date(newActivity.endDate)) {
      alert('Startdatum måste vara före slutdatum!');
      return;
    }

    setActivities([...activities, newActivity]);
    setNewActivity({ ...fieldDefaults });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Aktivitetshanterare</h1>

      <div style={{ marginBottom: '20px' }}>
        <h2>Lägg till Aktivitet</h2>
        <input
          type="text"
          name="title"
          placeholder="Titel"
          value={newActivity.title}
          onChange={handleChange}
          style={{ display: 'block', marginBottom: '10px' }}
        />

        <label>Startdatum & Tid:</label>
        <input
          type="datetime-local"
          name="startDate"
          value={newActivity.startDate}
          onChange={handleChange}
          style={{ display: 'block', marginBottom: '10px' }}
        />

        <label>Slutdatum & Tid:</label>
        <input
          type="datetime-local"
          name="endDate"
          value={newActivity.endDate}
          onChange={handleChange}
          style={{ display: 'block', marginBottom: '10px' }}
        />

        <input
          type="text"
          name="travelTime"
          placeholder="Restid (valfritt)"
          value={newActivity.travelTime}
          onChange={handleChange}
          style={{ display: 'block', marginBottom: '10px' }}
        />

        <textarea
          name="notes"
          placeholder="Anteckningar"
          value={newActivity.notes}
          onChange={handleChange}
          style={{ display: 'block', marginBottom: '10px', width: '300px', height: '100px' }}
        ></textarea>

        <label>
          <input
            type="checkbox"
            name="notify"
            checked={newActivity.notify}
            onChange={handleChange}
          />
          Skicka Notis (endast visuell)
        </label>

        <button onClick={addActivity} style={{ marginTop: '10px' }}>
          Lägg till
        </button>
      </div>

      <div>
        <h2>Aktiviteter</h2>
        {activities.length === 0 ? (
          <p>Inga aktiviteter tillagda ännu.</p>
        ) : (
          <ul>
            {activities.map((activity, index) => (
              <li key={index} style={{ marginBottom: '10px' }}>
                <strong>{activity.title}</strong>
                <p>Start: {activity.startDate}</p>
                <p>Slut: {activity.endDate}</p>
                {activity.travelTime && <p>Restid: {activity.travelTime}</p>}
                {activity.notes && <p>Anteckningar: {activity.notes}</p>}
                {activity.notify && <p><em>Notis aktiverad</em></p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default App;
