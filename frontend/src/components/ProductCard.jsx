import React, { useState, useEffect, useRef } from "react";
import { ShoppingBag, ChevronLeft, ChevronRight, ExternalLink, Package } from "lucide-react";
import "./ProductCard.css";

// ── Image Slider for a single product card ─────────────────────────────────
export const ProductImageSlider = ({ images, title }) => {
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
        <ShoppingBag size={48} strokeWidth={1.5} className="prod-placeholder-icon" />
        <span className="prod-placeholder-text">Best Deal</span>
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

export default ProductCard;
