import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  if (!movie) {
    return null;
  }

  return (
    <Link to={`/movie/\${movie._id}`} className="block group bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1">
      <div className="relative">
        <img
          src={movie.thumbnailUrl || 'https://via.placeholder.com/300x450?text=No+Image'}
          alt={movie.title}
          className="w-full h-72 object-cover transition-transform duration-300 group-hover:scale-105" // Consistent height, slight zoom on hover
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white truncate mb-1" title={movie.title}>
          {movie.title}
        </h3>
        <p className="text-xs text-gray-400 truncate" title={movie.genre}>
          {movie.genre}
        </p>
      </div>
    </Link>
  );
};

export default MovieCard;
