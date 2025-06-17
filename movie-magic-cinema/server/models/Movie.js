const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  genre: {
    type: String,
    required: true,
    trim: true,
  },
  releaseYear: {
    type: Number,
    required: true,
  },
  language: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  videoUrl: {
    type: String,
    required: true,
    trim: true,
  },
  thumbnailUrl: {
    type: String,
    required: true,
    trim: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 10,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Movie = mongoose.model('Movie', MovieSchema);
module.exports = Movie;
