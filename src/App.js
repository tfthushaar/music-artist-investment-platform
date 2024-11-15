import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import MainLayout from './layouts/MainLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ArtistDashboard from './pages/Artist/Dashboard';
import InvestorDashboard from './pages/Investor/Dashboard';

// Protected Route Component
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <MainLayout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Artist Routes */}
              <Route
                path="/artist/*"
                element={
                  <ProtectedRoute role="artist">
                    <ArtistDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Protected Investor Routes */}
              <Route
                path="/investor/*"
                element={
                  <ProtectedRoute role="investor">
                    <InvestorDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </MainLayout>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;