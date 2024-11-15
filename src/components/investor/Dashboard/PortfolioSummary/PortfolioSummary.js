import React from 'react';
import { formatCurrency } from '../../../../utils/formatters';
import './PortfolioSummary.css';

const PortfolioSummary = ({ portfolio }) => {
  const calculateTotalValue = () => {
    return portfolio.investments.reduce((total, investment) => {
      return total + (investment.shares * investment.currentPrice);
    }, 0);
  };

  const calculateTotalReturn = () => {
    const totalInvested = portfolio.investments.reduce((total, investment) => {
      return total + (investment.shares * investment.purchasePrice);
    }, 0);
    
    const currentValue = calculateTotalValue();
    return ((currentValue - totalInvested) / totalInvested) * 100;
  };

  const totalValue = calculateTotalValue();
  const totalReturn = calculateTotalReturn();

  return (
    <div className="portfolio-summary">
      <div className="portfolio-summary__header">
        <h2>Portfolio Summary</h2>
        <span className="portfolio-summary__date">
          As of {new Date().toLocaleDateString()}
        </span>
      </div>

      <div className="portfolio-summary__stats">
        <div className="portfolio-summary__stat">
          <h3>Total Value</h3>
          <p>{formatCurrency(totalValue)}</p>
        </div>

        <div className="portfolio-summary__stat">
          <h3>Total Return</h3>
          <p className={`return--${totalReturn >= 0 ? 'positive' : 'negative'}`}>
            {totalReturn >= 0 ? '+' : ''}{totalReturn.toFixed(2)}%
          </p>
        </div>

        <div className="portfolio-summary__stat">
          <h3>Active Investments</h3>
          <p>{portfolio.investments.length}</p>
        </div>
      </div>

      <div className="portfolio-summary__holdings">
        <h3>Current Holdings</h3>
        <div className="portfolio-summary__table">
          <table>
            <thead>
              <tr>
                <th>Artist</th>
                <th>Shares</th>
                <th>Avg. Price</th>
                <th>Current Value</th>
                <th>Return</th>
              </tr>
            </thead>
            <tbody>
              {portfolio.investments.map(investment => {
                const currentValue = investment.shares * investment.currentPrice;
                const invested = investment.shares * investment.purchasePrice;
                const return_pct = ((currentValue - invested) / invested) * 100;

                return (
                  <tr key={investment.artistId}>
                    <td>
                      <div className="artist-info">
                        <img 
                          src={investment.artistPhoto} 
                          alt={investment.artistName} 
                        />
                        <span>{investment.artistName}</span>
                      </div>
                    </td>
                    <td>{investment.shares}</td>
                    <td>{formatCurrency(investment.purchasePrice)}</td>
                    <td>{formatCurrency(currentValue)}</td>
                    <td className={`return--${return_pct >= 0 ? 'positive' : 'negative'}`}>
                      {return_pct >= 0 ? '+' : ''}{return_pct.toFixed(2)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PortfolioSummary;