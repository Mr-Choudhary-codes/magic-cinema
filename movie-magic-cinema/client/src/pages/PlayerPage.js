import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactPlayer from 'react-player/lazy';

const PlayerPage = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [videoUrl, setVideoUrl] = useState('');
  const [movieTitle, setMovieTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovieVideo = async () => {
      setLoading(true); setError('');
      try {
        const response = await axios.get(\`/api/movies/\${movieId}\`);
        if (response.data && response.data.videoUrl) {
          setVideoUrl(response.data.videoUrl);
          setMovieTitle(response.data.title || 'Video');
        } else { setError('Video URL not found for this movie.'); }
      } catch (err) {
        console.error('Error fetching movie video details:', err);
        if (err.response && err.response.status === 404) { setError('Movie not found or video is unavailable.'); }
        else { setError('Failed to load video. Please try again later.'); }
      } finally { setLoading(false); }
    };
    if (movieId) { fetchMovieVideo(); }
  }, [movieId]);

  if (loading) {
    return (
      <div className="bg-black min-h-screen flex justify-center items-center text-white">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-24 w-24 md:h-32 md:w-32"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black min-h-screen flex flex-col justify-center items-center text-white p-4 text-center">
        <p className="text-red-400 text-xl md:text-2xl mb-6">{error}</p>
        <button onClick={() => navigate(-1)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors">
          Go Back
        </button>
      </div>
    );
  }

  if (!videoUrl) { return <div className="bg-black min-h-screen flex justify-center items-center text-white">Video not available.</div>; }

  return (
    <div className="bg-black min-h-screen flex flex-col items-center justify-center relative">
      {/* Custom Back Button Overlay */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 z-50 bg-black bg-opacity-50 hover:bg-opacity-75 text-white py-2 px-4 rounded-full transition-colors text-sm md:text-base"
        aria-label="Go back"
      >
        &larr; Back
      </button>

      <div className='player-wrapper w-screen h-screen'> {/* Ensure it takes full screen */}
        <ReactPlayer
          className='react-player' // Ensure this class doesn't conflict or is styled for fixed if needed elsewhere
          url={videoUrl}
          width='100%'
          height='100%'
          controls={true}
          playing={true}
          pip={true}
          stopOnUnmount={true}
          config={{ file: { attributes: { controlsList: 'nodownload' } } }}
        />
      </div>
    </div>
  );
};

export default PlayerPage;
