import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useTheme } from '../../../hooks/useTheme';
import Button from '../Button/Button';
import './Navbar.css';

const Navbar = () => {
  const { currentUser, userRole, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getDashboardLink = () => {
    if (userRole === 'artist') return '/artist/dashboard';
    if (userRole === 'investor') return '/investor/dashboard';
    return '/';
  };

  return (
    <nav className="navbar">
      <div className="navbar__container">
        <Link to="/" className="navbar__logo">
          MusicInvest
        </Link>

        <div className="navbar__links">
          <Link to="/market" className="navbar__link">
            Market
          </Link>
          <Link to="/artists" className="navbar__link">
            Artists
          </Link>
          <Link to="/about" className="navbar__link">
            About
          </Link>
        </div>

        <div className="navbar__actions">
          <button 
            onClick={toggleTheme}
            className="navbar__theme-toggle"
            aria-label="Toggle theme"
          >
            {darkMode ? '🌞' : '🌙'}
          </button>

          {currentUser ? (
            <>
              <Link to={getDashboardLink()} className="navbar__link">
                Dashboard
              </Link>
              <div className="navbar__user-menu">
                <img 
                  src={currentUser.photoURL || '/default-avatar.png'} 
                  alt="Profile" 
                  className="navbar__avatar"
                />
                <div className="navbar__dropdown">
                  <Link to="/profile" className="navbar__dropdown-item">
                    Profile
                  </Link>
                  <Link to="/settings" className="navbar__dropdown-item">
                    Settings
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="navbar__dropdown-item navbar__dropdown-item--danger"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="navbar__auth-buttons">
              <Button 
                variant="secondary" 
                size="small"
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
              <Button 
                variant="primary" 
                size="small"
                onClick={() => navigate('/register')}
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;