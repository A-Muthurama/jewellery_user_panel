import React from 'react';
import { MapPin, Calendar, Tag, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './OfferCard.css';

const OfferCard = ({ offer }) => {
  const navigate = useNavigate();
  const {
    id, title, shopName, location, category,
    discountValue, discountValueNumeric, discountLabel, validFrom, validUntil, image, likeCount, discountType
  } = offer;

  const formatDate = (dateString) => {
    if (!dateString) return '---';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '---';

      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();

      return `${day}/${month}/${year}`;
    } catch (e) {
      return '---';
    }
  };

  const handleCardClick = () => {
    navigate(`/offer/${id}`);
  };

  const handleGetDirections = (e) => {
    e.stopPropagation(); // Prevent card click
    const query = `${shopName || title}, ${location.city}`;
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`, '_blank');
  };

  const displayDiscount = discountLabel || (discountValueNumeric && discountValueNumeric > 0
    ? `${discountValueNumeric}% OFF`
    : (discountValue || 'Special Offer'));

  return (
    <div className="offer-card card-base" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div className="card-image-wrapper">
        <img src={image} alt={title || shopName} className="offer-image" />
        <span className="category-badge">{category}</span>
        {discountLabel && <span className="discount-label-badge">{discountLabel}</span>}
      </div>

      <div className="card-content-v2">
        <h4 className="card-shop-name-v2">{shopName}</h4>
        <h3 className="card-title-v2">{title}</h3>
        <div className="discount-highlight-v2">{displayDiscount}</div>

        <div className="card-meta-v2">
          <div className="meta-item-v2">
            <Calendar size={14} />
            <span>Till: {formatDate(validUntil)}</span>
          </div>
          <div className="meta-item-v2">
            <Tag size={14} />
            <span>{discountType || 'Offer'}</span>
          </div>
          <div className="meta-item-v2" style={{ marginLeft: 'auto' }}>
            <span style={{ fontSize: '0.85rem' }}>❤️ {likeCount || 0}</span>
          </div>
        </div>

        <div className="card-footer-v2">
          <div className="location-info-v2">
            <div className="location-text-v2">
              <MapPin size={16} color="var(--color-gold-primary)" />
              {location.city}
            </div>
          </div>
          <button className="directions-btn-v2" onClick={handleGetDirections}>
            <ExternalLink size={14} /> Directions
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfferCard;
