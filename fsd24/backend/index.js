const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5001;

const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://saikiransuguru:7eYEmWV5Nmzrn24m@cluster0.sbi4o.mongodb.net/TheatreDB?retryWrites=true&w=majority&appName=Cluster0",{ useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

const theatreController = require('./controllers/theatreController');
const screenController = require('./controllers/screenController');
const movieController = require('./controllers/movieController');
const slotController = require('./controllers/slotController');
const userController = require('./controllers/userController');
const webPageController = require('./controllers/webPageControllers');

const Booking = require('./models/Booking');
const Screen = require('./models/Screen');
app.use(bodyParser.json());
app.use(express.json());
// Enable CORS for all routes
app.use(cors());
// Theatre routes
app.post('/theatres', theatreController.createTheatre);
app.get('/theatres', theatreController.getTheatres);
app.get('/theatres/:id', theatreController.getTheatre);
app.put('/theatres/:id', theatreController.updateTheatre);
app.delete('/theatres/:id', theatreController.deleteTheatre);
app.get('/theatres/name/:name', theatreController.getTheatreByName);

// Screen routes
app.post('/screens', screenController.createScreen);
app.get('/screens', screenController.getScreens);
app.get('/screensQuery', screenController.getScreensByQuery);

app.get('/screensbyNo', screenController.getScreen);
app.get('/screens/:id', screenController.getScreenById);

app.put('/screens/:id', screenController.updateScreen);
app.delete('/screens/:id', screenController.deleteScreen);

// Movie routes
app.post('/movies', movieController.createMovie);
app.get('/movies', movieController.getMovies); //replace by getMovieByTheatre
app.get('/moviesQuery', movieController.getMoviesByQuery); 
app.get('/movies/:id', movieController.getMovie);
app.put('/movies/:id', movieController.updateMovie);
app.delete('/movies/:id', movieController.deleteMovie);

app.get('/moviesByTS',movieController.getMoviesByTS);
app.get('/moviesByTheatre', movieController.getMoviesByTheatre);
app.get('/movies/name/:name', movieController.getMovieByName);

// Slot routes
app.post('/slots', slotController.createSlot);
app.get('/slotsQuery', slotController.getSlotsbyQuery);
app.get('/slots',slotController.getSlots);
app.get('/slots/:id', slotController.getSlot);
app.put('/slots/:id', slotController.updateSlot);
app.delete('/slots/:id', slotController.deleteSlot);

//User routes

app.post('/user', userController.createUser);
app.get('/user', userController.getUsers);
app.get('/user/:id', userController.getUserById);
app.put('/user/:id', userController.updateUser);
app.delete('/:id', userController.deleteUser);

//WebPage routes
app.post('/webpage', webPageController.createWebPage);
app.get('/webpage', webPageController.getWebPages);
app.get('/webpage/:id', webPageController.getWebPageById);
app.put('/webpage/:id', webPageController.updateWebPage);
app.delete('/webpage/:id', webPageController.deleteWebPage);

app.post('/book', async (req, res) => {
    const { userId, movieId, theatreId, screenId, date, timeSlot, selectedSeats, selectedSeatCodeMap, totalPrice } = req.body;
  
    try {
      // Fetch the screen document to check validity of selected seats
      const screen = await Screen.findOne({ screenNo: screenId });
  
      if (!screen) {
        return res.status(404).json({ message: 'Screen not found' });
      }
  
      // Check if selectedSeats are valid and not unavailable
      const invalidSeats = selectedSeats.filter(seat => 
        !screen.validSeats.includes(seat) || screen.selectedSeats.includes(seat)
      );
  
      if (invalidSeats.length > 0) {
        return res.status(400).json({ message: 'Invalid or unavailable seats', invalidSeats });
      }
  
      // Create a new booking
      const newBooking = new Booking({
        user: userId,
        movie: movieId,
        theatre: theatreId,
        screen: screenId,
        date: new Date(date),
        timeSlot,
        selectedSeatCodeMap,
        totalPrice
      });
  
      // Save the booking in the database
      await newBooking.save();
  
      // Mark seats as unavailable in the screen document
      await Screen.findOneAndUpdate({ screenNo: screenId }, {
        $push: { selectedSeats: { $each: selectedSeats } }
      });
  
      res.status(201).json({ message: 'Booking successful!', booking: newBooking });
    } catch (error) {
      console.error('Error booking seats:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
module.exports = app;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
