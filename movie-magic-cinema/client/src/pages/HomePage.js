import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import MovieCard from '../components/movies/MovieCard';

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get('/api/movies');
        setMovies(response.data || []);
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError('Failed to fetch movies. Please try again later.');
        if (err.response && err.response.status === 404) {
          setError('No movies found or API endpoint not available.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const filteredMovies = useMemo(() => {
    if (!searchTerm) {
      return movies;
    }
    return movies.filter(movie =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [movies, searchTerm]);

  return (
    <div className="p-4">
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search movies by title..."
          className="w-full md:w-1/2 lg:w-1/3 px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-red-500 focus:border-red-500 placeholder-gray-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading && (
        <div className="text-center py-10">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32 mx-auto"></div>
          <p className="mt-4 text-xl">Loading Movies...</p>
        </div>
      )}
      {error && <p className="text-red-500 text-center text-xl py-10">{error}</p>}

      {!loading && !error && filteredMovies.length === 0 && (
        <p className="text-gray-400 text-center text-xl py-10">
          {searchTerm ? 'No movies match your search.' : 'No movies available at the moment.'}
        </p>
      )}

      {!loading && !error && filteredMovies.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
