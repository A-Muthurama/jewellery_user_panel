import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  Globe,
  MapPin,
  Sparkles,
  ShieldCheck,
  Filter,
  X,
  RotateCcw,
  SlidersHorizontal,
  Building2,
  Tag,
  ArrowRight,
  Store as StoreIcon
} from "lucide-react";
import StoreCard from "../components/StoreCard";
import { fetchStores, fetchStoreFilters } from "../services/stores.service";
import "./Stores.css";

const PRESET_CATEGORIES = [
  "All",
  "Gold",
  "Diamond",
  "Bridal",
  "Polki",
  "Kundan",
  "Temple Jewellery",
  "Antique",
  "Platinum",
  "Daily Wear"
];

const Stores = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCountry, setSelectedCountry] = useState(searchParams.get("country") || "ALL");
  const [selectedState, setSelectedState] = useState(searchParams.get("state") || "ALL");
  const [selectedCity, setSelectedCity] = useState(searchParams.get("city") || "ALL");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "All"
  );
  const [isVerifiedOnly, setIsVerifiedOnly] = useState(
    searchParams.get("verified") === "true"
  );

  // Data state
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Available filter options from backend (dynamically populated from admin store listings in DB)
  const [availableFilters, setAvailableFilters] = useState({
    countries: [],
    countryStateMap: {},
    states: [],
    cities: [],
    stateCityMap: {},
    categories: []
  });

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Load filter options on mount
  useEffect(() => {
    const loadFilterMeta = async () => {
      const meta = await fetchStoreFilters();
      if (meta && meta.success) {
        setAvailableFilters({
          countries: meta.countries || [],
          countryStateMap: meta.countryStateMap || {},
          states: meta.states || [],
          cities: meta.cities || [],
          stateCityMap: meta.stateCityMap || {},
          categories: meta.categories || []
        });
      }
    };
    loadFilterMeta();
  }, []);

  // Filter available states based on selected country (dynamically cascading from DB)
  const availableStatesForSelectedCountry = useMemo(() => {
    if (selectedCountry && selectedCountry !== "ALL" && availableFilters.countryStateMap) {
      const statesInCountry = availableFilters.countryStateMap[selectedCountry];
      if (statesInCountry && statesInCountry.length > 0) {
        return statesInCountry;
      }
    }
    return availableFilters.states || [];
  }, [selectedCountry, availableFilters]);

  // Filter available cities based on selected state and country
  const availableCitiesForSelectedState = useMemo(() => {
    if (selectedState && selectedState !== "ALL" && availableFilters.stateCityMap) {
      const citiesInState = availableFilters.stateCityMap[selectedState];
      if (citiesInState && citiesInState.length > 0) {
        return citiesInState;
      }
    }
    if (selectedCountry && selectedCountry !== "ALL" && availableFilters.countryStateMap && availableFilters.stateCityMap) {
      const statesInCountry = availableFilters.countryStateMap[selectedCountry] || [];
      const citiesInCountry = [];
      statesInCountry.forEach((st) => {
        (availableFilters.stateCityMap[st] || []).forEach((c) => {
          if (!citiesInCountry.includes(c)) citiesInCountry.push(c);
        });
      });
      if (citiesInCountry.length > 0) return citiesInCountry;
    }
    return availableFilters.cities || [];
  }, [selectedCountry, selectedState, availableFilters]);

  // Handle country change: update country and auto-reset state/city if they don't belong to the new country
  const handleCountryChange = (newCountry) => {
    setSelectedCountry(newCountry);
    if (newCountry !== "ALL" && selectedState !== "ALL" && availableFilters.countryStateMap) {
      const statesInCountry = availableFilters.countryStateMap[newCountry] || [];
      if (!statesInCountry.includes(selectedState)) {
        setSelectedState("ALL");
        setSelectedCity("ALL");
      }
    }
  };

  // Handle state change: update state and auto-reset city if it doesn't belong to the new state
  const handleStateChange = (newState) => {
    setSelectedState(newState);
    if (newState !== "ALL" && selectedCity !== "ALL" && availableFilters.stateCityMap) {
      const citiesInState = availableFilters.stateCityMap[newState] || [];
      if (!citiesInState.includes(selectedCity)) {
        setSelectedCity("ALL");
      }
    }
  };

  // Fetch stores whenever filters change
  useEffect(() => {
    let isMounted = true;
    const loadStores = async () => {
      setIsLoading(true);
      try {
        const res = await fetchStores({
          search: searchQuery,
          country: selectedCountry,
          state: selectedState,
          city: selectedCity,
          category: selectedCategory === "All" ? "" : selectedCategory,
          isVerified: isVerifiedOnly,
          limit: 50
        });

        if (isMounted) {
          if (res && res.success) {
            setStores(res.data || []);
            setTotalCount(res.total || 0);
          } else {
            setStores([]);
            setTotalCount(0);
          }
        }
      } catch (err) {
        console.error("Failed to load stores:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    // Debounce search typing
    const timeoutId = setTimeout(loadStores, 250);
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [searchQuery, selectedCountry, selectedState, selectedCity, selectedCategory, isVerifiedOnly]);

  // Sync to URL parameters for bookmarkable search
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedCountry && selectedCountry !== "ALL") params.set("country", selectedCountry);
    if (selectedState && selectedState !== "ALL") params.set("state", selectedState);
    if (selectedCity && selectedCity !== "ALL") params.set("city", selectedCity);
    if (selectedCategory && selectedCategory !== "All") params.set("category", selectedCategory);
    if (isVerifiedOnly) params.set("verified", "true");
    setSearchParams(params, { replace: true });
  }, [searchQuery, selectedCountry, selectedState, selectedCity, selectedCategory, isVerifiedOnly, setSearchParams]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCountry("ALL");
    setSelectedState("ALL");
    setSelectedCity("ALL");
    setSelectedCategory("All");
    setIsVerifiedOnly(false);
  };

  const hasActiveFilters =
    searchQuery ||
    selectedCountry !== "ALL" ||
    selectedState !== "ALL" ||
    selectedCity !== "ALL" ||
    selectedCategory !== "All" ||
    isVerifiedOnly;

  return (
    <div className="stores-page">
      {/* Hero Banner Section */}
      <section className="stores-hero">
        <div className="container stores-hero-container">
          <div className="stores-hero-content">
            <span className="stores-hero-badge">
              <Sparkles size={17} className="badge-sparkle-icon" />
              <span className="badge-text-content">
                <strong className="badge-brand-highlight">Jewellersparadise</strong>{" "}
                <strong className="badge-verified-highlight">verified Showrooms directory</strong>
              </span>
            </span>
            <h1 className="stores-hero-title">
              Discover Trusted Jewellery Stores & Showrooms
            </h1>
            <p className="stores-hero-subtitle">
              Browse top-rated jewellery houses across India. Discover exclusive collections,
              hallmark gold, certified diamonds, active offers, and direct contact details.
            </p>

            {/* Quick Search Bar */}
            <div className="stores-search-bar-wrapper">
              <div className="stores-search-input-group">
                <Search size={20} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search by store name, locality, city, or jewellery type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="stores-search-input"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="clear-search-btn"
                    title="Clear search"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="container stores-main-container">
        {/* Category Filter Chips Bar */}
        <div className="category-chips-scroll">
          {PRESET_CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`category-chip-btn ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === "All" && <Sparkles size={13} />}
              {cat}
            </button>
          ))}
        </div>

        {/* Filter Toolbar */}
        <div className="stores-filter-toolbar">
          <div className="filter-controls-group">
            {/* 1. Country Dropdown (Dynamically loaded from DB) */}
            <div className="filter-select-wrapper">
              <Globe size={15} className="select-icon" />
              <select
                value={selectedCountry}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="filter-select"
                aria-label="Filter by country"
              >
                <option value="ALL">All Countries</option>
                {availableFilters.countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. State Dropdown (Follows Country) */}
            <div className="filter-select-wrapper">
              <Building2 size={15} className="select-icon" />
              <select
                value={selectedState}
                onChange={(e) => handleStateChange(e.target.value)}
                className="filter-select"
                aria-label="Filter by state"
              >
                <option value="ALL">
                  {selectedCountry !== "ALL" ? `All States in ${selectedCountry}` : "All States"}
                </option>
                {availableStatesForSelectedCountry.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. City Dropdown (Follows State) */}
            <div className="filter-select-wrapper">
              <MapPin size={15} className="select-icon" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="filter-select"
                aria-label="Filter by city"
              >
                <option value="ALL">
                  {selectedState !== "ALL" ? `All Cities in ${selectedState}` : "All Cities"}
                </option>
                {availableCitiesForSelectedState.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Verified Jeweller Toggle */}
            <button
              type="button"
              className={`verified-toggle-btn ${isVerifiedOnly ? "active" : ""}`}
              onClick={() => setIsVerifiedOnly(!isVerifiedOnly)}
            >
              <ShieldCheck size={16} />
              <span>Verified Jewellers</span>
            </button>

            {/* Reset Button */}
            {hasActiveFilters && (
              <button
                type="button"
                className="reset-filters-btn"
                onClick={handleResetFilters}
                title="Reset all filters"
              >
                <RotateCcw size={14} />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Results Summary */}
          <div className="stores-results-summary">
            <span>
              Showing <strong>{totalCount}</strong> jewellery{" "}
              {totalCount === 1 ? "store" : "stores"}
            </span>
          </div>
        </div>

        {/* Active Filter Tags */}
        {hasActiveFilters && (
          <div className="active-filters-row">
            <span className="active-filters-label">Active filters:</span>
            {searchQuery && (
              <span className="active-tag">
                Query: "{searchQuery}"
                <button onClick={() => setSearchQuery("")}>
                  <X size={12} />
                </button>
              </span>
            )}
            {selectedCategory !== "All" && (
              <span className="active-tag">
                Category: {selectedCategory}
                <button onClick={() => setSelectedCategory("All")}>
                  <X size={12} />
                </button>
              </span>
            )}
            {selectedCountry !== "ALL" && (
              <span className="active-tag">
                Country: {selectedCountry}
                <button onClick={() => handleCountryChange("ALL")} aria-label="Remove country filter">
                  <X size={12} />
                </button>
              </span>
            )}
            {selectedState !== "ALL" && (
              <span className="active-tag">
                State: {selectedState}
                <button onClick={() => handleStateChange("ALL")} aria-label="Remove state filter">
                  <X size={12} />
                </button>
              </span>
            )}
            {selectedCity !== "ALL" && (
              <span className="active-tag">
                City: {selectedCity}
                <button onClick={() => setSelectedCity("ALL")} aria-label="Remove city filter">
                  <X size={12} />
                </button>
              </span>
            )}
            {isVerifiedOnly && (
              <span className="active-tag">
                Verified Only
                <button onClick={() => setIsVerifiedOnly(false)}>
                  <X size={12} />
                </button>
              </span>
            )}
          </div>
        )}

        {/* Stores Grid or Loading / Empty State */}
        {isLoading ? (
          <div className="stores-loading-grid">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="store-card-skeleton">
                <div className="skeleton-cover" />
                <div className="skeleton-body">
                  <div className="skeleton-line title" />
                  <div className="skeleton-line desc" />
                  <div className="skeleton-btn" />
                </div>
              </div>
            ))}
          </div>
        ) : stores.length > 0 ? (
          <div className="stores-grid">
            {stores.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        ) : (
          <div className="stores-empty-state">
            <div className="empty-icon-wrap">
              <StoreIcon size={44} />
            </div>
            <h3>No Jewellery Stores Found</h3>
            <p>
              We couldn't find any store listings matching your current search criteria. Try
              adjusting your filters or clearing your search term.
            </p>
            <button className="empty-reset-btn" onClick={handleResetFilters}>
              <RotateCcw size={16} />
              Reset All Filters
            </button>
          </div>
        )}

        {/* Store Listing Disclaimer Callout */}
        <section className="stores-platform-disclaimer">
          <div className="disclaimer-badge">
            <ShieldCheck size={16} /> Platform Notice
          </div>
          <p className="disclaimer-text">
            “JewellersParadise is a jewellery offers discovery platform. Purchases and enquiries
            are handled directly by the jeweller. Please confirm offer availability and terms with
            the store.”
          </p>
        </section>
      </main>
    </div>
  );
};

export default Stores;
