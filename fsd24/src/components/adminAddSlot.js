import React, { useState, useEffect } from 'react';

function AdminSlots() {
    const [time, setTime] = useState('');
    const [date, setDate] = useState('');
    const [movieId, setMovieId] = useState('');
    const [screenId, setScreenId] = useState('');
    const [theatreId, setTheatreId] = useState('');

    const [theatreMap, setTheatreMap] = useState({});    // Theatre name -> theatre ID map
    const [screenOptions, setScreenOptions] = useState([]); // List of screens for the selected theatre
    const [movieOptions, setMovieOptions] = useState([]);   // List of movies for the selected screen and theatre

    // Fetch theatres when component mounts
    useEffect(() => {
        const fetchTheatres = async () => {
            try {
                const response = await fetch('http://localhost:5001/theatres');
                const data = await response.json();
                const theatres = {};
                data.forEach(theatre => {
                    theatres[theatre._id] = theatre.theatrename;  // Mapping theatre ID -> theatre name
                });
                setTheatreMap(theatres);
            } catch (error) {
                console.error('Error fetching theatres:', error);
            }
        };

        fetchTheatres();
    }, []);

    // Fetch screens when a theatre is selected
    const handleTheatreChange = async (e) => {
        const selectedTheatreId = e.target.value;
        setTheatreId(selectedTheatreId);
        setScreenId('');  // Reset screen selection
        setMovieId('');   // Reset movie selection
        setMovieOptions([]);  // Clear movie options

        if (selectedTheatreId) {
            try {
                const response = await fetch(`http://localhost:5001/screens?theatreId=${selectedTheatreId}`);
                const data = await response.json();
                
                // Ensure only the screens for the selected theatre are displayed
                const filteredScreens = data.filter(screen => screen.theatre === selectedTheatreId);
                
                setScreenOptions(filteredScreens); // Update the available screens based on the selected theatre
            } catch (error) {
                console.error('Error fetching screens:', error);
            }
        } else {
            setScreenOptions([]); // Clear screens if no theatre is selected
        }
    };

    // Fetch movies when a screen is selected
// Fetch movies when a screen is selected
const handleScreenChange = async (e) => {
    const selectedScreenId = e.target.value;
    setScreenId(selectedScreenId);
    setMovieId('');  // Reset movie selection

    if (theatreId && selectedScreenId) {
        try {
            const response = await fetch(`http://localhost:5001/moviesByTS?theatreId=${theatreId}&screenId=${selectedScreenId}`);
            const data = await response.json();
            
            // Ensure movies correspond to selected theatre and screen
            const filteredMovies = data.filter(movie => 
                movie.theatre === theatreId && movie.screen === selectedScreenId
            );

            setMovieOptions(filteredMovies); // Update the available movies based on the selected screen and theatre
        } catch (error) {
            console.error('Error fetching movies:', error);
        }
    } else {
        setMovieOptions([]); // Clear movies if theatre or screen is not selected
    }
};


    const handleSubmit = async (e) => {
        e.preventDefault();

        const slotData = {
            time,
            date,
            movieId: movieId,
            screenId: screenId,
            theatreId: theatreId,
        };

        try {
            const response = await fetch('http://localhost:5001/slots', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(slotData),
            });

            if (!response.ok) throw new Error('Failed to add slot');

            // Clear the form after submission
            setTime('');
            setDate('');
            setMovieId('');
            setScreenId('');
            setTheatreId('');

            alert('Slot details added successfully!'); // Success message
        } catch (error) {
            console.error('Error adding slot:', error);
            alert('Failed to add slot: ' + error.message); // Error message
        }
    };

    return (
        <div id="admin-slots" className="admin-card">
            <div className="admin-title">Add Slot</div>
            <form className="admin-form" onSubmit={handleSubmit}>
                <label htmlFor="admin-slotTimeNew">Time:</label>
                <input
                    type="text"
                    id="admin-slotTimeNew"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                />

                <label htmlFor="admin-slotDateNew">Date:</label>
                <input
                    type="date"
                    id="admin-slotDateNew"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />

                <label htmlFor="admin-theatreIdNew">Theatre:</label>
                <select
                    id="admin-theatreIdNew"
                    value={theatreId}
                    onChange={handleTheatreChange}
                    required
                >
                    <option value="">Select a theatre</option>
                    {Object.keys(theatreMap).map(theatreId => (
                        <option key={theatreId} value={theatreId}>
                            {theatreMap[theatreId]}
                        </option>
                    ))}
                </select>

                <label htmlFor="admin-screenIdNew">Screen:</label>
                <select
                    id="admin-screenIdNew"
                    value={screenId}
                    onChange={handleScreenChange}
                    required
                    disabled={!theatreId}  // Disable if no theatre is selected
                >
                    <option value="">Select a screen</option>
                    {screenOptions.map(screen => (
                        <option key={screen._id} value={screen._id}>
                            Screen {screen.screenNo}
                        </option>
                    ))}
                </select>

                <label htmlFor="admin-movieIdNew">Movie:</label>
                <select
                    id="admin-movieIdNew"
                    value={movieId}
                    onChange={(e) => setMovieId(e.target.value)}
                    required
                    disabled={!screenId || !theatreId}  // Disable if both screen and theatre are not selected
                >
                    <option value="">Select a movie</option>
                    {movieOptions.map(movie => (
                        <option key={movie._id} value={movie._id}>
                            {movie.title}
                        </option>
                    ))}
                </select>

                <button type="submit">Add Slot</button>
            </form>
        </div>
    );
}

export default AdminSlots;
