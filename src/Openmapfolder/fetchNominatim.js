export const fetchNominatim = async (query) => {
    if (!query) return [];

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;

    try{
        const response = await fetch(url);
        if (!response.ok) {
            console.error("Nominatim request failed:", response.statusText)
            return [];
        }

        const data = await response.json();

        return data.map((item) => ({
            name: item.display_name,
            coords: [parseFloat(item.lat), parseFloat(item.lon)]
        }));
    }
    catch(error){
        console.error("Error fetching Nominatim data:", error)
        return[];
    }
}