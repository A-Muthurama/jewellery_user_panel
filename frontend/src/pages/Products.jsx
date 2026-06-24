import React, { useState, useEffect, useRef } from "react";
import { fetchProducts } from "../services/products.service";
import { ShoppingBag, ChevronLeft, ChevronRight, ExternalLink, Package, Loader2, AlertCircle } from "lucide-react";
import "./Products.css";

// ── Image Slider for a single product card ─────────────────────────────────
const ProductImageSlider = ({ images, title }) => {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  const hasMultiple = images && images.length > 1;

  // Auto-play only when there are multiple images
  useEffect(() => {
    if (!hasMultiple) return;
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3500);
    return () => clearInterval(timerRef.current);
  }, [images, hasMultiple]);

  const go = (dir) => {
    clearInterval(timerRef.current);
    setCurrent((prev) => (prev + dir + images.length) % images.length);
  };

  if (!images || images.length === 0) {
    return (
      <div className="prod-img-placeholder">
        <Package size={64} strokeWidth={1} />
        <span>No Image</span>
      </div>
    );
  }

  return (
    <div className="prod-img-slider">
      <div
        className="prod-img-track"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`${title} – image ${i + 1}`}
            className="prod-img-slide"
            loading="lazy"
          />
        ))}
      </div>

      {hasMultiple && (
        <>
          <button
            className="prod-slider-btn prod-slider-prev"
            onClick={() => go(-1)}
            aria-label="Previous image"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            className="prod-slider-btn prod-slider-next"
            onClick={() => go(1)}
            aria-label="Next image"
          >
            <ChevronRight size={18} />
          </button>
          <div className="prod-slider-dots">
            {images.map((_, i) => (
              <button
                key={i}
                className={`prod-dot ${i === current ? "active" : ""}`}
                onClick={() => { clearInterval(timerRef.current); setCurrent(i); }}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// ── Single Product Card ─────────────────────────────────────────────────────
const ProductCard = ({ product }) => {
  return (
    <div className="prod-card">
      <ProductImageSlider images={product.images} title={product.title} />

      <div className="prod-card-body">
        <h2 className="prod-card-title">{product.title}</h2>

        {product.description && (
          <p className="prod-card-desc">{product.description}</p>
        )}

        {product.affiliateUrl ? (
          <a
            href={product.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="prod-buy-btn"
            id={`buy-now-${product.id}`}
          >
            <ShoppingBag size={18} />
            Buy Now
            <ExternalLink size={14} className="prod-buy-icon" />
          </a>
        ) : (
          <button className="prod-buy-btn prod-buy-btn--disabled" disabled>
            <ShoppingBag size={18} />
            Coming Soon
          </button>
        )}
      </div>
    </div>
  );
};

// ── Main Products Page ──────────────────────────────────────────────────────
const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch {
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <main className="products-page">
      {/* ── Hero Banner ─────────────────────────── */}
      <section className="products-hero">
        <div className="products-hero-content">
          <h1 className="products-hero-title">Best Deals, One Place</h1>
          <p className="products-hero-sub">
            We bring you the finest product offers from top platforms across
            the web — handpicked, verified, and all in one place. Shop smarter,
            save more.
          </p>
          <div className="products-hero-tags">
            <span>🛍️ Multi-Platform Deals</span>
            <span>💎 Curated Picks</span>
            <span>⚡ Best Prices</span>
          </div>
        </div>
        <div className="products-hero-orb products-hero-orb1" />
        <div className="products-hero-orb products-hero-orb2" />
      </section>

      {/* ── Grid / State ────────────────────────── */}
      <section className="products-grid-section">
        <div className="container">
          {loading && (
            <div className="products-state">
              <Loader2 size={48} className="products-spinner" />
              <p>Loading products…</p>
            </div>
          )}

          {!loading && error && (
            <div className="products-state products-state--error">
              <AlertCircle size={48} />
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="products-state">
              <Package size={64} strokeWidth={1} />
              <h3>No Products Yet</h3>
              <p>The admin hasn't added any products yet. Check back soon!</p>
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <div className="products-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Products;
