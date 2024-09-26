import '../styles/Theatres.css';
import React, { useState, useEffect } from 'react';
import MovieCard from './Card';
import axios from 'axios';

export default function Theatre({ theatre }) {
  const [currentDate, setCurrentDate] = useState('');
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [filters, setFilters] = useState({
    genre: 'all',
    language: 'all'
  });

  useEffect(() => {
    const fetchMovies = async () => {
      // Clear previous movies while fetching new data
      setFilteredMovies([]);

      try {
        const theatreResponse = await axios.get(`http://localhost:5000/theatres/name/${theatre}`);
        const theatreId = theatreResponse.data._id;

        const moviesResponse = await axios.get(`http://localhost:5000/moviesByTheatre?theatreId=${theatreId}`);

        const uniqueMoviesMap = new Map();
        moviesResponse.data.forEach(movie => {
          if (!uniqueMoviesMap.has(movie.title)) {
            uniqueMoviesMap.set(movie.title, movie);
          }
        });

        const uniqueMovies = Array.from(uniqueMoviesMap.values());
        setMovies(uniqueMovies);
        setFilteredMovies(uniqueMovies);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchMovies();

    const today = new Date().toISOString().split('T')[0];
    setCurrentDate(today);
  }, [theatre]); // Ensure the effect runs on theatre change

  const handleFilterChange = (e) => {
    const { id, value } = e.target;
    setFilters(prevFilters => ({ ...prevFilters, [id]: value }));
  };

  useEffect(() => {
    let filtered = movies;

    if (filters.genre !== 'all') {
      filtered = filtered.filter(movie => movie.genre.toLowerCase() === filters.genre.toLowerCase());
    }

    if (filters.language !== 'all') {
      filtered = filtered.filter(movie => movie.language.toLowerCase() === filters.language.toLowerCase());
    }

    if (currentDate) {
      filtered = filtered.filter(movie => {
        if (!movie.createdAt) return false;
        const movieDate = new Date(movie.createdAt);
        return !isNaN(movieDate.getTime()) && movieDate.toISOString().split('T')[0] === currentDate;
      });
    }

    setFilteredMovies(filtered);
  }, [filters, movies, currentDate]);

  return (
    <>
      <div style={{ height: '70px' }}></div>
      <div id="Body">
        <div className="tracker">
          <h3>{theatre.toUpperCase() + ' Theatres'}</h3>
          <div className="filter-group">
            <label htmlFor="genre">Genre</label>
            <select id="genre" onChange={handleFilterChange} value={filters.genre}>
              <option value="all">All</option>
              <option value="action">Action</option>
              <option value="comedy">Comedy</option>
              <option value="drama">Drama</option>
              <option value="horror">Horror</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="language">Language</label>
            <select id="language" onChange={handleFilterChange} value={filters.language}>
              <option value="all">All</option>
              <option value="english">English</option>
              <option value="spanish">Spanish</option>
              <option value="french">French</option>
              <option value="hindi">Hindi</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              value={currentDate}
              onChange={(e) => setCurrentDate(e.target.value)}
              id="date"
            />
          </div>
        </div>

        <div className="content" style={{ background: 'none' }}>
          {filteredMovies.length > 0 ? (
            filteredMovies.map((movie) => (
              <MovieCard
                key={movie._id}
                movie={movie}
                theatreName={theatre}
              />
            ))
          ) : (
            <p>No movies found for this theatre.</p>
          )}
        </div>
      </div>
      <div style={{marginTop:'1000px'}}></div>
    </>
  );
}
