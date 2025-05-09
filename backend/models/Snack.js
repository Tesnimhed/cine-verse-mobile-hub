
const mongoose = require('mongoose');

const SnackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: String,
  category: {
    type: String,
    required: true
  },
  description: String,
  inStock: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Snack', SnackSchema);
