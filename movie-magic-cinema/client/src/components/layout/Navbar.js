import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-red-600 hover:text-red-500">Movie Magic</Link>
        <div className="space-x-4">
          <Link to="/" className="hover:text-gray-300">Home</Link>
          {/* Add other links here later, e.g., Genres, My List */}
          <Link to="/admin/login" className="hover:text-gray-300">Admin Login</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
