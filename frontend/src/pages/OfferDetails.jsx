import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchOfferById } from '../services/offerservice';
import { MapPin, Share2, Calendar, Navigation, ArrowLeft, ThumbsUp } from 'lucide-react';
import './OfferDetails.css';

const OfferDetails = () => {
  const { id } = useParams();

  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showPolicyModal, setShowPolicyModal] = useState(false);

  useEffect(() => {
    const loadOffer = async () => {
      try {
        setLoading(true);
        const data = await fetchOfferById(id);
        if (!data) {
          setError('Offer not found');
        } else {
          setOffer(data);
          // Initialize like count from offer data or random for demo
          setLikeCount(data.likeCount || Math.floor(Math.random() * 500) + 50);
        }
      } catch (err) {
        setError('Error fetching offer details');
      } finally {
        setLoading(false);
      }
    };

    loadOffer();
  }, [id]);

  /* ---------------- HELPERS ---------------- */

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  /* ---------------- ACTIONS ---------------- */

  const handleLike = () => {
    if (!liked) {
      setLikeCount(prev => prev + 1);
      setLiked(true);
    } else {
      setLikeCount(prev => prev - 1);
      setLiked(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${offer.discountValue} at ${offer.shopName}`,
          text: offer.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleDirections = () => {
    const query = `${offer.shopName}, ${offer.location.city}`;
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
      '_blank'
    );
  };

  const handleBuyClick = () => {
    if (offer.buyLink) {
      setShowPolicyModal(true);
    }
  };

  const handleAcceptPolicy = () => {
    setShowPolicyModal(false);
    window.open(offer.buyLink, '_blank');
  };

  /* ---------------- UI ---------------- */

  if (loading) {
    return (
      <div className="container section text-center">
        <h3>Loading offer details...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container section text-center">
        <h2>{error}</h2>
        <Link to="/offers" className="btn-primary">
          Back to Offers
        </Link>
      </div>
    );
  }

  return (
    <div className="offer-details-page">
      <div className="container section details-wrapper">

        <Link to="/offers" className="view-all-link">
          <ArrowLeft size={18} /> Back to Offers
        </Link>

        {/* PRODUCT TITLE */}
        {offer.productTitle && (
          <h1 className="product-title">{offer.productTitle}</h1>
        )}

        {/* MEDIA SECTION (Image + Video) */}
        <div className="media-section">
          <div className="details-hero">
            <img src={offer.image} alt={offer.shopName} className="details-image" />
            <span className="details-badge">{offer.category}</span>
          </div>

          {offer.videoUrl && (
            <div className="video-container">
              <video controls className="product-video">
                <source src={offer.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </div>

        <div className="details-content">
          {/* LEFT */}
          <div className="main-info">

            <div className="shop-header">
              <div>
                <h2 className="shop-name">{offer.shopName}</h2>
                <div className="shop-link">
                  <MapPin size={18} />
                  {offer.location.area && <span>{offer.location.area}, </span>}
                  {offer.location.city}, {offer.location.state}
                </div>
              </div>
              <button
                className={`btn-like ${liked ? 'liked' : ''}`}
                onClick={handleLike}
                title="Like this offer"
              >
                <ThumbsUp size={24} fill={liked ? "currentColor" : "none"} />
                <span className="like-count">{likeCount}</span>
              </button>
            </div>

            <div className="discount-banner">
              <div className="big-discount">{offer.discountValue}</div>
              <div className="discount-type">{offer.discountType}</div>
            </div>

            <div className="description-box">
              <h3>About This Offer</h3>
              <p className="description-text">{offer.description}</p>
            </div>

            {/* BUY ONLINE BUTTON */}
            {offer.buyLink && (
              <div className="buy-online-section">
                <button className="btn-buy-online" onClick={handleBuyClick}>
                  Buy Online / Connect to Store Website
                </button>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <aside className="details-sidebar">
            <div className="card-base">
              <div className="validity-block">
                <span className="validity-label">
                  <Calendar size={14} /> Offer Period
                </span>
                <div className="validity-date">
                  {formatDate(offer.validFrom || offer.validUntil)} to {formatDate(offer.validUntil)}
                </div>
              </div>

              <div className="action-buttons">
                <button className="btn-primary btn-full" onClick={handleDirections}>
                  <Navigation size={18} /> Get Directions
                </button>

                <button className="btn-share btn-full" onClick={handleShare}>
                  <Share2 size={18} /> Share
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* POLICY MODAL */}
      {showPolicyModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Connect to Store Website</h3>
            <p>You are being redirected to the seller's official website.</p>
            <p className="policy-text">
              By clicking "Proceed", you agree to our terms and acknowledge that
              transactions on the third-party site are subject to their policies.
            </p>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowPolicyModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleAcceptPolicy}>Proceed</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfferDetails;
