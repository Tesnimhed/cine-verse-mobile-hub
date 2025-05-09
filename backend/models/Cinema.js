
const mongoose = require('mongoose');

const CinemaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  location: {
    lat: Number,
    lng: Number
  },
  image: String,
  description: String,
  amenities: [String],
  rooms: [{
    roomNumber: Number,
    capacity: Number,
    features: [String]
  }]
});

module.exports = mongoose.model('Cinema', CinemaSchema);
