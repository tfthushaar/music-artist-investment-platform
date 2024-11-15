import React from 'react';
import './PortfolioFilters.css';

const PortfolioFilters = ({ filters, onFilterChange }) => {
  const genres = [
    'all',
    'Pop',
    'Hip Hop',
    'Rock',
    'Electronic',
    'R&B',
    'Country',
    'Jazz',
    'Classical'
  ];

  const sortOptions = [
    { value: 'value', label: 'Value' },
    { value: 'return', label: 'Return' },
    { value: 'artist', label: 'Artist Name' }
  ];

  const performanceOptions = [
    { value: 'all', label: 'All Performance' },
    { value: 'positive', label: 'Positive Return' },
    { value: 'negative', label: 'Negative Return' }
  ];

  return (
    <div className="portfolio-filters">
      <div className="portfolio-filters__group">
        <label>Sort By</label>
        <div className="portfolio-filters__sort">
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange({ sortBy: e.target.value })}
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            className="sort-order"
            onClick={() => onFilterChange({
              sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc'
            })}
          >
            {filters.sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      <div className="portfolio-filters__group">
        <label>Genre</label>
        <select
          value={filters.genre}
          onChange={(e) => onFilterChange({ genre: e.target.value })}
        >
          {genres.map(genre => (
            <option key={genre} value={genre}>
              {genre.charAt(0).toUpperCase() + genre.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="portfolio-filters__group">
        <label>Performance</label>
        <select
          value={filters.performance}
          onChange={(e) => onFilterChange({ performance: e.target.value })}
        >
          {performanceOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default PortfolioFilters;