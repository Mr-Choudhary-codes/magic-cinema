import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import NotFoundPage from './pages/NotFoundPage';

// Layout component to wrap around pages that need Navbar and Footer
const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8"> {/* Add some padding to main content area */}
        <Outlet /> {/* Child routes will render here */}
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}> {/* Routes with Navbar and Footer */}
          <Route path="/" element={<HomePage />} />
          <Route path="/movie/:id" element={<MovieDetailPage />} />
          {/* Add other public movie-related routes here if needed */}
        </Route>

        {/* Routes that might not need the main Navbar/Footer or have a different layout */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        {/* For AdminDashboard, we might want MainLayout or a different AdminLayout later */}
        {/* For now, let's include it in MainLayout for simplicity, can be changed */}
        <Route element={<MainLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
