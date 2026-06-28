import React, { useState, useEffect, useRef } from "react";
import { fetchProducts } from "../services/products.service";
import { Loader2, AlertCircle, Info, Package } from "lucide-react";
import ProductCard from "../components/ProductCard";
import "./Products.css";

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

      {/* ── Affiliate Disclosure ───────────────── */}
      <section className="products-disclosure-section">
        <div className="container">
          <div className="products-disclosure-box">
            <Info size={15} className="products-disclosure-icon" />
            <p className="products-disclosure-text">
              This page contains affiliate links. If you purchase this product through the link provided, JewellersParadise may earn a small commission at no additional cost to you. This helps us continue bringing you the latest jewellery offers and recommendations from trusted brands across India. We only feature products from reputable jewellers and brands.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Products;
