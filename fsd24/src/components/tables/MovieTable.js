import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function MovieTable() {
    const [movies, setMovies] = useState([]);
    const [theatres, setTheatres] = useState({});
    const [screens, setScreens] = useState({});
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Fetch movies from the backend
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await fetch('http://localhost:5001/movies'); // Adjust the API endpoint as needed
                if (!response.ok) {
                    throw new Error('Failed to fetch movies');
                }
                const data = await response.json();
                setMovies(data);
            } catch (err) {
                setError(err.message);
            }
        };

        const fetchTheatres = async () => {
            try {
                const response = await fetch('http://localhost:5001/theatres'); // Fetch theatres
                if (!response.ok) {
                    throw new Error('Failed to fetch theatres');
                }
                const data = await response.json();
                // Map theatre IDs to their names
                const theatreMap = data.reduce((map, theatre) => {
                    map[theatre._id] = theatre.theatrename; // Assuming `theatrename` is the field for the name
                    return map;
                }, {});
                setTheatres(theatreMap);
            } catch (err) {
                setError(err.message);
            }
        };

        const fetchScreens = async () => {
            try {
                const response = await fetch('http://localhost:5001/screens'); // Fetch screens
                if (!response.ok) {
                    throw new Error('Failed to fetch screens');
                }
                const data = await response.json();
                // Map screen IDs to their names
                const screenMap = data.reduce((map, screen) => {
                    map[screen._id] = screen.screenNo; // Assuming `screenNo` is the field for the name
                    return map;
                }, {});
                setScreens(screenMap);
            } catch (err) {
                setError(err.message);
            }
        };

        // Fetch all data when component mounts
        fetchMovies();
        fetchTheatres();
        fetchScreens();
    }, []);

    // Function to handle delete movie
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:5001/movies/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete movie');
            }
            setMovies(movies.filter(movie => movie._id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="admin-movies-panel">
            <h1>Movies</h1>
            {error && <p className="error">{error}</p>}
            <button onClick={() => navigate('/admin/movies/add')}>Add Movie</button>
            <table id="admin-movies-table" className="admin-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Image</th>
                        <th>Description</th>
                        <th>Genre</th>
                        <th>Language</th>
                        <th>Theatre</th>
                        <th>Screen</th>
                        <th>Cast</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {movies.length > 0 ? (
                        movies.map(movie => (
                            <tr key={movie._id}>
                                <td>{movie.title}</td>
                                <td><img src={movie.imgSrc} alt={movie.title} style={{ width: '50px', height: 'auto' }} /></td>
                                <td>{movie.description}</td>
                                <td>{movie.genre}</td>
                                <td>{movie.language}</td>
                                <td>{theatres[movie.theatre] || 'N/A'}</td> {/* Use theatre name */}
                                <td>{screens[movie.screen] || 'N/A'}</td> {/* Use screen name */}
                                <td>
                                    {movie.cast.map((actor) => (
                                        <div key={actor._id} style={{ display: 'flex', alignItems: 'center' }}>
                                            <img src={actor.img} alt={actor.name} style={{ width: '30px', height: 'auto', borderRadius: '50%', marginRight: '5px' }} />
                                            <span>{actor.name}</span>
                                        </div>
                                    ))}
                                </td>
                                <td>
                                    <button onClick={() => navigate(`/admin/movies/update/${movie._id}`)}>Update</button>
                                    <button onClick={() => handleDelete(movie._id)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="9">No movies available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default MovieTable;
