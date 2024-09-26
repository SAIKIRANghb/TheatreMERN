
import { useState, useEffect } from "react";
import '../styles/Booking.css';
import { useParams, useNavigate ,useLocation} from 'react-router-dom';

// Declare the seat code map globally
let seatCodeMap = {}; // This will map seat IDs like '0-2' to human-readable seat codes like 'A1'

const MovieSeatBooking = (props) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [unavailableSeats, setUnavailableSeats] = useState([]);
  const [validSeats, setValidSeats] = useState([]);
  const [rows, setRows] = useState(0);
  const [seatsPerRow, setSeatsPerRow] = useState(0);
  const [classInfo, setClassInfo] = useState([]);
  const seatPrice = 12; // Price per seat
  const [theatreName,setTheatreName] = useState('');
  const [movieName,setMovieName] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const movieParam = useParams();
  let timings = movieParam.timings;
  let slot = timings.split('+')[0];
  let date = timings.split('+')[1];
  let screenNo = movieParam.screen;
  let timeString = timings;
  
  // Fetching screen data from the database
  useEffect(() => {
    const fetchScreenData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/screensbyNo?screenNum=${screenNo}&theatreId=${props.theatreId}`);
        const dataList = await response.json();
        const data = dataList[0];

        const theatreRes = await fetch(`http://localhost:5000/theatres/${data.theatre}`);
        const theatreData = await theatreRes.json();

        // console.log(data);


        const MovieRes = await fetch(`http://localhost:5000/moviesByTS?theatreId=${theatreData._id}&screenId=${data._id}`);
        const MovieData = await MovieRes.json();
        console.log(MovieData)
        console.log(MovieData[0].title)
        // setMovieName(`${MovieRes[0].title}`);
        setTheatreName(theatreData.theatrename);

        setUnavailableSeats(data.selectedSeats);
        setValidSeats(data.validSeats);
        setRows(data.dim.NumRows);
        setSeatsPerRow(data.dim.SeatsPerRow);
        setClassInfo(data.classInfo);
      } catch (error) {
        // navigate('/*');
        console.error('Error fetching screen data:', error);
      }
    };

    fetchScreenData();
  }, []);

  // Toggling seat selection
  const toggleSeat = (rowIndex, seatIndex) => {
    const seatId = `${rowIndex}-${seatIndex}`;
    if (validSeats.includes(seatId) && !unavailableSeats.includes(seatId)) {
      setSelectedSeats(prevSeats =>
        prevSeats.includes(seatId)
          ? prevSeats.filter(id => id !== seatId)
          : [...prevSeats, seatId]
      );
    }
  };

  // Handle Booking
  const handleBooking = async () => {
    // Create a selectedSeatCodeMap to correlate seat IDs with human-readable codes
    const selectedSeatCodeMap = {};
    
    selectedSeats.forEach(seatId => {
      selectedSeatCodeMap[seatId] = seatCodeMap[seatId]; // Get the human-readable code from the seatCodeMap
    });

    const bookingData = {
      userId: 'USER_ID_HERE',
      movieId: movieParam.movie,
      theatreId: props.theatre,
      screenId: screenNo,
      date: date,
      timeSlot: slot,
      selectedSeats: selectedSeats,
      selectedSeatCodeMap, // Include the selectedSeatCodeMap in the booking data
      totalPrice: selectedSeats.length * seatPrice,
    };

    try {
      const response = await fetch('http://localhost:5000/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();
      if (response.ok) {
        console.log('Booking successful:', result);
        alert('booked')
      } else {
        console.error('Booking failed:', result.message);
      }
    } catch (error) {
      console.error('Error booking seats:', error);
    }
  };

  // Rendering seats dynamically
  const renderSeats = () => {
    let seatMap = [];
    let classHeadingsInserted = new Set(); // Track inserted class headings

    for (let i = 0; i < rows; i++) {
      let row = [];
      let validSeatCounter = 0; // Counter for valid seats in the current row

      for (let j = 0; j < seatsPerRow; j++) {
        const seatId = `${i}-${j}`;
        const isValid = validSeats.includes(seatId);
        const isSelected = selectedSeats.includes(seatId);
        const isUnavailable = unavailableSeats.includes(seatId);

        if (isValid) {
          validSeatCounter++; // Increment for each valid seat in the row
          const seatCode = `${String.fromCharCode(65 + i)}${validSeatCounter}`; // Generate human-readable code, e.g., 'A1'
          seatCodeMap[seatId] = seatCode; // Map seatId ('0-2') to readable code ('A1')

          row.push(
            <button
              key={seatId}
              className={`seat ${isSelected ? 'selected' : isUnavailable ? 'unavailable' : ''}`}
              onClick={() => toggleSeat(i, j)}
              disabled={isUnavailable}
            >
              {seatCode} {/* Display human-readable code */}
            </button>
          );
        } else {
          row.push(
            <div key={seatId} className="seat placeholder"></div> // Placeholder for unavailable seats
          );
        }
      }

      const classInfoEntry = classInfo.find(classEntry => classEntry.classNo === i);
      if (classInfoEntry && !classHeadingsInserted.has(i)) {
        seatMap.push(
          <div key={`heading-${i}`} className="class-heading">
            <h2>{classInfoEntry.className}</h2>
          </div>
        );
        classHeadingsInserted.add(i); // Mark class heading as inserted
      }

      seatMap.push(
        <div key={i} className={`row row-${i} ${classInfoEntry ? classInfoEntry.classType : ''}`}>
          {row}
        </div>
      );
    }

    return seatMap;
  };
  const isBookingRoute = location.pathname.startsWith(`/${theatreName}/${movieName}`);
  return (
    <div className="movie-booking-card">
      {!isBookingRoute && navigate(`/`)}
      <header className="card-header">
        <h1 className="card-title">{props.theatre.toUpperCase()} Seat Booking <p style={{color:'white'}}>{movieParam.movie}</p></h1>
        <p className="card-description">Choose your seats.</p>
      </header>
      <main className="card-content">
        <div className="screen-container">
          <div className="screen">
            <span>Screen {movieParam.screen} - {date} / {slot}</span>
          </div>
        </div>
        <div className="legend">
          <div className="legend-item">
            <div className="legend-color available"></div>
            <span>Available</span>
          </div>
          <div className="legend-item">
            <div className="legend-color selected"></div>
            <span>Selected</span>
          </div>
          <div className="legend-item">
            <div className="legend-color unavailable"></div>
            <span>Unavailable</span>
          </div>
        </div>
        <div className="theaterX">
          <div className="seating-layout">
            {renderSeats()}
          </div>
        </div>
        <h1 style={{textAlign:'center',backgroundColor:'#01cad1c9',borderRadius:'0 0 150px 150px'}}>Screen this way</h1>
      </main>
      <footer className="card-footer">
        <div className="info">
          <span className="info-icon">🎟️</span>
          <span>Selected Seats: {selectedSeats.length}</span>
        </div>
        <div className="info">
          <span className="info-icon">💲</span>
          <span>Total: ${selectedSeats.length * seatPrice}</span>
        </div>

        {selectedSeats.length === 0 ? (
          <button className="book-button disabled" disabled>
            Book Seats
          </button>
        ) : (
          <button onClick={handleBooking} className="book-button">
            Book Seats
          </button>
        )}
      </footer>
    </div>
  );
};

export default MovieSeatBooking;
