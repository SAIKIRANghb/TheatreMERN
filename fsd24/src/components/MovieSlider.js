import React, { useState, useEffect } from 'react';
import '../styles/MovieSlider.css'; // Import the CSS file for MovieSlider
import {Link} from 'react-router-dom';

const MovieSlider = () => {
  const [slideIndex, setSlideIndex] = useState(0);

  const slides = [
    "https://images.hindustantimes.com/img/2024/07/17/1600x900/kalki_1721207150115_1721207150501.jpg",
    "https://static.india.com/wp-content/uploads/2024/06/devara.png?impolicy=Medium_Resize&w=1200&h=800",
  ];

  const showSlide = (index) => {
    setSlideIndex((index + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(() => showSlide(slideIndex + 1), 5000);
    return () => clearInterval(timer);
  }, [slideIndex]);

  return (
    <div className="movie-slider">
      <div className="slides" style={{ transform: `translateX(-${slideIndex * 100}%)` }}>
        {slides.map((src, index) => (
          <div className="slide" key={index}>
            <div className="movie-card">
              <img src={src} alt={`Movie ${index + 1}`} />
              <div className="overlay">
                <h3>Movie Title {index + 1}</h3>
                <Link to="#">Book Now</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="slider-controls">
        <button className="prev" onClick={() => showSlide(slideIndex - 1)}>&#9664;</button>
        <button className="next" onClick={() => showSlide(slideIndex + 1)}>&#9654;</button>
      </div>
    </div>
  );
};

export default MovieSlider;
