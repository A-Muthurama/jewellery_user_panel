import React, { useEffect, useState } from 'react';
import FilterBar from '../components/FilterBar';
import OfferCard from '../components/OfferCard';
import { fetchOffers } from '../services/offerservice';
import { CATEGORIES } from '../data/mockData';
import { Frown } from 'lucide-react';
import './Offers.css';

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadOffers = async () => {
      try {
        const data = await fetchOffers();
        setOffers(data);
        setFilteredOffers(data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadOffers();
  }, []);

  const handleFilterChange = (filters) => {
    let result = [...offers];

    if (filters.search) {
      const s = filters.search.toLowerCase();
      result = result.filter(o =>
        o.shopName.toLowerCase().includes(s) ||
        o.description.toLowerCase().includes(s)
      );
    }

    if (filters.category && filters.category !== 'All') {
      result = result.filter(o => o.category === filters.category);
    }

    // New Location Logic:
    // filters.state contains the state name
    // filters.city contains the city name
    // filters.pincode contains the typed/selected pincode

    if (filters.state) {
      result = result.filter(o => o.location.state === filters.state);
    }
    if (filters.city) {
      result = result.filter(o => o.location.city === filters.city);
    }
    if (filters.pincode) {
      // Basic string match for pincode
      result = result.filter(o => o.location.pincode.startsWith(filters.pincode));
    }

    if (filters.sort === 'discount_high') {
      result.sort((a, b) => b.discountValueNumeric - a.discountValueNumeric);
    } else if (filters.sort === 'discount_low') {
      result.sort((a, b) => a.discountValueNumeric - b.discountValueNumeric);
    } else {
      result.sort((a, b) => b.id - a.id);
    }

    setFilteredOffers(result);
  };

  if (loading) return <p className="text-center">Loading offers...</p>;
  if (error) return <p className="text-center">Error fetching offers</p>;

  return (
    <div className="offers-page container section">
      <h1 className="page-title">Explore Jewellery Offers</h1>

      <FilterBar
        categories={CATEGORIES}
        onFilterChange={handleFilterChange}
      />

      {filteredOffers.length ? (
        <div className="offers-grid">
          {filteredOffers.map(o => (
            <OfferCard key={o.id} offer={o} />
          ))}
        </div>
      ) : (
        <div className="no-results">
          <Frown size={48} />
          <p>No offers found</p>
        </div>
      )}
    </div>
  );
};

export default Offers;
