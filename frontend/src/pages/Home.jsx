import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Frown, ChevronLeft, ChevronRight, X } from 'lucide-react';
import OfferCard from '../components/OfferCard';
import ProductCard from '../components/ProductCard';
import { fetchOffers } from '../services/offerservice';
import { fetchProducts } from '../services/products.service';
import './Home.css';

const Home = () => {
  const [featuredOffers, setFeaturedOffers] = useState([]);
  const [featuredDeals, setFeaturedDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDeals, setLoadingDeals] = useState(true);
  const [posterStartIndex, setPosterStartIndex] = useState(0);
  const [posterTransition, setPosterTransition] = useState(null);
  const [showAd, setShowAd] = useState(false);
  const [adPoster, setAdPoster] = useState('');
  const [adIndex, setAdIndex] = useState(0);
  const [hasShownAd, setHasShownAd] = useState(false);
  const scrollTriggerRef = useRef(null);

  const adsList = ['/custom/Poster1.png', '/custom/Poster2.png'];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Trigger ad when value-props section is reached, only once
        if (entries[0].isIntersecting && !hasShownAd) {
          setAdPoster(adsList[0]);
          setShowAd(true);
          setHasShownAd(true);
        }
      },
      { threshold: 0.1 }
    );

    if (scrollTriggerRef.current) {
      observer.observe(scrollTriggerRef.current);
    }

    return () => {
      if (scrollTriggerRef.current) {
        observer.unobserve(scrollTriggerRef.current);
      }
    };
  }, [hasShownAd]);

  const handleCloseAd = () => {
    // Show one by one: switch to next poster if available
    if (adIndex < adsList.length - 1) {
      const nextIndex = adIndex + 1;
      setAdIndex(nextIndex);
      setAdPoster(adsList[nextIndex]);
    } else {
      setShowAd(false);
    }
  };

  const posters = [
    '/poster_images/JewellersParadise-Poster1.png',
    '/poster_images/JewellersParadise-Poster2.jpeg',
    '/poster_images/JewellersParadise-Poster3.jpeg',
    '/poster_images/JewellersParadise-Poster4.png',
    '/poster_images/JewellersParadise-Poster5.png',
  ];

  const visiblePosterCount = 3;
  const stepSize = 2;

  const getPosterAt = (index) => {
    const normalized = (index + posters.length) % posters.length;
    return { src: posters[normalized], index: normalized };
  };

  const visiblePosters = Array.from({ length: visiblePosterCount }, (_, offset) =>
    getPosterAt(posterStartIndex + offset)
  );

  const beginPosterTransition = (direction) => {
    if (posterTransition || posters.length === 0) return;

    if (direction === 'next') {
      const items = [
        ...visiblePosters,
        ...Array.from({ length: stepSize }, (_, offset) =>
          getPosterAt(posterStartIndex + visiblePosterCount + offset)
        ),
      ];
      // Start at 0, then slide left by shift.
      setPosterTransition({ direction, items, trackX: '0px' });
      requestAnimationFrame(() => {
        setPosterTransition({ direction, items, trackX: 'calc(-1 * var(--poster-shift))' });
      });
    } else {
      const items = [
        ...Array.from({ length: stepSize }, (_, offset) =>
          getPosterAt(posterStartIndex - stepSize + offset)
        ),
        ...visiblePosters,
      ];
      // Start from shifted position so current posters are visible, then slide right to 0.
      setPosterTransition({ direction, items, trackX: 'calc(-1 * var(--poster-shift))' });
      requestAnimationFrame(() => {
        setPosterTransition({ direction, items, trackX: '0px' });
      });
    }
  };

  const showPrevPosters = () => beginPosterTransition('prev');
  const showNextPosters = () => beginPosterTransition('next');

  const onPosterTransitionEnd = () => {
    if (!posterTransition) return;
    const direction = posterTransition.direction;
    setPosterStartIndex((prev) => {
      if (direction === 'next') return (prev + stepSize) % posters.length;
      return (prev - stepSize + posters.length) % posters.length;
    });
    setPosterTransition(null);
  };

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

  useEffect(() => {
    const loadDeals = async () => {
      try {
        setLoadingDeals(true);
        const data = await fetchProducts();
        // Show first 3 deals
        setFeaturedDeals(data.slice(0, 3));
      } catch (err) {
        console.error("Failed to load featured deals", err);
      } finally {
        setLoadingDeals(false);
      }
    };
    loadDeals();
  }, []);

  return (
    <div className="home-page">
      {showAd && (
        <div className="ad-overlay" onClick={handleCloseAd}>
          <div className="ad-modal" onClick={(e) => e.stopPropagation()}>
            <button className="ad-close-btn" onClick={handleCloseAd} aria-label="Close Advertisement">
              <X size={20} />
            </button>
            <img src={adPoster} alt="Advertisement" className="ad-image-full" />
          </div>
        </div>
      )}

      {/* Hero Section Merged Here - hero section*/}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-badge">India's Jewellery Offers Hub</div>
        <div className="container hero-content">
          <h1 className="hero-title">Discover Exclusive Jewellery Offers</h1>
          <p className="hero-subtitle">
            Find the best deals on Gold, Diamond, and Silver from verified shops near you.
          </p>
          <div className="hero-actions">
            <Link to="/offers" className="btn-primary">Explore Offers</Link>
            <Link to="/about" className="btn-outline">Learn More</Link>
          </div>


        </div>
      </section>

      <main className="container section">

        {/* Featured Deals Section */}
        <div className="section-header">
          <h2 className="section-title">Featured Deals</h2>
          <Link to="/products" className="view-all-link">
            View All <ArrowRight size={18} />
          </Link>
        </div>

        <div className="offers-grid" style={{ marginBottom: '4rem' }}>
          {loadingDeals ? (
            <p>Loading featured deals...</p>
          ) : featuredDeals.length > 0 ? (
            featuredDeals.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="no-results" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2rem' }}>
              <Frown size={48} />
              <p>No featured deals available right now.</p>
            </div>
          )}
        </div>

        {/* Featured Offers Section */}
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

      <section className="container section value-props" ref={scrollTriggerRef}>
        <h2 className="section-title">Why JEWELLERS PARADISE?</h2>
        <p className="section-intro">Jewellers Paradise connects you with the finest collections across India, ensuring quality and value.</p>

        <div className="posters-carousel" aria-label="Jewellers Paradise posters">
          <div className="posters-window" role="group" aria-roledescription="carousel">
            <div
              className={posterTransition ? 'posters-track is-animating' : 'posters-track'}
              style={{ ['--track-x']: posterTransition ? posterTransition.trackX : '0px', ['--step-size']: stepSize }}
              onTransitionEnd={posterTransition ? onPosterTransitionEnd : undefined}
            >
              {(posterTransition ? posterTransition.items : visiblePosters).map((poster, i) => (
                <div className="poster-frame" key={`${poster.src}-${poster.index}-${i}`}>
                  <img
                    className="poster-image"
                    src={poster.src}
                    alt={`Jewellers Paradise poster ${poster.index + 1}`}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>

            <div className="carousel-edge left" aria-hidden="true"></div>
            <div className="carousel-edge right" aria-hidden="true"></div>

            <button
              type="button"
              className="carousel-arrow left"
              onClick={showPrevPosters}
              aria-label="Show previous posters"
            >
              <ChevronLeft size={26} />
            </button>

            <button
              type="button"
              className="carousel-arrow right"
              onClick={showNextPosters}
              aria-label="Show next posters"
            >
              <ChevronRight size={26} />
            </button>
          </div>
        </div>

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
