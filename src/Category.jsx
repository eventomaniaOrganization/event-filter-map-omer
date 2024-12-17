import React, { useMemo, useState } from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import { events } from "./events";


const Category = () => {
    const [filteredEvents, setFilteredEvents] = useState(events);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);


    const categories = useMemo(() => {
        return Array.from(new Set(events.map((event) => event.category)));
        
    }, []);

    const categoryOptions = categories.map((cat) => ({
        value : cat,
        label : cat
    }));

    const handleFilter = () => {
        const filtered = events.filter((event) => {
            const eventDate = new Date(event.date);
            return(
                (!selectedCategory || event.category == selectedCategory.value) &&
                (!startDate || eventDate >= startDate) &&
                (!endDate || eventDate <= endDate)
            );
        });
        setFilteredEvents(filtered);
    };


  return (
    <div className='container mt-5'>
        <h1>Evenemang</h1>

         {/* Filtersektion */}
        <div className='search-event mb-4'>
            <div className='mb-3'>
                <label>Välj ett "från" datum:</label>
                <DatePicker 
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    placeholderText='Välj ett startdatum'
                    dateFormat="yyyy-MM-dd"
                />
            </div>

            <div className='mb-3'>
                <label>Välj ett "till" datum:</label>
                <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
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
                        <img 
                        src={result.image}
                        className='card-img-top'
                        alt={result.name}
                        />
                        <div className='card-body'>
                            <h5 className='card-title'>{result.name}</h5>
                            <p>Datum: {result.date}</p>
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