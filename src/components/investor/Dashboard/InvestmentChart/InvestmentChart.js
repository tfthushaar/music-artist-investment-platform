import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { formatCurrency } from '../../../../utils/formatters';
import './InvestmentChart.css';

const InvestmentChart = ({ portfolio }) => {
  const [timeframe, setTimeframe] = useState('1M'); // 1M, 3M, 6M, 1Y, ALL
  
  const timeframes = [
    { value: '1M', label: '1 Month' },
    { value: '3M', label: '3 Months' },
    { value: '6M', label: '6 Months' },
    { value: '1Y', label: '1 Year' },
    { value: 'ALL', label: 'All Time' }
  ];

  const getTimeframeData = () => {
    // This would normally filter based on the selected timeframe
    return portfolio.performanceHistory;
  };

  const data = getTimeframeData();

  return (
    <div className="investment-chart">
      <div className="investment-chart__header">
        <h2>Portfolio Performance</h2>
        <div className="investment-chart__timeframes">
          {timeframes.map(tf => (
            <button
              key={tf.value}
              className={`timeframe-button ${timeframe === tf.value ? 'active' : ''}`}
              onClick={() => setTimeframe(tf.value)}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      <div className="investment-chart__container">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(date) => new Date(date).toLocaleDateString()}
            />
            <YAxis 
              tickFormatter={formatCurrency}
              domain={['dataMin', 'dataMax']}
            />
            <Tooltip 
              formatter={(value) => [formatCurrency(value), "Portfolio Value"]}
              labelFormatter={(date) => new Date(date).toLocaleDateString()}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#2563eb" 
              strokeWidth={2}
              dot={false}
              name="Portfolio Value"
            />
            <Line 
              type="monotone" 
              dataKey="invested" 
              stroke="#9ca3af" 
              strokeWidth={2}
              dot={false}
              name="Total Invested"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default InvestmentChart;