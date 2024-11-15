import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './ArtistLayout.css';

const ArtistLayout = ({ children }) => {
  const { pathname } = useLocation();
  const { currentUser } = useAuth();

  const navigationItems = [
    { path: '/artist/dashboard', label: 'Dashboard' },
    { path: '/artist/profile', label: 'Profile' },
    { path: '/artist/shares', label: 'Share Management' },
    { path: '/artist/metrics', label: 'Performance Metrics' },
    { path: '/artist/revenue', label: 'Revenue' },
  ];

  return (
    <div className="artist-layout">
      <aside className="artist-layout__sidebar">
        <div className="artist-layout__profile">
          <img 
            src={currentUser?.photoURL || '/default-avatar.png'} 
            alt="Profile" 
            className="artist-layout__avatar"
          />
          <h3 className="artist-layout__name">{currentUser?.displayName}</h3>
        </div>
        
        <nav className="artist-layout__nav">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`artist-layout__nav-item ${
                pathname === item.path ? 'artist-layout__nav-item--active' : ''
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      
      <main className="artist-layout__main">
        {children}
      </main>
    </div>
  );
};

export default ArtistLayout;