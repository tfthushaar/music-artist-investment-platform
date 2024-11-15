import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../../../../utils/formatters';
import { tradingService } from '../../../../services/trading.service';
import Loading from '../../../common/Loading/Loading';
import './TradeHistory.css';

const TradeHistory = ({ artistId }) => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'buys', 'sells'

  useEffect(() => {
    fetchTradeHistory();
    const interval = setInterval(fetchTradeHistory, 10000); // Refresh every 10 seconds
    
    return () => clearInterval(interval);
  }, [artistId]);

  const fetchTradeHistory = async () => {
    try {
      const history = await tradingService.getTradeHistory(artistId);
      setTrades(history);
    } catch (err) {
      setError('Failed to fetch trade history');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredTrades = () => {
    switch (filter) {
      case 'buys':
        return trades.filter(trade => trade.type === 'buy');
      case 'sells':
        return trades.filter(trade => trade.type === 'sell');
      default:
        return trades;
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (loading) return <Loading />;

  return (
    <div className="trade-history">
      <div className="trade-history__header">
        <h2>Trade History</h2>
        <div className="trade-history__filters">
          <button
            className={`filter ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`filter ${filter === 'buys' ? 'active' : ''}`}
            onClick={() => setFilter('buys')}
          >
            Buys
          </button>
          <button
            className={`filter ${filter === 'sells' ? 'active' : ''}`}
            onClick={() => setFilter('sells')}
          >
            Sells
          </button>
        </div>
      </div>

      {error && (
        <div className="trade-history__error">
          {error}
        </div>
      )}

      <div className="trade-history__content">
        <div className="trade-history__labels">
          <span>Time</span>
          <span>Price</span>
          <span>Amount</span>
          <span>Total</span>
        </div>

        <div className="trade-history__trades">
          {getFilteredTrades().map(trade => (
            <div 
              key={trade.id} 
              className={`trade-history__row trade-history__row--${trade.type}`}
            >
              <div className="trade-history__cell">
                {formatTime(trade.timestamp)}
              </div>
              <div className="trade-history__cell">
                {formatCurrency(trade.price)}
              </div>
              <div className="trade-history__cell">
                {trade.shares}
              </div>
              <div className="trade-history__cell">
                {formatCurrency(trade.price * trade.shares)}
              </div>
            </div>
          ))}

          {getFilteredTrades().length === 0 && (
            <div className="trade-history__empty">
              No trades found
            </div>
          )}
        </div>
      </div>

      <div className="trade-history__footer">
        <button 
          className="trade-history__refresh"
          onClick={fetchTradeHistory}
        >
          Refresh
        </button>
      </div>
    </div>
  );
};

export default TradeHistory;