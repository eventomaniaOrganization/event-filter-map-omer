import React, { useEffect, useMemo, useState } from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import eventService from './Openmapfolder/eventService';
const Category = () => {
    const{events, loading, error} = eventService()

    const [filteredEvents, setFilteredEvents] = useState(events);
    const [startDateCalendar, setStartDateCalendar] = useState(null);
    const [endDateCalendar, setEndDateCalendar] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        setFilteredEvents(events)
    }, [events]);


    const categories = useMemo(() => {
        if (!events) return [];
        return Array.from(new Set(events.map((event) => event.category)))
        
    }, [events]);

    const categoryOptions = categories.map((cat) => ({
        value : cat,
        label : cat
    }));

    const handleFilter = () => {
        const filtered = events.filter((event) => {
            const eventStart = new Date(event.startDate);
            const eventEnd = event.endDate ? new Date(event.endDate) : null;

            const actualEventEnd = eventEnd || eventStart;
            return(
                (!selectedCategory || event.category == selectedCategory.value) &&
                (!startDateCalendar || eventStart >= startDateCalendar) &&
                (!endDateCalendar || actualEventEnd <= endDateCalendar)
            );
        });
        setFilteredEvents(filtered);
    };

    if (loading) {
        return <div>Laddar evenemang...</div>;
      }
  
      if (error) {
        return <div>Ett fel uppstod: {error.message}</div>;
    }
  


  return (
    <div className='container mt-5'>
        <h1>Evenemang</h1>

         {/* Filtersektion */}
        <div className='search-event mb-4'>
            <div className='mb-3'>
                <label>Välj ett "från" datum:</label>
                <DatePicker 
                    selected={startDateCalendar}
                    onChange={(date) => setStartDateCalendar(date)}
                    placeholderText='Välj ett startdatum'
                    dateFormat="yyyy-MM-dd"
                />
            </div>

            <div className='mb-3'>
                <label>Välj ett "till" datum:</label>
                <DatePicker
                    selected={endDateCalendar}
                    onChange={(date) => setEndDateCalendar(date)}
                    placeholderText="Välj ett slutdatum"
                    dateFormat="yyyy-MM-dd"
                />  
            </div>

            <div className='mb-3'>
                <label>Välj kategori:</label>
                <Select
                    options={categoryOptions}
                    isClearable
                    placeholder="Välj en kategori"
                    onChange={setSelectedCategory}
                    value={selectedCategory}
                />
            </div>
            <button className='btn btn-primary' onClick={handleFilter}>
                Filtrera
            </button>

        {/* Lista med Evenemang */}
        </div>
        <div className='row'>
            {filteredEvents.length === 0 ? (
                <p>Inga evenemanger hittades.</p>
            ) : (
            filteredEvents.map((result) => (
                
                <div className='col-md-3' key={result.id}>
                    <div className='card p-4'>
                        <div className='card-body'>
                            <h5 className='card-title'>{result.title}</h5>
                            <p>Datum: {result.startDate}</p>
                            <p>Kategori: {result.category}</p>
                        </div>
                    </div>
                </div>
            ))
            )}
        </div>
    </div>
  )
};

export default Category