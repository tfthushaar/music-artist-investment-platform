import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../../../utils/formatters';
import Button from '../../../common/Button/Button';
import './PortfolioTable.css';

const PortfolioTable = ({ investments, onRefresh }) => {
  return (
    <div className="portfolio-table">
      <div className="portfolio-table__header">
        <h2>Investment Details</h2>
        <Button
          variant="secondary"
          size="small"
          onClick={onRefresh}
        >
          Refresh Data
        </Button>
      </div>

      <div className="portfolio-table__container">
        <table>
          <thead>
            <tr>
              <th>Artist</th>
              <th>Shares</th>
              <th>Avg. Purchase Price</th>
              <th>Current Price</th>
              <th>Total Value</th>
              <th>Return</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {investments.map(investment => {
              const currentValue = investment.shares * investment.currentPrice;
              const invested = investment.shares * investment.purchasePrice;
              const return_pct = ((currentValue - invested) / invested) * 100;

              return (
                <tr key={investment.artistId}>
                  <td>
                    <div className="artist-info">
                      <img 
                        src={investment.artist.photoURL || '/default-artist.png'} 
                        alt={investment.artist.artistName} 
                      />
                      <div>
                        <span className="artist-name">
                          {investment.artist.artistName}
                        </span>
                        <span className="artist-genre">
                          {investment.artist.genre}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>{investment.shares}</td>
                  <td>{formatCurrency(investment.purchasePrice)}</td>
                  <td>{formatCurrency(investment.currentPrice)}</td>
                  <td>{formatCurrency(currentValue)}</td>
                  <td>
                    <span className={`return-value ${return_pct >= 0 ? 'positive' : 'negative'}`}>
                      {return_pct >= 0 ? '+' : ''}{return_pct.toFixed(2)}%
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Link to={`/trade/${investment.artistId}`}>
                        <Button variant="secondary" size="small">
                          Trade
                        </Button>
                      </Link>
                      <Link to={`/artist/${investment.artistId}`}>
                        <Button variant="text" size="small">
                          View
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PortfolioTable;