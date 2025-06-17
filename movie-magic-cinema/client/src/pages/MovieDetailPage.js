import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const MovieDetailPage = () => {
  const { id } = useParams(); // Get movie ID from URL params
  const navigate = useNavigate(); // To navigate, e.g., to a player or back
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(`/api/movies/\${id}`);
        setMovie(response.data);
      } catch (err) {
        console.error('Error fetching movie details:', err);
        if (err.response) {
          if (err.response.status === 404) {
            setError('Movie not found.');
          } else {
            setError('Failed to fetch movie details. Please try again later.');
          }
        } else {
          setError('Network error or server is not responding.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovieDetails();
    }
  }, [id]);

  const handleWatchClick = () => {
    // For now, log to console. Later, this will open the video player.
    console.log('Attempting to watch movie:', movie.title, 'Video URL:', movie.videoUrl);
    // Example navigation to a player page (implement PlayerPage later)
    // navigate(`/player/\${movie._id}`);
    alert(\`Playing: \${movie.title}\n(Video player functionality to be implemented next!)\`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 text-2xl">{error}</p>
        <Link to="/" className="mt-6 inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Go Back to Homepage
        </Link>
      </div>
    );
  }

  if (!movie) {
    // This case should ideally be covered by the error state if API returns 404
    return <div className="text-center py-10 text-xl">Movie data is not available.</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden md:flex">
        <img
          src={movie.thumbnailUrl || 'https://via.placeholder.com/400x600?text=No+Image'}
          alt={movie.title}
          className="w-full md:w-1/3 h-auto object-cover" // Responsive image sizing
        />
        <div className="p-6 md:p-8 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{movie.title}</h1>
            <p className="text-gray-300 mb-6 text-lg">{movie.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 mb-6 text-gray-400">
              <p><span className="font-semibold text-gray-200">Genre:</span> {movie.genre}</p>
              <p><span className="font-semibold text-gray-200">Release Year:</span> {movie.releaseYear}</p>
              <p><span className="font-semibold text-gray-200">Language:</span> {movie.language || 'N/A'}</p>
              <p><span className="font-semibold text-gray-200">Rating:</span> {movie.rating ? \`\${movie.rating}/10\` : 'N/A'}</p>
            </div>
          </div>

          <button
            onClick={handleWatchClick}
            className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            Watch Movie
          </button>
        </div>
      </div>
      <div className="mt-8 text-center">
        <Link to="/" className="text-red-500 hover:text-red-400 font-semibold">
          &larr; Back to Movies
        </Link>
      </div>
    </div>
  );
};

export default MovieDetailPage;
