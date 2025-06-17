import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-900 text-white p-4 shadow-lg border-b border-gray-700">
      <div className="container mx-auto flex flex-wrap justify-between items-center">
        <Link to="/" className="text-2xl md:text-3xl font-bold text-red-600 hover:text-red-500 transition-colors">
          Movie Magic
        </Link>
        <div className="space-x-4 md:space-x-6 text-sm md:text-base">
          <Link to="/" className="hover:text-gray-300 transition-colors">Home</Link>
          {/* Placeholder for future links if any. For now, Admin Login is prominent */}
          <Link to="/admin/dashboard" className="hover:text-gray-300 transition-colors">Admin Dashboard</Link>
          {/* Consider moving Admin Login to be less prominent if a user is already logged in,
              or showing a logout button. This will be handled by auth state later. */}
          { !localStorage.getItem('adminToken') && (
            <Link to="/admin/login" className="bg-red-600 px-3 py-2 rounded hover:bg-red-700 transition-colors text-xs md:text-sm">
              Admin Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
