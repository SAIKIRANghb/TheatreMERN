const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Slot schema
const slotSchema = new Schema({
  movie: { type: Schema.Types.ObjectId, ref: 'Movie', default: null },
  theatre: { type: Schema.Types.ObjectId, ref: 'Theatre', default: null },
  time: { type: String, required: true },
  date: { type: Date, required: true },
  screen: { type: Schema.Types.ObjectId, ref: 'Screen', default: null }
});

// Create the Slot model
const Slot = mongoose.model('Slot', slotSchema);

module.exports = Slot;
