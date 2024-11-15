import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../../../utils/formatters';
import Button from '../../../common/Button/Button';
import './RecommendedArtists.css';

const RecommendedArtists = ({ artists }) => {
  return (
    <div className="recommended-artists">
      <h2>Recommended Artists</h2>
      
      <div className="recommended-artists__list">
        {artists.map(artist => (
          <div key={artist.id} className="artist-card">
            <div className="artist-card__header">
              <img 
                src={artist.photoURL || '/default-artist.png'} 
                alt={artist.artistName}
                className="artist-card__image" 
              />
              <div className="artist-card__info">
                <h3>{artist.artistName}</h3>
                <span className="artist-card__genre">{artist.genre}</span>
              </div>
            </div>

            <div className="artist-card__stats">
              <div className="artist-card__stat">
                <span className="stat-label">Share Price</span>
                <span className="stat-value">
                  {formatCurrency(artist.currentSharePrice)}
                </span>
              </div>
              <div className="artist-card__stat">
                <span className="stat-label">24h Change</span>
                <span className={`stat-value ${artist.priceChange >= 0 ? 'positive' : 'negative'}`}>
                  {artist.priceChange >= 0 ? '+' : ''}{artist.priceChange}%
                </span>
              </div>
            </div>

            <div className="artist-card__actions">
              <Link to={`/artist/${artist.id}`}>
                <Button variant="secondary" size="small" fullWidth>
                  View Profile
                </Button>
              </Link>
              <Link to={`/trade/${artist.id}`}>
                <Button variant="primary" size="small" fullWidth>
                  Invest Now
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <Link to="/discover" className="recommended-artists__more">
        View More Artists
      </Link>
    </div>
  );
};

export default RecommendedArtists;