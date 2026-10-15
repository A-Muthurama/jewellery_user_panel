import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Sparkles, Tag, ArrowRight } from "lucide-react";
import "./StoreCard.css";

const StoreCard = ({ store }) => {
  if (!store) return null;

  const storeUrl = `/stores/${store.slug || store.id}`;

  return (
    <article className="store-card">
      {/* Cover Photo Header */}
      <Link to={storeUrl} className="store-card-cover-wrapper" aria-label={`View ${store.storeName}`}>
        <img
          src={
            store.coverPhotoUrl ||
            "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80"
          }
          alt={store.storeName}
          className="store-card-cover"
          loading="lazy"
        />
        <div className="store-card-cover-overlay" />

        {/* Top Badges */}
        <div className="store-card-top-badges">
          {store.isVerified ? (
            <span className="store-verified-pill" title="Verified by JewellersParadise">
              <ShieldCheck size={13} className="verified-icon" />
              Verified Jeweller
            </span>
          ) : (
            <span className="store-status-pill">
              <Sparkles size={12} />
              Featured Showroom
            </span>
          )}

          {store.offersCount > 0 && (
            <span className="store-offers-badge">
              <Tag size={12} />
              {store.offersCount} {store.offersCount === 1 ? "Offer" : "Offers"}
            </span>
          )}
        </div>

        {/* Logo Avatar */}
        <div className="store-card-logo-container">
          {store.logoUrl ? (
            <img src={store.logoUrl} alt={store.storeName} className="store-card-logo" />
          ) : (
            <div className="store-card-logo-placeholder">
              {store.storeName.charAt(0)}
            </div>
          )}
        </div>
      </Link>

      {/* Card Body: Showing only Title and Description with luxury View Store CTA */}
      <div className="store-card-content">
        <Link to={storeUrl} className="store-card-title-link">
          <h3 className="store-card-title">{store.storeName}</h3>
        </Link>

        {store.shortDescription ? (
          <p className="store-card-desc" title={store.shortDescription}>
            {store.shortDescription}
          </p>
        ) : (
          <p className="store-card-desc empty-desc">
            Explore exclusive hallmarked jewellery collections, certified diamond ornaments, and bespoke craftsmanship.
          </p>
        )}

        <div className="store-card-actions">
          <Link to={storeUrl} className="store-view-btn" id={`view-store-${store.id || store.slug}`}>
            <span>View Store</span>
            <ArrowRight size={15} className="store-view-btn-arrow" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default StoreCard;
