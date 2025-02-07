import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import { useEffect, useState } from "react";

const getAllEvents = () => {
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const featchData = async () =>{
            try{
                const querySnapshot = await getDocs(collection(db, "events"));
                //mappa ut data
                const fetchedEvents = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data()}));
                setEvents(fetchedEvents);
                setLoading(false);
            }
            catch(error){
                setError(error);
                setLoading(false);
            }
        };

        featchData();
    }, []);

    return {events,loading,error}
}

export default getAllEvents;