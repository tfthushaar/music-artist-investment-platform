import React, { useState } from 'react';
import { formatCurrency } from '../../../../utils/formatters';
import './OrderBook.css';

const OrderBook = ({ data }) => {
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'bids', 'asks'

  const getFilteredOrders = () => {
    if (!data) return { bids: [], asks: [] };
    
    switch (activeTab) {
      case 'bids':
        return { bids: data.bids, asks: [] };
      case 'asks':
        return { bids: [], asks: data.asks };
      default:
        return data;
    }
  };

  const { bids, asks } = getFilteredOrders();

  const renderOrderRow = (order, type) => (
    <div 
      key={order.id} 
      className={`order-book__row order-book__row--${type}`}
    >
      <div className="order-book__cell">
        {formatCurrency(order.price)}
      </div>
      <div className="order-book__cell">
        {order.shares}
      </div>
      <div className="order-book__cell">
        {formatCurrency(order.price * order.shares)}
      </div>
      <div 
        className="order-book__depth-bar"
        style={{
          width: `${(order.shares / data.maxShares) * 100}%`,
          background: type === 'bid' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'
        }}
      />
    </div>
  );

  return (
    <div className="order-book">
      <div className="order-book__header">
        <h2>Order Book</h2>
        <div className="order-book__tabs">
          <button
            className={`tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Orders
          </button>
          <button
            className={`tab ${activeTab === 'bids' ? 'active' : ''}`}
            onClick={() => setActiveTab('bids')}
          >
            Bids
          </button>
          <button
            className={`tab ${activeTab === 'asks' ? 'active' : ''}`}
            onClick={() => setActiveTab('asks')}
          >
            Asks
          </button>
        </div>
      </div>

      <div className="order-book__content">
        <div className="order-book__labels">
          <span>Price</span>
          <span>Amount</span>
          <span>Total</span>
        </div>

        <div className="order-book__asks">
          {asks.map(ask => renderOrderRow(ask, 'ask'))}
        </div>

        <div className="order-book__spread">
          <span>Spread: {formatCurrency(data?.spread || 0)}</span>
          <span>{data?.spreadPercentage?.toFixed(2)}%</span>
        </div>

        <div className="order-book__bids">
          {bids.map(bid => renderOrderRow(bid, 'bid'))}
        </div>
      </div>

      <div className="order-book__footer">
        <div className="order-book__stats">
          <div className="stat">
            <span>24h Volume</span>
            <span>{formatCurrency(data?.volume24h || 0)}</span>
          </div>
          <div className="stat">
            <span>24h Trades</span>
            <span>{data?.trades24h || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderBook;