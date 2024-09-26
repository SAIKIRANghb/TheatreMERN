import React, { Fragment, useEffect, useState } from 'react'; // Correct imports
import Navbar from './components/Navbar';
import MovieSlider from './components/MovieSlider';
import CardContainer from './components/CardContainer';
import Footer from './components/Footer';
import Theatres from './components/Theatres';
import './App.css'; // Import the global CSS file
import Booking from './components/Booking';
import AdminApp from './components/adminApp';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import MoviePage from './components/MoviePage';

const App = () => {
  const [theatres, setTheatres] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const fetchAllTheatres = async () => {
      try {
        const response = await fetch('http://localhost:5000/theatres');
        const data = await response.json();
        setTheatres(data);
      } catch (error) {
        console.error('Error fetching all theatres:', error);
      }
    };
    fetchAllTheatres();
  }, []);
  
    const cardData = [
    {
      imgSrc: "https://images.hindustantimes.com/img/2024/07/17/1600x900/kalki_1721207150115_1721207150501.jpg",
      topContent: "Top Content",
      title: "Movie Card Title",
      bottomContent: "Bottom Content"
    },
    {
      imgSrc: "movie-card1.jpg",
      topContent: "Top Content",
      title: "Movie Card Title",
      bottomContent: "Bottom Content"
    },
    // Add more card data as needed
  ];

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        {/* {console.log(theatres)} */}
        {theatres.map(theatre => (
          <Fragment key={theatre._id}>
            {console.log(theatre.theatrename)}
            <Route path={`/${theatre.theatrename}`} element={<Theatres theatre={theatre.theatrename} />} />
            <Route path={`/${theatre.theatrename}/:movie/:screen/:timings`} element={<Booking theatre={theatre.theatrename} theatreId={theatre._id} />} />
            <Route path={`/${theatre.theatrename}/:movie`} element={<MoviePage theatre={theatre.theatrename} />} />
          </Fragment>
        ))}

        <Route path="/*" element={<p>PAGENOT FOUND</p>} />
        <Route path="/" element={
          <>
            <MovieSlider />
            <CardContainer title="Top Telugu" cards={cardData} />
            <CardContainer title="Top English" cards={cardData} />
          </>
        } />
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
};

const Main = () => (
  <Router>
    <App />
  </Router>
);

export default Main;

