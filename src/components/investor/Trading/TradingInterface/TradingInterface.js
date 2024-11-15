import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { artistService } from '../../../services/artist.service';
import { tradingService } from '../../../services/trading.service';
import { formatCurrency } from '../../../utils/formatters';
import Button from '../../common/Button/Button';
import Loading from '../../common/Loading/Loading';
import OrderBook from './OrderBook';
import TradeHistory from './TradeHistory';
import './TradingInterface.css';

const TradingInterface = () => {
  const { artistId } = useParams();
  const { currentUser } = useAuth();
  const [artist, setArtist] = useState(null);
  const [orderBook, setOrderBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [tradeForm, setTradeForm] = useState({
    type: 'buy',
    shares: '',
    price: '',
  });

  useEffect(() => {
    fetchArtistData();
    const interval = setInterval(fetchOrderBook, 5000); // Refresh every 5 seconds
    
    return () => clearInterval(interval);
  }, [artistId]);

  const fetchArtistData = async () => {
    try {
      const [artistData, orderBookData] = await Promise.all([
        artistService.getArtistById(artistId),
        tradingService.getOrderBook(artistId)
      ]);
      
      setArtist(artistData);
      setOrderBook(orderBookData);
      setTradeForm(prev => ({
        ...prev,
        price: artistData.currentSharePrice
      }));
    } catch (err) {
      setError('Failed to fetch trading data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderBook = async () => {
    try {
      const data = await tradingService.getOrderBook(artistId);
      setOrderBook(data);
    } catch (err) {
      console.error('Failed to update order book:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTradeForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotal = () => {
    const shares = parseFloat(tradeForm.shares) || 0;
    const price = parseFloat(tradeForm.price) || 0;
    return shares * price;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const order = {
        artistId,
        type: tradeForm.type,
        shares: parseFloat(tradeForm.shares),
        price: parseFloat(tradeForm.price),
        investorId: currentUser.uid
      };

      await tradingService.createOrder(order);
      await fetchOrderBook();
      
      setTradeForm(prev => ({
        ...prev,
        shares: ''
      }));
    } catch (err) {
      setError('Failed to place order');
      console.error(err);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="trading-interface">
      <div className="trading-interface__header">
        <div className="artist-info">
          <img 
            src={artist.photoURL || '/default-artist.png'} 
            alt={artist.artistName} 
          />
          <div>
            <h1>{artist.artistName}</h1>
            <p className="artist-genre">{artist.genre}</p>
          </div>
        </div>
        <div className="price-info">
          <div className="current-price">
            <span>Current Price</span>
            <h2>{formatCurrency(artist.currentSharePrice)}</h2>
          </div>
          <div className="price-change">
            <span>24h Change</span>
            <h3 className={artist.priceChange >= 0 ? 'positive' : 'negative'}>
              {artist.priceChange >= 0 ? '+' : ''}{artist.priceChange}%
            </h3>
          </div>
        </div>
      </div>

      <div className="trading-interface__content">
        <div className="trading-interface__main">
          <OrderBook data={orderBook} />
          <TradeHistory artistId={artistId} />
        </div>

        <div className="trading-interface__sidebar">
          <div className="trade-form">
            <div className="trade-form__header">
              <button
                className={`trade-type ${tradeForm.type === 'buy' ? 'active' : ''}`}
                onClick={() => setTradeForm(prev => ({ ...prev, type: 'buy' }))}
              >
                Buy
              </button>
              <button
                className={`trade-type ${tradeForm.type === 'sell' ? 'active' : ''}`}
                onClick={() => setTradeForm(prev => ({ ...prev, type: 'sell' }))}
              >
                Sell
              </button>
            </div>

            {error && (
              <div className="trade-form__error">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Shares</label>
                <input
                  type="number"
                  name="shares"
                  value={tradeForm.shares}
                  onChange={handleInputChange}
                  min="1"
                  step="1"
                  required
                />
              </div>

              <div className="form-group">
                <label>Price per Share</label>
                <input
                  type="number"
                  name="price"
                  value={tradeForm.price}
                  onChange={handleInputChange}
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>

              <div className="trade-summary">
                <div className="trade-summary__row">
                  <span>Total</span>
                  <span>{formatCurrency(calculateTotal())}</span>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
              >
                Place {tradeForm.type === 'buy' ? 'Buy' : 'Sell'} Order
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingInterface;