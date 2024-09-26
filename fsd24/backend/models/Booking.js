// // models/Booking.js
// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const bookingSchema = new Schema({
//   user: { type: String, required: true},  // Reference to the user booking the seat
//   movie: { type: String, required: true }, // Reference to the movie
//   theatre: { type: String, required: true}, // Reference to the theatre
//   screen: { type: String, required: true }, // Reference to the screen
//   date: { type: Date, required: true }, // Booking date
//   timeSlot: { type: String, required: true }, // The time slot of the booking
//   selectedSeats: [{ type: String, required: true }], // Array of booked seat identifiers
//   totalPrice: { type: Number, required: true }, // Total price for the booking
//   createdAt: { type: Date, default: Date.now }, // Timestamp for when the booking was made
// });

// // type: Schema.Types.ObjectId, ref: 'Movie', default: null

// module.exports = mongoose.model('Booking', bookingSchema);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  user:{ type: String, required: true},
  movie: { type: String, required: true},
  theatre: { type: String, required: true},
  screen: { type: String, required: true},
  date: { type: String, required: true },
  timeSlot: { type: String, required: true },
  selectedSeatCodeMap: { type: Map, of: String, required: true }, // Map of seatId ('0-2') -> human-readable code ('A1')
  totalPrice: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
