import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { artistService } from '../../../services/artist.service';
import Loading from '../../common/Loading/Loading';
import MetricsCard from './MetricsCard';
import RevenueChart from './RevenueChart';
import SharesOverview from './SharesOverview';
import './ArtistDashboard.css';

const ArtistDashboard = () => {
  const { currentUser } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [metricsData, revenue] = await Promise.all([
          artistService.getArtistMetrics(currentUser.uid),
          artistService.getRevenueHistory(currentUser.uid)
        ]);
        
        setMetrics(metricsData);
        setRevenueData(revenue);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser.uid]);

  if (loading) return <Loading />;

  return (
    <div className="artist-dashboard">
      <header className="artist-dashboard__header">
        <h1>Welcome back, {currentUser.artistName}</h1>
        <p className="artist-dashboard__subtitle">
          Here's an overview of your performance
        </p>
      </header>

      <div className="artist-dashboard__metrics">
        <MetricsCard
          title="Total Investment"
          value={metrics?.totalInvestment || 0}
          change={metrics?.investmentChange || 0}
          format="currency"
        />
        <MetricsCard
          title="Active Investors"
          value={metrics?.activeInvestors || 0}
          change={metrics?.investorChange || 0}
        />
        <MetricsCard
          title="Share Price"
          value={metrics?.currentSharePrice || 0}
          change={metrics?.priceChange || 0}
          format="currency"
        />
        <MetricsCard
          title="Monthly Revenue"
          value={metrics?.monthlyRevenue || 0}
          change={metrics?.revenueChange || 0}
          format="currency"
        />
      </div>

      <div className="artist-dashboard__charts">
        <div className="artist-dashboard__chart-container">
          <h2>Revenue Overview</h2>
          <RevenueChart data={revenueData} />
        </div>
        
        <div className="artist-dashboard__chart-container">
          <h2>Shares Overview</h2>
          <SharesOverview artistId={currentUser.uid} />
        </div>
      </div>

      <div className="artist-dashboard__recent-activity">
        <h2>Recent Activity</h2>
        {/* Add recent activity component */}
      </div>
    </div>
  );
};

export default ArtistDashboard;