import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const MovieDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(\`/api/movies/\${id}\`);
        setMovie(response.data);
      } catch (err) {
        console.error('Error fetching movie details:', err);
        if (err.response) {
          if (err.response.status === 404) { setError('Movie not found.'); }
          else { setError('Failed to fetch movie details.'); }
        } else { setError('Network error or server is not responding.'); }
      } finally { setLoading(false); }
    };
    if (id) { fetchMovieDetails(); }
  }, [id]);

  const handleWatchClick = () => { navigate(\`/player/\${movie._id}\`); };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-24 w-24 md:h-32 md:w-32"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center text-center p-4">
        <p className="text-red-400 text-xl md:text-2xl mb-6">{error}</p>
        <Link to="/" className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors">
          Go Back to Homepage
        </Link>
      </div>
    );
  }

  if (!movie) { return <div className="min-h-screen bg-gray-900 text-center py-10 text-xl text-gray-400">Movie data is not available.</div>; }

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-8 pb-12">
      <div className="container mx-auto p-4">
        <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden md:flex md:space-x-8">
          <div className="md:w-1/3">
            <img
              src={movie.thumbnailUrl || 'https://via.placeholder.com/400x600?text=No+Image'}
              alt={movie.title}
              className="w-full h-auto object-cover md:rounded-l-xl md:rounded-r-none"
            />
          </div>
          <div className="p-6 md:p-8 flex flex-col justify-center md:w-2/3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4">{movie.title}</h1>
            <div className="flex flex-wrap items-center text-gray-400 text-sm mb-4 md:mb-6 space-x-3">
              <span>{movie.releaseYear}</span>
              <span>&bull;</span>
              <span>{movie.genre}</span>
              {movie.language && (
                <>
                  <span>&bull;</span>
                  <span>{movie.language}</span>
                </>
              )}
              {movie.rating && movie.rating > 0 ? (
                <>
                  <span>&bull;</span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    {movie.rating.toFixed(1)}/10
                  </span>
                </>
              ) : null}
            </div>
            <p className="text-gray-300 mb-6 md:mb-8 text-base md:text-lg leading-relaxed">{movie.description}</p>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={handleWatchClick}
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform duration-150 ease-in-out hover:scale-105 shadow-lg"
              >
                Watch Movie
              </button>
              <Link to="/" className="w-full sm:w-auto border border-gray-600 hover:bg-gray-700 text-gray-300 hover:text-white font-semibold py-3 px-8 rounded-lg text-lg text-center transition-colors">
                &larr; Back to Movies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;
