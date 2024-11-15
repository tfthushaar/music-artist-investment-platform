import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { investorService } from '../../../services/investor.service';
import Loading from '../../common/Loading/Loading';
import PortfolioSummary from './PortfolioSummary';
import InvestmentChart from './InvestmentChart';
import RecommendedArtists from './RecommendedArtists';
import './InvestorDashboard.css';

const InvestorDashboard = () => {
  const { currentUser } = useAuth();
  const [portfolio, setPortfolio] = useState(null);
  const [recommendedArtists, setRecommendedArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [portfolioData, artists] = await Promise.all([
          investorService.getPortfolio(currentUser.uid),
          investorService.getRecommendedArtists(currentUser.uid)
        ]);
        
        setPortfolio(portfolioData);
        setRecommendedArtists(artists);
      } catch (err) {
        setError('Failed to fetch dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser.uid]);

  if (loading) return <Loading />;

  return (
    <div className="investor-dashboard">
      <header className="investor-dashboard__header">
        <h1>Welcome back, {currentUser.displayName}</h1>
        <p className="investor-dashboard__subtitle">
          Here's an overview of your investments
        </p>
      </header>

      {error && (
        <div className="investor-dashboard__error">
          {error}
        </div>
      )}

      <div className="investor-dashboard__content">
        <div className="investor-dashboard__main">
          <PortfolioSummary portfolio={portfolio} />
          <InvestmentChart portfolio={portfolio} />
        </div>

        <div className="investor-dashboard__sidebar">
          <RecommendedArtists artists={recommendedArtists} />
        </div>
      </div>

      <div className="investor-dashboard__recent">
        <h2>Recent Transactions</h2>
        {portfolio?.recentTransactions?.length > 0 ? (
          <div className="investor-dashboard__transactions">
            {portfolio.recentTransactions.map(transaction => (
              <div 
                key={transaction.id} 
                className="investor-dashboard__transaction"
              >
                <div className="transaction__info">
                  <h3>{transaction.artistName}</h3>
                  <p>{new Date(transaction.timestamp).toLocaleDateString()}</p>
                </div>
                <div className="transaction__amount">
                  <span className={`amount--${transaction.type}`}>
                    {transaction.type === 'buy' ? '+' : '-'}
                    {transaction.shares} shares
                  </span>
                  <p>${transaction.amount.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="investor-dashboard__empty">
            No recent transactions
          </p>
        )}
      </div>
    </div>
  );
};

export default InvestorDashboard;