import React, { useEffect, useState } from 'react';
import FilterBar from '../components/FilterBar';
import OfferCard from '../components/OfferCard';
import { fetchOffers } from '../services/offerservice';
import { CATEGORIES } from '../data/mockData';
import { Frown } from 'lucide-react';
import './Offers.css';

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentFilters, setCurrentFilters] = useState({});

  // Fetch offers whenever filters change
  useEffect(() => {
    const loadOffers = async (isBackground = false) => {
      try {
        if (!isBackground) setLoading(true);
        const data = await fetchOffers(currentFilters);
        setOffers(data);
        setError(false);
      } catch (err) {
        console.error("Failed to load offers", err);
        setError(true);
      } finally {
        if (!isBackground) setLoading(false);
      }
    };

    loadOffers();

    // Optional: Keep polling but only if no interactive filters are set 
    // to avoid interrupting user search experience
    const interval = setInterval(() => {
      if (Object.keys(currentFilters).length === 0) {
        loadOffers(true); // Pass true to suppress loading spinner
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [currentFilters]);

  const handleFilterChange = (filters) => {
    setCurrentFilters(filters);
  };

  if (loading && offers.length === 0) {
    return (
      <div className="offers-page">
        <div className="offers-header-hero">
          <div className="container">
            <h1 className="page-title">Explore Jewellery Offers</h1>
          </div>
        </div>
        <div className="container section">
          <FilterBar categories={CATEGORIES} onFilterChange={() => { }} />
          <div className="offers-grid">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="skeleton-card">
                <div className="skeleton-img"></div>
                <div className="skeleton-text sk-w-60"></div>
                <div className="skeleton-text sk-w-40"></div>
                <div className="skeleton-text sk-h-40"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="offers-error container">
        <Frown size={48} />
        <p>We're having trouble reaching our servers. Please try again later.</p>
        <button onClick={() => setCurrentFilters({ ...currentFilters })}>Retry</button>
      </div>
    );
  }

  return (
    <div className="offers-page">
      <div className="offers-header-hero">
        <div className="container">
          <h1 className="page-title">Explore Jewellery Offers</h1>
        </div>
      </div>

      <div className="container section">

        <FilterBar
          categories={CATEGORIES}
          onFilterChange={handleFilterChange}
        />

        {offers.length ? (
          <div className="offers-grid">
            {offers.map(o => (
              <OfferCard key={o.id} offer={o} />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <Frown size={48} />
            <p>No approved offers found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Offers;
