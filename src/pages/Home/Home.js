import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import Button from '../../components/common/Button/Button';
import Loading from '../../components/common/Loading/Loading';
import './Home.css';

const Home = () => {
  const [trendingArtists, setTrendingArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingArtists = async () => {
      try {
        const q = query(
          collection(db, 'users'),
          where('role', '==', 'artist'),
          limit(6)
        );
        
        const snapshot = await getDocs(q);
        const artists = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setTrendingArtists(artists);
      } catch (error) {
        console.error('Error fetching trending artists:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingArtists();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="home__hero">
        <div className="home__hero-content">
          <h1 className="home__title">
            Invest in the Future of Music
          </h1>
          <p className="home__subtitle">
            Connect with artists, invest in their success, and share in their journey.
          </p>
          <div className="home__cta-buttons">
            <Button 
              variant="primary" 
              size="large"
              onClick={() => {}}
            >
              Start Investing
            </Button>
            <Button 
              variant="secondary" 
              size="large"
              onClick={() => {}}
            >
              For Artists
            </Button>
          </div>
        </div>
      </section>

      {/* Trending Artists Section */}
      <section className="home__trending">
        <h2 className="home__section-title">Trending Artists</h2>
        <div className="home__artist-grid">
          {trendingArtists.map(artist => (
            <div key={artist.id} className="home__artist-card">
              <img 
                src={artist.photoURL || '/default-artist.png'} 
                alt={artist.artistName}
                className="home__artist-image"
              />
              <h3 className="home__artist-name">{artist.artistName}</h3>
              <p className="home__artist-genre">{artist.genre}</p>
              <Link 
                to={`/artist/${artist.id}`}
                className="home__artist-link"
              >
                View Profile
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="home__how-it-works">
        <h2 className="home__section-title">How It Works</h2>
        <div className="home__steps">
          <div className="home__step">
            <div className="home__step-icon">1</div>
            <h3>Discover Artists</h3>
            <p>Browse through our curated list of talented artists</p>
          </div>
          <div className="home__step">
            <div className="home__step-icon">2</div>
            <h3>Invest</h3>
            <p>Purchase shares in your favorite artists</p>
          </div>
          <div className="home__step">
            <div className="home__step-icon">3</div>
            <h3>Earn & Support</h3>
            <p>Share in their success and help them grow</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;