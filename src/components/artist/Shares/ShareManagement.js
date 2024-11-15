import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import Button from '../../common/Button/Button';
import Modal from '../../common/Modal/Modal';
import { artistService } from '../../../services/artist.service';
import './ShareManagement.css';

const ShareManagement = () => {
  const { currentUser } = useAuth();
  const [shareData, setShareData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [newOffering, setNewOffering] = useState({
    totalShares: '',
    pricePerShare: '',
    minimumInvestment: '',
    description: ''
  });

  useEffect(() => {
    fetchShareData();
  }, []);

  const fetchShareData = async () => {
    try {
      const data = await artistService.getShareOffering(currentUser.uid);
      setShareData(data);
    } catch (err) {
      setError('Failed to fetch share data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOffering(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateOffering = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await artistService.createShareOffering(currentUser.uid, newOffering);
      await fetchShareData();
      setIsModalOpen(false);
    } catch (err) {
      setError('Failed to create share offering');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="share-management">
      <div className="share-management__header">
        <h1>Share Management</h1>
        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          disabled={shareData?.status === 'active'}
        >
          Create New Offering
        </Button>
      </div>

      {error && (
        <div className="share-management__error">
          {error}
        </div>
      )}

      {shareData ? (
        <div className="share-management__content">
          <div className="share-management__overview">
            <div className="share-management__stat">
              <h3>Total Shares</h3>
              <p>{shareData.totalShares}</p>
            </div>
            <div className="share-management__stat">
              <h3>Price per Share</h3>
              <p>${shareData.pricePerShare}</p>
            </div>
            <div className="share-management__stat">
              <h3>Shares Sold</h3>
              <p>{shareData.sharesSold || 0}</p>
            </div>
            <div className="share-management__stat">
              <h3>Total Raised</h3>
              <p>${(shareData.sharesSold * shareData.pricePerShare).toFixed(2)}</p>
            </div>
          </div>

          <div className="share-management__investors">
            <h2>Current Investors</h2>
            {/* Add investor list component */}
          </div>
        </div>
      ) : (
        <div className="share-management__empty">
          <p>No active share offering. Create one to start raising funds.</p>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Share Offering"
      >
        <form onSubmit={handleCreateOffering} className="share-management__form">
          <div className="form-group">
            <label>Total Shares</label>
            <input
              type="number"
              name="totalShares"
              value={newOffering.totalShares}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Price per Share ($)</label>
            <input
              type="number"
              step="0.01"
              name="pricePerShare"
              value={newOffering.pricePerShare}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Minimum Investment ($)</label>
            <input
              type="number"
              step="0.01"
              name="minimumInvestment"
              value={newOffering.minimumInvestment}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={newOffering.description}
              onChange={handleInputChange}
              rows={4}
              required
            />
          </div>

          <div className="share-management__form-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={loading}
            >
              Create Offering
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ShareManagement;