import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    if (!username || !password) {
      setError('Username and password are required.');
      setLoading(false); return;
    }
    try {
      const response = await axios.post('/api/admin/login', { username, password });
      setLoading(false);
      if (response.data && response.data.token) {
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('adminUser', JSON.stringify({ id: response.data._id, username: response.data.username }));
        navigate('/admin/dashboard');
      } else { setError('Login failed. No token received.'); }
    } catch (err) {
      setLoading(false);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.request) {
        setError('Login failed. No response from server.');
      } else { setError('Login failed. An unexpected error occurred.'); }
      console.error('Admin login error:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-red-600">Movie Magic</h1>
            <p className="text-xl text-gray-300">Admin Panel</p>
        </div>
        <div className="bg-gray-800 p-6 sm:p-8 rounded-xl shadow-2xl w-full">
          <h2 className="text-2xl font-bold text-center text-white mb-6">Admin Login</h2>
          {error && <p className="bg-red-500 text-white p-3 rounded mb-4 text-sm text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">Username</label>
              <input
                type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 placeholder-gray-400"
                placeholder="Enter your username" required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">Password</label>
              <input
                type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 placeholder-gray-400"
                placeholder="Enter your password" required
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 disabled:opacity-60 transition-colors duration-150"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default AdminLoginPage;
