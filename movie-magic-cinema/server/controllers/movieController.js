const Movie = require('../models/Movie');

// @desc    Create a new movie
// @route   POST /api/movies
// @access  Private/Admin
const createMovie = async (req, res) => {
  const {
    title,
    genre,
    releaseYear,
    language,
    description,
    videoUrl,
    thumbnailUrl,
    rating,
  } = req.body;

  // Basic validation
  if (!title || !genre || !releaseYear || !description || !videoUrl || !thumbnailUrl) {
    return res.status(400).json({ message: 'Please provide all required movie details' });
  }

  try {
    const movie = new Movie({
      title,
      genre,
      releaseYear,
      language,
      description,
      videoUrl,
      thumbnailUrl,
      rating,
    });

    const createdMovie = await movie.save();
    res.status(201).json(createdMovie);
  } catch (error) {
    console.error('Error creating movie:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', errors: error.errors });
    }
    res.status(500).json({ message: 'Server error while creating movie' });
  }
};

// @desc    Get all movies
// @route   GET /api/movies
// @access  Public
const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find({}).sort({ createdAt: -1 }); // Sort by newest first
    res.json(movies);
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ message: 'Server error while fetching movies' });
  }
};

// @desc    Get a single movie by ID
// @route   GET /api/movies/:id
// @access  Public
const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (movie) {
      res.json(movie);
    } else {
      res.status(404).json({ message: 'Movie not found' });
    }
  } catch (error) {
    console.error('Error fetching movie by ID:', error);
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Movie not found (invalid ID format)' });
    }
    res.status(500).json({ message: 'Server error while fetching movie' });
  }
};

// @desc    Update a movie
// @route   PUT /api/movies/:id
// @access  Private/Admin
const updateMovie = async (req, res) => {
  const {
    title,
    genre,
    releaseYear,
    language,
    description,
    videoUrl,
    thumbnailUrl,
    rating,
  } = req.body;

  try {
    const movie = await Movie.findById(req.params.id);

    if (movie) {
      movie.title = title || movie.title;
      movie.genre = genre || movie.genre;
      movie.releaseYear = releaseYear || movie.releaseYear;
      movie.language = language || movie.language;
      movie.description = description || movie.description;
      movie.videoUrl = videoUrl || movie.videoUrl;
      movie.thumbnailUrl = thumbnailUrl || movie.thumbnailUrl;
      movie.rating = rating !== undefined ? rating : movie.rating;

      const updatedMovie = await movie.save();
      res.json(updatedMovie);
    } else {
      res.status(404).json({ message: 'Movie not found' });
    }
  } catch (error) {
    console.error('Error updating movie:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', errors: error.errors });
    }
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Movie not found (invalid ID format)' });
    }
    res.status(500).json({ message: 'Server error while updating movie' });
  }
};

// @desc    Delete a movie
// @route   DELETE /api/movies/:id
// @access  Private/Admin
const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (movie) {
      await movie.deleteOne(); // Correct Mongoose 8+ way to remove
      res.json({ message: 'Movie removed' });
    } else {
      res.status(404).json({ message: 'Movie not found' });
    }
  } catch (error) {
    console.error('Error deleting movie:', error);
     if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Movie not found (invalid ID format)' });
    }
    res.status(500).json({ message: 'Server error while deleting movie' });
  }
};

module.exports = {
  createMovie,
  getAllMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
};
