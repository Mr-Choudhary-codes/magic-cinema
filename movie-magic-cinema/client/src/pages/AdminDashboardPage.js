import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Modal from '../components/common/Modal';

const AdminDashboardPage = () => {
  const [movies, setMovies] = useState([]);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [errorMovies, setErrorMovies] = useState('');

  const [newMovie, setNewMovie] = useState({ title: '', genre: '', releaseYear: '', language: '', description: '', videoUrl: '', thumbnailUrl: '', rating: '', });
  const [isSubmittingMovie, setIsSubmittingMovie] = useState(false);
  const [submitMovieError, setSubmitMovieError] = useState('');
  const [submitMovieSuccess, setSubmitMovieSuccess] = useState('');

  const [editingMovie, setEditingMovie] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isUpdatingMovie, setIsUpdatingMovie] = useState(false);
  const [updateMovieError, setUpdateMovieError] = useState('');
  const [updateMovieSuccess, setUpdateMovieSuccess] = useState('');

  const fetchMovies = useCallback(async () => {
    setLoadingMovies(true); setErrorMovies('');
    try {
      const response = await axios.get('/api/movies');
      setMovies(response.data || []);
    } catch (err) { setErrorMovies('Failed to fetch movies.'); }
    finally { setLoadingMovies(false); }
  }, []);

  useEffect(() => { fetchMovies(); }, [fetchMovies]);

  const handleDeleteMovie = async (movieId, movieTitle) => {
    if (window.confirm(\`Delete "\${movieTitle}"?\`)) {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) { setErrorMovies('Auth error.'); return; }
        await axios.delete(\`/api/movies/\${movieId}\`, { headers: { Authorization: \`Bearer \${token}\` } });
        fetchMovies();
      } catch (err) { setErrorMovies(\`Failed to delete. \${err.response?.data?.message || ''}\`); }
    }
  };

  const valueAsNumber = (name, value) => {
    if (name === 'releaseYear' || name === 'rating') {
      const num = parseFloat(value);
      return isNaN(num) ? '' : num;
    }
    return value;
  };

  const handleNewMovieChange = (e) => { const { name, value } = e.target; setNewMovie(prev => ({ ...prev, [name]: valueAsNumber(name, value) })); };
  const handleEditMovieChange = (e) => { const { name, value } = e.target; setEditingMovie(prev => ({ ...prev, [name]: valueAsNumber(name, value) })); };

  const commonFormSubmitLogic = async (action, data, token, successMsg, errorMsgPrefix, clearFormCallback) => {
    if (!token) return { error: 'Auth required.' };
    const requiredFields = ['title', 'genre', 'releaseYear', 'description', 'videoUrl', 'thumbnailUrl'];
    for (const field of requiredFields) {
      if (!data[field]) return { error: 'Required fields missing.' };
    }
    try {
      if (action === 'post') await axios.post('/api/movies', data, { headers: { Authorization: \`Bearer \${token}\` } });
      else if (action === 'put') await axios.put(\`/api/movies/\${data._id}\`, data, { headers: { Authorization: \`Bearer \${token}\` } });
      if (clearFormCallback) clearFormCallback();
      fetchMovies();
      return { success: successMsg };
    } catch (err) {
      return { error: \`\${errorMsgPrefix}. \${err.response?.data?.message || 'Server error'}\` };
    }
  };

  const handleAddNewMovie = async (e) => {
    e.preventDefault(); setIsSubmittingMovie(true); setSubmitMovieError(''); setSubmitMovieSuccess('');
    const token = localStorage.getItem('adminToken');
    const result = await commonFormSubmitLogic('post', newMovie, token, 'Movie added!', 'Failed to add', () => {
      setNewMovie({ title: '', genre: '', releaseYear: '', language: '', description: '', videoUrl: '', thumbnailUrl: '', rating: '' });
    });
    if (result.success) setSubmitMovieSuccess(result.success);
    if (result.error) setSubmitMovieError(result.error);
    setIsSubmittingMovie(false);
    setTimeout(() => { setSubmitMovieError(''); setSubmitMovieSuccess(''); }, 3000);
  };

  const handleUpdateMovie = async (e) => {
    e.preventDefault(); if (!editingMovie?._id) return;
    setIsUpdatingMovie(true); setUpdateMovieError(''); setUpdateMovieSuccess('');
    const token = localStorage.getItem('adminToken');
    const result = await commonFormSubmitLogic('put', editingMovie, token, 'Movie updated!', 'Failed to update', null);
    if (result.success) {
      setUpdateMovieSuccess(result.success);
      setTimeout(() => { setShowEditModal(false); setEditingMovie(null); setUpdateMovieSuccess(''); }, 1500);
    }
    if (result.error) setUpdateMovieError(result.error);
    setIsUpdatingMovie(false);
    setTimeout(() => { setUpdateMovieError(''); }, 3000);
  };

  const handleOpenEditModal = (movie) => { setEditingMovie({...movie}); setShowEditModal(true); setUpdateMovieError(''); setUpdateMovieSuccess(''); };

  const inputClass = "w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 placeholder-gray-400 text-sm";
  const labelClass = "block text-sm font-medium text-gray-300 mb-1";
  const formSectionClass = "mb-8 p-4 sm:p-6 bg-gray-800 rounded-xl shadow-xl";
  const formTitleClass = "text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6";

  const renderMovieFormFields = (formData, handleChange) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label htmlFor={\`\${formData === newMovie ? 'new' : 'edit'}Title\`} className={labelClass}>Title*</label><input type="text" name="title" id={\`\${formData === newMovie ? 'new' : 'edit'}Title\`} value={formData.title || ''} onChange={handleChange} className={inputClass} required /></div>
        <div><label htmlFor={\`\${formData === newMovie ? 'new' : 'edit'}Genre\`} className={labelClass}>Genre*</label><input type="text" name="genre" id={\`\${formData === newMovie ? 'new' : 'edit'}Genre\`} value={formData.genre || ''} onChange={handleChange} className={inputClass} required /></div>
        <div><label htmlFor={\`\${formData === newMovie ? 'new' : 'edit'}ReleaseYear\`} className={labelClass}>Release Year*</label><input type="number" name="releaseYear" id={\`\${formData === newMovie ? 'new' : 'edit'}ReleaseYear\`} value={formData.releaseYear || ''} onChange={handleChange} className={inputClass} required /></div>
        <div><label htmlFor={\`\${formData === newMovie ? 'new' : 'edit'}Language\`} className={labelClass}>Language</label><input type="text" name="language" id={\`\${formData === newMovie ? 'new' : 'edit'}Language\`} value={formData.language || ''} onChange={handleChange} className={inputClass} /></div>
      </div>
      <div><label htmlFor={\`\${formData === newMovie ? 'new' : 'edit'}Description\`} className={labelClass}>Description*</label><textarea name="description" id={\`\${formData === newMovie ? 'new' : 'edit'}Description\`} value={formData.description || ''} onChange={handleChange} className={inputClass} rows="3" required></textarea></div>
      <div><label htmlFor={\`\${formData === newMovie ? 'new' : 'edit'}VideoUrl\`} className={labelClass}>Video URL*</label><input type="url" name="videoUrl" id={\`\${formData === newMovie ? 'new' : 'edit'}VideoUrl\`} value={formData.videoUrl || ''} onChange={handleChange} className={inputClass} required /></div>
      <div><label htmlFor={\`\${formData === newMovie ? 'new' : 'edit'}ThumbnailUrl\`} className={labelClass}>Thumbnail URL*</label><input type="url" name="thumbnailUrl" id={\`\${formData === newMovie ? 'new' : 'edit'}ThumbnailUrl\`} value={formData.thumbnailUrl || ''} onChange={handleChange} className={inputClass} required /></div>
      <div><label htmlFor={\`\${formData === newMovie ? 'new' : 'edit'}Rating\`} className={labelClass}>Rating (0-10)</label><input type="number" name="rating" id={\`\${formData === newMovie ? 'new' : 'edit'}Rating\`} value={formData.rating || ''} onChange={handleChange} className={inputClass} min="0" max="10" step="0.1" /></div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">Admin Dashboard</h1>
      <div className={formSectionClass}>
        <h2 className={formTitleClass}>Add New Movie</h2>
        {submitMovieError && <p className="bg-red-500 text-white p-3 rounded mb-4 text-sm">{submitMovieError}</p>}
        {submitMovieSuccess && <p className="bg-green-500 text-white p-3 rounded mb-4 text-sm">{submitMovieSuccess}</p>}
        <form onSubmit={handleAddNewMovie}>
          {renderMovieFormFields(newMovie, handleNewMovieChange)}
          <button type="submit" disabled={isSubmittingMovie} className="mt-5 w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-5 rounded-lg disabled:opacity-60 transition-colors text-sm">{isSubmittingMovie ? 'Adding...' : 'Add Movie'}</button>
        </form>
      </div>

      <div className={formSectionClass}>
        <h2 className={formTitleClass}>Manage Existing Movies</h2>
        {loadingMovies && <div className="text-center py-5"><div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mx-auto"></div><p className="text-sm mt-2">Loading...</p></div>}
        {errorMovies && <p className="text-red-400 p-4 text-center text-sm">{errorMovies}</p>}
        {!loadingMovies && !errorMovies && movies.length === 0 && <p className="text-gray-400 text-sm">No movies found.</p>}
        {!loadingMovies && !errorMovies && movies.length > 0 && (
          <div className="overflow-x-auto"><table className="min-w-full text-xs sm:text-sm text-left text-gray-300">
            <thead className="text-xs text-gray-100 uppercase bg-gray-700"><tr><th className="px-4 py-3">Thumbnail</th><th className="px-4 py-3">Title</th><th className="px-4 py-3">Genre</th><th className="px-4 py-3">Year</th><th className="px-4 py-3">Actions</th></tr></thead>
            <tbody>{movies.map((movie) => (<tr key={movie._id} className="border-b border-gray-700 hover:bg-gray-750 transition-colors">
              <td className="px-4 py-2"><img src={movie.thumbnailUrl || 'https://via.placeholder.com/40x60?text=N/A'} alt={movie.title} className="h-14 w-auto rounded"/></td>
              <td className="px-4 py-2 font-medium text-white whitespace-nowrap">{movie.title}</td><td className="px-4 py-2 whitespace-nowrap">{movie.genre}</td><td className="px-4 py-2">{movie.releaseYear}</td>
              <td className="px-4 py-2 whitespace-nowrap"><button onClick={() => handleOpenEditModal(movie)} className="font-medium text-blue-400 hover:text-blue-300 mr-2 sm:mr-3">Edit</button><button onClick={() => handleDeleteMovie(movie._id, movie.title)} className="font-medium text-red-400 hover:text-red-300">Delete</button></td></tr>))}</tbody>
          </table></div>)}
      </div>

      {editingMovie && (<Modal isOpen={showEditModal} onClose={() => { setShowEditModal(false); setEditingMovie(null);}} title="Edit Movie">
        {updateMovieError && <p className="bg-red-500 text-white p-3 rounded mb-4 text-sm">{updateMovieError}</p>}
        {updateMovieSuccess && <p className="bg-green-500 text-white p-3 rounded mb-4 text-sm">{updateMovieSuccess}</p>}
        <form onSubmit={handleUpdateMovie}>
          {renderMovieFormFields(editingMovie, handleEditMovieChange)}
          <div className="flex justify-end space-x-3 mt-5">
            <button type="button" onClick={() => { setShowEditModal(false); setEditingMovie(null);}} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white font-medium rounded-lg text-sm transition-colors">Cancel</button>
            <button type="submit" disabled={isUpdatingMovie} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg disabled:opacity-60 transition-colors text-sm">{isUpdatingMovie ? 'Updating...' : 'Save Changes'}</button>
          </div></form></Modal>)}
    </div>);};
export default AdminDashboardPage;
