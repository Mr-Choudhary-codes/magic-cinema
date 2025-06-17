const express = require('express');
const router = express.Router();
const {
  createMovie,
  getAllMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
} = require('../controllers/movieController');
const { protect } = require('../middleware/authMiddleware'); // Admin authentication middleware

// GET /api/movies – get all movies (Public)
router.get('/', getAllMovies);

// POST /api/movies – admin uploads a new movie (Private/Admin)
router.post('/', protect, createMovie);

// GET /api/movies/:id – get movie details (Public)
router.get('/:id', getMovieById);

// PUT /api/movies/:id – admin updates a movie (Private/Admin)
router.put('/:id', protect, updateMovie);

// DELETE /api/movies/:id – admin deletes a movie (Private/Admin)
router.delete('/:id', protect, deleteMovie);

module.exports = router;
