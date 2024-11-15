import React from 'react';
import './MetricsCard.css';

const MetricsCard = ({ title, value, change, format = 'number' }) => {
  const formatValue = (val) => {
    if (format === 'currency') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(val);
    }
    return new Intl.NumberFormat('en-US').format(val);
  };

  const changeColor = change >= 0 ? 'positive' : 'negative';
  const changeIcon = change >= 0 ? '↑' : '↓';

  return (
    <div className="metrics-card">
      <h3 className="metrics-card__title">{title}</h3>
      <div className="metrics-card__value">
        {formatValue(value)}
      </div>
      <div className={`metrics-card__change metrics-card__change--${changeColor}`}>
        {changeIcon} {Math.abs(change)}%
      </div>
    </div>
  );
};

export default MetricsCard;