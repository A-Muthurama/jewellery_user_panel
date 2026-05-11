import React, { useState, useEffect } from 'react';
import { State, City } from 'country-state-city';
import { Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import SearchableSelect from './SearchableSelect';
import './FilterBar.css';

// Top countries for quick access, rest alphabetical
const COUNTRY_LIST = [
  "India", "United States", "United Kingdom", "United Arab Emirates",
  "Australia", "Canada", "Singapore", "Germany", "France", "Japan",
  "Saudi Arabia", "Qatar", "Kuwait", "Bahrain", "Oman",
  "South Africa", "Malaysia", "Sri Lanka", "Bangladesh", "Nepal",
  "Afghanistan", "Albania", "Algeria", "Argentina", "Austria", "Azerbaijan",
  "Belarus", "Belgium", "Bolivia", "Brazil", "Bulgaria",
  "Cambodia", "Chile", "China", "Colombia", "Croatia", "Czech Republic",
  "Denmark", "Egypt", "Estonia", "Ethiopia", "Finland",
  "Ghana", "Greece", "Hungary", "Iceland", "Indonesia", "Iran", "Iraq",
  "Ireland", "Israel", "Italy", "Jamaica", "Jordan", "Kazakhstan", "Kenya",
  "Latvia", "Lebanon", "Libya", "Lithuania", "Luxembourg",
  "Madagascar", "Mexico", "Moldova", "Mongolia", "Morocco", "Myanmar",
  "Namibia", "Netherlands", "New Zealand", "Nigeria", "Norway",
  "Pakistan", "Panama", "Peru", "Philippines", "Poland", "Portugal",
  "Romania", "Russia", "Rwanda", "Senegal", "Serbia", "Slovakia",
  "Slovenia", "Somalia", "South Korea", "Spain", "Sudan", "Sweden",
  "Switzerland", "Syria", "Taiwan", "Tanzania", "Thailand", "Tunisia",
  "Turkey", "Uganda", "Ukraine", "Uruguay", "Uzbekistan",
  "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

const FilterBar = ({ categories, onFilterChange }) => {
  const [filters, setFilters] = useState({
    country: 'India',
    state: '',
    city: '',
    pincode: '',
    category: 'All',
    search: '',
    sort: 'discount_high',
    distance: 50
  });

  const [cities, setCities] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // Load cities when state changes (India only)
  useEffect(() => {
    if (filters.country === 'India' && filters.state) {
      const allStates = State.getStatesOfCountry('IN');
      const selectedState = allStates.find(s => s.name === filters.state);
      if (selectedState) {
        const stateCities = City.getCitiesOfState('IN', selectedState.isoCode)
          .map(c => c.name)
          .sort((a, b) => a.localeCompare(b));
        setCities(stateCities);
      } else {
        setCities([]);
      }
    } else {
      setCities([]);
    }
  }, [filters.state, filters.country]);

  const handleChange = (name, value) => {
    let updated = { ...filters, [name]: value };

    // When country changes, reset location sub-filters
    if (name === 'country') {
      updated = { ...updated, state: '', city: '', pincode: '' };
    }
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

  const isIndia = filters.country === 'India';

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

            {/* Country selector — always visible */}
            <div style={{ marginBottom: '12px' }}>
              <SearchableSelect
                options={COUNTRY_LIST}
                value={filters.country}
                onChange={(val) => handleChange('country', val)}
                placeholder="🌍 Country"
              />
            </div>

            {/* India sub-filters: State → City → Pincode */}
            {isIndia && (
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
                  maxLength={6}
                />
              </div>
            )}

            {/* Non-India: just show a note */}
            {!isIndia && (
              <p style={{
                fontSize: '13px',
                color: '#888',
                margin: '4px 0 0',
                fontStyle: 'italic'
              }}>
                Showing all offers from vendors in <strong>{filters.country}</strong>
              </p>
            )}
          </div>

          {/* Preferences */}
          <div className="filter-section">
            <h4 className="filter-section-title">Preferences</h4>

            <div className="grid-2">
              {isIndia && (
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
              )}

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
