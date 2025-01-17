import React, { useState } from 'react'

const Learn = () => {

    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState('');

    

  return (
    <div>
        <h2>att göra lista</h2>
        <input 
        style={{padding: '10px 20px', marginTop: '10px', cursor:'pointer'}} 
        placeholder='lägg till en uppgift' 
        type="text" />
        <button style={{marginTop:'10px', padding:'10px 20px', cursor:'pointer' }}>
            lägg till
        </button>
        <ul>
            <li style={{margin:'10px 0', listStyle:'nonr'}}>
                <button 
                style={{ 
                    marginLeft: '10px',
                    padding: '5px 10px',
                    backgroundColor: 'red',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',}}
                >
                ta bort
                </button>
            </li>
        </ul>
    </div>
  )
}

export default Learn