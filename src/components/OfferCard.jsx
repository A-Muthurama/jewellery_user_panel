import React from 'react';
import { MapPin, Calendar, Tag, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './OfferCard.css';

const OfferCard = ({ offer }) => {
  const navigate = useNavigate();
  const {
    id, shopName, location, category,
    discountValue, description, validUntil, image
  } = offer;

  const handleCardClick = () => {
    navigate(`/offer/${id}`);
  };

  const handleGetDirections = (e) => {
    e.stopPropagation(); // Prevent card click
    const query = `${shopName}, ${location.city}`;
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`, '_blank');
  };

  return (
    <div className="offer-card card-base" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div className="card-image-wrapper">
        <img src={image} alt={shopName} className="offer-image" />
        <span className="category-badge">{category}</span>
      </div>

      <div className="card-content">
        <h3 className="shop-name">{shopName}</h3>
        <div className="discount-highlight">{discountValue}</div>
        <p className="description">{description}</p>

        <div className="card-meta">
          <div className="meta-item">
            <Calendar size={14} />
            <span>Valid till: {validUntil}</span>
          </div>
          <div className="meta-item">
            <Tag size={14} />
            <span>{offer.discountType}</span>
          </div>
        </div>

        <div className="card-footer">
          <div className="location-info">
            <div className="location-text">
              <MapPin size={16} color="var(--color-gold-primary)" />
              {location.city}
            </div>
          </div>
          <button className="directions-btn" onClick={handleGetDirections}>
            <ExternalLink size={14} /> Directions
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfferCard;
