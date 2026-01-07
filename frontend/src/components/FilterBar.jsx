import React, { useState, useEffect } from 'react';
import { State, City } from 'country-state-city';
import { Search, Filter, ArrowUpDown, ChevronDown, ChevronUp } from 'lucide-react';
import SearchableSelect from './SearchableSelect';
import './FilterBar.css';

const FilterBar = ({ categories, onFilterChange }) => {
  const [filters, setFilters] = useState({
    state: '',
    city: '',
    pincode: '',
    category: 'All',
    search: '',
    sort: 'discount_high',
    distance: 50
  });

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // Load all Indian states
  useEffect(() => {
    const indianStates = State.getStatesOfCountry('IN')
      .map(s => ({ label: s.name, value: s.name, isoCode: s.isoCode }));
    setStates(indianStates);
    setCities([]); // Reset cities initially
  }, []);

  // Load cities when state changes
  useEffect(() => {
    if (filters.state) {
      // Find the state object to get isoCode (assuming filters.state stores the name)
      const allStates = State.getStatesOfCountry('IN');
      const selectedState = allStates.find(s => s.name === filters.state);

      if (selectedState) {
        const stateCities = City.getCitiesOfState('IN', selectedState.isoCode)
          .map(c => c.name) // Map to names directly
          .sort((a, b) => a.localeCompare(b));
        setCities(stateCities);
      } else {
        setCities([]);
      }
    } else {
      setCities([]);
    }
  }, [filters.state]);

  // Pincode is now a text input, so no need for availablePincodes logic
  useEffect(() => {
    // Optional: clear pincode if city changes?
    // For now, we leave it as user might want to search pincode without re-selecting
  }, [filters.city]);

  const handleChange = (name, value) => {
    const updated = { ...filters, [name]: value };

    if (name === 'state') {
      updated.city = '';
      updated.pincode = '';
    }
    if (name === 'city') {
      updated.pincode = '';
    }

    setFilters(updated);
    onFilterChange(updated);
  };

  return (
    <div className="filter-bar-container card-base">

      {/* Header */}
      <div className="filter-header">
        <div className="search-wrapper">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search shops, offers..."
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            className="search-input"
          />
        </div>

        <button
          className="filter-toggle btn-outline"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Filter size={18} /> Filters
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {/* Filters */}
      <div className={`filter-advanced ${isExpanded ? 'expanded' : ''}`}>
        <div className="filter-grid">

          {/* Location */}
          <div className="filter-section">
            <h4 className="filter-section-title">Location</h4>

            <div className="grid-3">
              <SearchableSelect
                options={State.getStatesOfCountry('IN').map(s => s.name)}
                value={filters.state}
                onChange={(val) => handleChange('state', val)}
                placeholder="State"
              />

              <SearchableSelect
                options={cities}
                value={filters.city}
                onChange={(val) => handleChange('city', val)}
                placeholder="Select City"
                disabled={!filters.state}
              />

              <input
                type="text"
                placeholder="Enter Pincode"
                value={filters.pincode}
                onChange={(e) => handleChange('pincode', e.target.value.replace(/\D/g, ''))}
                className="filter-input"
                disabled={!filters.city}
              />
            </div>
          </div>

          {/* Preferences */}
          <div className="filter-section">
            <h4 className="filter-section-title">Preferences</h4>

            <div className="grid-2">
              <div className="control-group">
                <label>
                  Distance: <b>{filters.distance} km</b>
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={filters.distance}
                  onChange={(e) => handleChange('distance', Number(e.target.value))}
                />
              </div>

              <div className="control-group">
                <label>Sort By</label>
                <select
                  value={filters.sort}
                  onChange={(e) => handleChange('sort', e.target.value)}
                  className="filter-select"
                >
                  <option value="discount_high">Offer: High to Low</option>
                  <option value="discount_low">Offer: Low to High</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="filter-section">
            <h4 className="filter-section-title">Category</h4>

            <div className="category-pills">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`category-pill ${filters.category === cat ? 'active' : ''}`}
                  onClick={() => handleChange('category', cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FilterBar;
