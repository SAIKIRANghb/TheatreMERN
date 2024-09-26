import React, { useState, useEffect } from 'react';

function AdminMovies() {
    const [title, setTitle] = useState('');
    const [imgSrc, setImgSrc] = useState('');
    const [description, setDescription] = useState('');
    const [genre, setGenre] = useState('');
    const [language, setLanguage] = useState('');
    const [selectedTheatre, setSelectedTheatre] = useState('');
    const [selectedScreen, setSelectedScreen] = useState('');
    const [theatres, setTheatres] = useState([]);
    const [screens, setScreens] = useState([]);
    const [cast, setCast] = useState([{ name: '', img: '' }]);
    const [error, setError] = useState('');

    const [theatreIdMap, setTheatreIdMap] = useState({});

    // Fetch theatres when component mounts
    useEffect(() => {
        const fetchTheatres = async () => {
            try {
                const response = await fetch('http://localhost:5000/theatres');
                if (!response.ok) {
                    throw new Error('Failed to fetch theatres');
                }
                const data = await response.json();
                setTheatres(data);

                const theatreMap = {};
                data.forEach(theatre => {
                    theatreMap[theatre._id] = theatre.theatrename;
                });
                setTheatreIdMap(theatreMap);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching theatres:', err);
            }
        };

        fetchTheatres();
    }, []);

    // Fetch screens based on the selected theatre
    const fetchScreens = async (theatreId) => {
        try {
            if (!theatreId) {
                throw new Error('Theatre ID is undefined or invalid');
            }

            const response = await fetch(`http://localhost:5000/screensQuery?theatreId=${theatreId}`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch screens');
            }
            
            const data = await response.json();
            // Filter screens based on the theatre ID if needed
            const filteredScreens = data.filter(screen => screen.theatre === theatreId);

            setScreens(filteredScreens);

            if (filteredScreens.length === 0) {
                setSelectedScreen('');
            }
        } catch (err) {
            setError(err.message);
            console.error('Error fetching screens:', err);
        }
    };

    // Handle theatre change, fetch screens based on selected theatre
    const handleTheatreChange = (e) => {
        const selectedTheatreId = e.target.value;
        setSelectedTheatre(selectedTheatreId);

        // Fetch screens when a valid theatre is selected
        if (selectedTheatreId) {
            fetchScreens(selectedTheatreId);
        } else {
            setScreens([]);
            setSelectedScreen(''); // Reset screen if no theatre selected
        }
    };

    // Handle cast input change
    const handleCastChange = (index, field, value) => {
        const updatedCast = [...cast];
        updatedCast[index][field] = value;
        setCast(updatedCast);
    };

    // Add new cast member
    const addCastMember = () => {
        setCast([...cast, { name: '', img: '' }]);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const movieData = {
                title,
                imgSrc,
                description,
                genre,
                language,
                theatreId: selectedTheatre,
                screenId: selectedScreen,
                cast,
            };
            const response = await fetch('http://localhost:5000/movies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(movieData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error from server:', errorData);
                throw new Error('Failed to add movie');
            }

            alert('Movie details added successfully!');
            setTitle('');
            setImgSrc('');
            setDescription('');
            setGenre('');
            setLanguage('');
            setSelectedTheatre('');
            setSelectedScreen('');
            setCast([{ name: '', img: '' }]);
        } catch (err) {
            setError(err.message);
            console.error('Error adding movie:', err);
        }
    };

    return (
        <div id="admin-movies" className="admin-card">
            <div className="admin-title">Add Movie</div>
            {error && <p className="error" style={{ color: 'red' }}>{error}</p>}
            <form className="admin-form" onSubmit={handleSubmit}>
                <label htmlFor="admin-movieTitleNew">Title:</label>
                <input
                    type="text"
                    id="admin-movieTitleNew"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                <label htmlFor="admin-movieImgSrcNew">Image URL:</label>
                <input
                    type="text"
                    id="admin-movieImgSrcNew"
                    value={imgSrc}
                    onChange={(e) => setImgSrc(e.target.value)}
                    required
                />

                <label htmlFor="admin-movieDescriptionNew">Description:</label>
                <textarea
                    id="admin-movieDescriptionNew"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                ></textarea>

                <label htmlFor="admin-movieGenreNew">Genre:</label>
                <input
                    type="text"
                    id="admin-movieGenreNew"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    required
                />

                <label htmlFor="admin-movieLanguageNew">Language:</label>
                <input
                    type="text"
                    id="admin-movieLanguageNew"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    required
                />

                <label htmlFor="admin-theatreNameNew">Theatre Name:</label>
                <select
                    id="admin-theatreNameNew"
                    value={selectedTheatre}
                    onChange={handleTheatreChange}
                    required
                >
                    <option value="">Select Theatre</option>
                    {theatres.map(theatre => (
                        <option key={theatre._id} value={theatre._id}>
                            {theatre.theatrename}
                        </option>
                    ))}
                </select>

                <label htmlFor="admin-screenNameNew">Screen Name:</label>
                <select
                    id="admin-screenNameNew"
                    value={selectedScreen}
                    onChange={(e) => setSelectedScreen(e.target.value)}
                    required
                    disabled={!selectedTheatre}  // Disable if no theatre is selected
                >
                    <option value="">Select Screen</option>
                    {screens.map(screen => (
                        <option key={screen._id} value={screen._id}>
                            Screen {screen.screenNo}
                        </option>
                    ))}
                </select>

                <label>Cast:</label>
                {cast.map((member, index) => (
                    <div key={index} className="cast-member">
                        <input
                            type="text"
                            placeholder="Actor Name"
                            value={member.name}
                            onChange={(e) => handleCastChange(index, 'name', e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Actor Image URL"
                            value={member.img}
                            onChange={(e) => handleCastChange(index, 'img', e.target.value)}
                            required
                        />
                    </div>
                ))}
                <button type="button" onClick={addCastMember}>Add Another Cast Member</button>

                <button type="submit">Add Movie</button>
            </form>
        </div>
    );
}

export default AdminMovies;
