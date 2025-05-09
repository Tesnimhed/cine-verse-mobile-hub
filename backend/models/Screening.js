
const mongoose = require('mongoose');

const ScreeningSchema = new mongoose.Schema({
  cinema: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cinema',
    required: true
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  tmdbMovieId: {
    type: Number,
    required: true
  },
  roomId: {
    type: Number,
    required: true
  },
  roomName: {
    type: String,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  format: {
    type: String,
    enum: ['2D', '3D', '4DX', 'IMAX'],
    default: '2D'
  },
  language: {
    type: String,
    enum: ['VO', 'VF'],
    default: 'VF'
  },
  price: {
    type: Number,
    required: true,
    default: 9.5
  },
  seats: [{
    id: String,
    row: String,
    number: Number,
    status: {
      type: String,
      enum: ['available', 'reserved', 'sold'],
      default: 'available'
    }
  }]
});

module.exports = mongoose.model('Screening', ScreeningSchema);
