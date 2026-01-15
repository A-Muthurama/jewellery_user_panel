import React from 'react';
import OfferCard from '../components/OfferCard';

import { OFFERS } from '../data/mockData';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './Home.css';

const Home = () => {
  const featuredOffers = OFFERS.filter(offer => offer.isFeatured).slice(0, 6);

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
          {featuredOffers.map(offer => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      </main>

      <section className="container section value-props">
        <h2 className="section-title">Why Project J?</h2>
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
