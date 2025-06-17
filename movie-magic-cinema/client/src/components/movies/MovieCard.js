import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  if (!movie) {
    return null; // Or a placeholder/loading state for the card
  }

  return (
    <Link to={`/movie/\${movie._id}`} className="block group">
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:shadow-2xl">
        <img
          src={movie.thumbnailUrl || 'https://via.placeholder.com/300x450?text=No+Image'}
          alt={movie.title}
          className="w-full h-72 object-cover" // Fixed height for consistency, object-cover to maintain aspect ratio
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold text-white truncate" title={movie.title}>
            {movie.title}
          </h3>
          <p className="text-sm text-gray-400 truncate" title={movie.genre}>
            {movie.genre}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
