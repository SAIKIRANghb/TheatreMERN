const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const webPageSchema = new Schema({
  logoUrl: {
    type: String, // URL or path to the logo image
    required: true,
  },
  theatreName: {
    type: String,
    required: true,
  },
  footer: {
    type: String, // HTML content for the footer as a string
    required: true,
  },
  date: {
    type: Date,
    default: Date.now, // Automatically set the current date
    required: true
  }
});

module.exports = mongoose.model('WebPage', webPageSchema);
