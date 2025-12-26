import React, { useState, useEffect } from 'react';
import { Search, Filter, ArrowUpDown, ChevronDown, ChevronUp } from 'lucide-react';
import SearchableSelect from './SearchableSelect';
import './FilterBar.css';

const FilterBar = ({ categories, locations, onFilterChange }) => {
  const [filters, setFilters] = useState({
    state: '',
    city: '',
    pincode: '',
    category: 'All',
    search: '',
    sort: 'discount_high',
    distance: 50
  });

  const [availableCities, setAvailableCities] = useState([]);
  const [availablePincodes, setAvailablePincodes] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // Update available cities when state changes
  useEffect(() => {
    if (filters.state && locations[filters.state]) {
      setAvailableCities(Object.keys(locations[filters.state]));
      if (filters.city && !locations[filters.state][filters.city]) {
        handleChange('city', '');
        handleChange('pincode', '');
      }
    } else {
      setAvailableCities([]);
    }
  }, [filters.state, locations]);

  // Update available pincodes when city changes
  useEffect(() => {
    if (filters.state && filters.city && locations[filters.state] && locations[filters.state][filters.city]) {
      setAvailablePincodes(locations[filters.state][filters.city]);
      if (filters.pincode && !locations[filters.state][filters.city].includes(filters.pincode)) {
        handleChange('pincode', '');
      }
    } else {
      setAvailablePincodes([]);
    }
  }, [filters.city, filters.state, locations]);

  const handleChange = (name, value) => {
    const newFilters = { ...filters, [name]: value };

    if (name === 'state') {
      newFilters.city = '';
      newFilters.pincode = '';
    } else if (name === 'city') {
      newFilters.pincode = '';
    }

    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="filter-bar-container card-base">
      <div className="filter-header">
        <div className="search-wrapper">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search shops, discounts..."
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

      <div className={`filter-advanced ${isExpanded ? 'expanded' : ''}`}>
        <div className="filter-grid">
          {/* Section 1: Locations */}
          <div className="filter-section">
            <h4 className="filter-section-title">Location</h4>
            <div className="grid-3">
              <SearchableSelect
                options={Object.keys(locations)}
                value={filters.state}
                onChange={(val) => handleChange('state', val)}
                placeholder="State"
              />
              <SearchableSelect
                options={availableCities}
                value={filters.city}
                onChange={(val) => handleChange('city', val)}
                placeholder="City"
                disabled={!filters.state}
              />
              <SearchableSelect
                options={availablePincodes}
                value={filters.pincode}
                onChange={(val) => handleChange('pincode', val)}
                placeholder="Pincode"
                disabled={!filters.city}
              />
            </div>
          </div>

          {/* Section 2: Sort & Distance */}
          <div className="filter-section">
            <h4 className="filter-section-title">Preferences</h4>
            <div className="grid-2">
              <div className="control-group">
                <label className="sub-label">
                  Distance: <span className="highlight-text">{filters.distance} km</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={filters.distance}
                  onChange={(e) => handleChange('distance', parseInt(e.target.value))}
                  className="range-input"
                />
              </div>

              <div className="control-group">
                <label className="sub-label">Sort By</label>
                <div className="icon-select-wrapper">
                  <ArrowUpDown size={16} className="select-icon" />
                  <select
                    value={filters.sort}
                    onChange={(e) => handleChange('sort', e.target.value)}
                    className="filter-select with-icon"
                  >
                    <option value="discount_high">Offer: High to Low</option>
                    <option value="discount_low">Offer: Low to High</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Categories */}
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
