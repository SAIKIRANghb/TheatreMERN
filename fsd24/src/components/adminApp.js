import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Import Routes and Route
import Sidebar from './adminSideBar';
import Movies from './tables/MovieTable';
import Theatres from './tables/TheatreTable';
import Screens from './tables/ScreenTable';
import Slots from './tables/SlotTable';
import Users from './tables/UserTable';
import WebPage from './tables/WebPageTable';
import '../styles/adminApp.css'
import AdminMainContent from './adminMainContent';
import GeneralizedUpdateForm from './UpdateForm';
import ScreenUpdateForm from './ScreenUpdateForm';
import SlotUpdateForm from './UpdateSlots';
import AddTheatres from './adminAddTheare';
import AddMovies from './adminAddMovies';
import AddScreens from './adminAddScreen';
import AddSlot from './adminAddSlot'

const initialTheatreData = {
  theatrename: '',
  location: ''
};

const inputTypes = {
  theatrename: 'text',
  location: 'text'
};
const initialMovieData = {
  title: '',
  imgSrc: '',
  description: '',
  genre: '',
  language: '',
  theatreId: '',  // Reference to theatre
  screenId: '',   // Reference to screen
  cast: [         // Array of cast objects
    {
      name: '',
      img: '',
      _id: ''
    }
  ]
};

const movieInputTypes = {
  title: 'text',
  imgSrc: 'url',  // Use 'url' type for image source
  description: 'text',
  genre: 'text',
  language: 'text',
  theatreId: 'text', // Keep as text for ID input
  screenId: 'text',  // Same as above
  cast: 'text'       // This will need to be managed differently in forms
};


const initialScreenData = {
  classInfo: [
    {
      classNo: '',
      className: ''
    }
  ],
  screenNo: '',
  selectedSeats: [],
  dim: {
    NumRows: '',
    SeatsPerRow: ''
  },
  validSeats: [],
  theatre: '' // Reference to theatre
};

const screenInputTypes = {
  classInfo: 'text',  // This will likely need to be handled in a more specific way
  screenNo: 'number',
  selectedSeats: 'text',  // Array handling required
  dim: 'text',  // Nested object, might need specific handling
  validSeats: 'text',  // Array handling required
  theatre: 'text' // Text for now, but will likely reference theatre names or IDs
};

export default function AdminApp() {
  return (
    
    <div className="admin-panel">
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ width: '85%', margin: '3%' }}>
          <Routes>
          <Route path="/theatres/update/:id" element={<GeneralizedUpdateForm endpoint="http://localhost:5000/theatres" initialData={initialTheatreData} inputTypes={inputTypes} next = {'theatres'} />} />
          <Route path="/movies/update/:id" element={<GeneralizedUpdateForm endpoint="http://localhost:5000/movies" initialData={initialMovieData} inputTypes={movieInputTypes} next = {'movies'}/>} />
          <Route path="/screens/update/:id" element={<ScreenUpdateForm endpoint="http://localhost:5000/screens" initialData={initialScreenData} inputTypes={screenInputTypes} next={'screens'} />} />
          <Route path="/slots/update/:id" element={<SlotUpdateForm endpoint="http://localhost:5000/slots" next={'slots'} />} />

          <Route path="/slots/add" element={<AddSlot />} />
          <Route path="/theatres/add" element={<AddTheatres />} />
          <Route path="/movies/add" element={<AddMovies/>} />
          <Route path="/screens/add" element={<AddScreens/>} />

            <Route path="movies" element={<Movies />} />
            <Route path="theatres" element={<Theatres />} />
            <Route path="screens" element={<Screens />} />
            <Route path="slots" element={<Slots />} />
            <Route path="users" element={<Users />} />
            <Route path="webpage" element={<WebPage />} />
            {/* Default content for the /admin route */}
            <Route path="/" element={<div style={{background:'black',padding:'10px',borderRadius:'5px'}}><h1>Welcome to the Admin Dashboard</h1></div>} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
