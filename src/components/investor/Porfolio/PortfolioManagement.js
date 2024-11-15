import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { investorService } from '../../../services/investor.service';
import Loading from '../../common/Loading/Loading';
import PortfolioFilters from './PortfolioFilters';
import PortfolioTable from './PortfolioTable';
import './PortfolioManagement.css';

const PortfolioManagement = () => {
  const { currentUser } = useAuth();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    sortBy: 'value',
    sortOrder: 'desc',
    genre: 'all',
    performance: 'all'
  });

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  const fetchPortfolioData = async () => {
    try {
      const data = await investorService.getPortfolio(currentUser.uid);
      setPortfolio(data);
    } catch (err) {
      setError('Failed to fetch portfolio data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  const getFilteredInvestments = () => {
    if (!portfolio) return [];

    let filtered = [...portfolio.investments];

    // Apply genre filter
    if (filters.genre !== 'all') {
      filtered = filtered.filter(inv => inv.artist.genre === filters.genre);
    }

    // Apply performance filter
    if (filters.performance !== 'all') {
      filtered = filtered.filter(inv => {
        const return_pct = ((inv.currentValue - inv.invested) / inv.invested) * 100;
        switch (filters.performance) {
          case 'positive':
            return return_pct > 0;
          case 'negative':
            return return_pct < 0;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (filters.sortBy) {
        case 'value':
          comparison = b.currentValue - a.currentValue;
          break;
        case 'return':
          const returnA = ((a.currentValue - a.invested) / a.invested) * 100;
          const returnB = ((b.currentValue - b.invested) / b.invested) * 100;
          comparison = returnB - returnA;
          break;
        case 'artist':
          comparison = a.artist.artistName.localeCompare(b.artist.artistName);
          break;
        default:
          comparison = 0;
      }
      return filters.sortOrder === 'asc' ? -comparison : comparison;
    });

    return filtered;
  };

  if (loading) return <Loading />;

  return (
    <div className="portfolio-management">
      <header className="portfolio-management__header">
        <h1>Portfolio Management</h1>
        <p className="portfolio-management__subtitle">
          Manage and track your investments
        </p>
      </header>

      {error && (
        <div className="portfolio-management__error">
          {error}
        </div>
      )}

      <PortfolioFilters 
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      <PortfolioTable 
        investments={getFilteredInvestments()}
        onRefresh={fetchPortfolioData}
      />
    </div>
  );
};

export default PortfolioManagement;