import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Frown } from 'lucide-react';
import OfferCard from '../components/OfferCard';
import { fetchOffers } from '../services/offerservice';
import './Home.css';

const Home = () => {
  const [featuredOffers, setFeaturedOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        setLoading(true);
        const data = await fetchOffers({ sort: 'newest' });
        // Filter for featured offers locally or just take first top ones
        // Since database might not have isFeatured set, we take the newest 3 as "featured"
        // or filter if the data has the property
        const featured = data.filter(o => o.isFeatured).slice(0, 6);

        // Fallback: if no isFeatured set in DB, just show latest 3
        if (featured.length === 0) {
          setFeaturedOffers(data.slice(0, 3));
        } else {
          setFeaturedOffers(featured);
        }
      } catch (err) {
        console.error("Failed to load featured offers", err);
      } finally {
        setLoading(false);
      }
    };
    loadFeatured();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section Merged Here - hero section*/}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <h1 className="hero-title">Discover Exclusive Jewellery Offers</h1>
          <p className="hero-subtitle">
            Find the best deals on Gold, Diamond, and Silver from verified shops near you.
          </p>
          <div className="hero-actions">
            <Link to="/offers" className="btn-primary">Explore Offers</Link>
            <button className="btn-outline">Learn More</button>
          </div>


        </div>
      </section>

      <main className="container section">

        <div className="section-header">
          <h2 className="section-title">Featured Offers</h2>
          <Link to="/offers" className="view-all-link">
            View All <ArrowRight size={18} />
          </Link>
        </div>

        <div className="offers-grid">
          {loading ? (
            <p>Loading featured offers...</p>
          ) : featuredOffers.length > 0 ? (
            featuredOffers.map(offer => (
              <OfferCard key={offer.id} offer={offer} />
            ))
          ) : (
            <div className="no-results" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2rem' }}>
              <Frown size={48} />
              <p>No featured offers available right now.</p>
            </div>
          )}
        </div>
      </main>

      <section className="container section value-props">
        <h2 className="section-title">Why JEWELLERS PARADISE?</h2>
        <div className="props-grid">
          <div className="prop-item card-base">
            <h3 className="prop-title">Verified Stores</h3>
            <p>Shop with confidence from authenticated jewellery stores.</p>
          </div>
          <div className="prop-item card-base">
            <h3 className="prop-title">Exclusive Discounts</h3>
            <p>Access deals on making charges, gold rates, and diamond value.</p>
          </div>
          <div className="prop-item card-base">
            <h3 className="prop-title">Real-time Location</h3>
            <p>Find the nearest offers and navigate easily.</p>
          </div>
          <div className="prop-item card-base">
            <h3 className="prop-title">Pan India Collection</h3>
            <p>Platform to see wide variety of designs across India.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
