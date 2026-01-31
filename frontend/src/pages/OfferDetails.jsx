import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchOfferById, likeOffer } from '../services/offerservice';
import { MapPin, Share2, Calendar, Navigation, ArrowLeft, ThumbsUp, Clock } from 'lucide-react';
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
          setLikeCount(data.likeCount || 0);
          if (localStorage.getItem(`liked_${id}`)) {
            setLiked(true);
          }
        }
      } catch (err) {
        setError('Error fetching offer details');
      } finally {
        setLoading(false);
      }
    };

    loadOffer();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return '---';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '---';
      return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    } catch (e) { return '---'; }
  };

  const handleLike = async () => {
    const action = liked ? 'unlike' : 'like';
    const originalLiked = liked;
    const originalCount = likeCount;
    const newLiked = !liked;
    const newCount = newLiked ? likeCount + 1 : Math.max(0, likeCount - 1);

    setLiked(newLiked);
    setLikeCount(newCount);

    try {
      const result = await likeOffer(id, action);
      if (result && result.likeCount !== undefined) {
        setLikeCount(result.likeCount);
        if (newLiked) localStorage.setItem(`liked_${id}`, 'true');
        else localStorage.removeItem(`liked_${id}`);
      } else {
        setLiked(originalLiked);
        setLikeCount(originalCount);
      }
    } catch (err) {
      setLiked(originalLiked);
      setLikeCount(originalCount);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${offer.title} at ${offer.shopName}`,
          text: offer.description,
          url: window.location.href,
        });
      } catch (err) { console.log('Share cancelled'); }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleDirections = () => {
    const query = `${offer.shopName}, ${offer.location.city}`;
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`, '_blank');
  };

  const handleBuyClick = () => {
    if (offer.buyLink) setShowPolicyModal(true);
  };

  const handleAcceptPolicy = () => {
    setShowPolicyModal(false);
    window.open(offer.buyLink, '_blank');
  };

  if (loading) return <div className="page-loading"><div className="spinner-gold"></div></div>;
  if (error || !offer) return <div className="error-state">{error || 'Offer not found'}</div>;

  return (
    <div className="offer-details-page">
      <div className="container details-wrapper">

        {/* ROW 1: TOP NAVIGATION & TITLE BAR */}
        <div className="top-nav-bar">
          <Link to="/offers" className="back-link">
            <ArrowLeft size={18} /> Back to Offers
          </Link>
        </div>

        <div className="title-banner-full desktop-only">
          <h1 className="page-main-title">{offer.title || offer.shopName}</h1>
        </div>

        {/* ROW 2: MEDIA GRID (Image Left | Video Right) */}
        <div className="media-grid-row">
          <div className="media-card-frame">
            <img src={offer.image} alt={offer.shopName} className="main-offer-image" />
            {offer.category && <span className="cat-badge">{offer.category}</span>}
          </div>

          {offer.videoUrl && (
            <div className="video-card-frame">
              <video controls className="main-offer-video">
                <source src={offer.videoUrl} type="video/mp4" />
                Your browser does not support video.
              </video>
            </div>
          )}
        </div>

        {/* ROW 3: CONTENT GRID (Shop Info Left | Sidebar Card Right) */}
        <div className="content-grid-row">

          {/* LEFT CONTENT COLUMN */}
          <div className="content-left-col">
            <div className="shop-header-block">
              <h1 className="mobile-title-main mobile-only">{offer.title || offer.shopName}</h1>
              <h2 className="shop-name-large">{offer.shopName}</h2>
              <div className="shop-location-row">
                <MapPin size={16} />
                <span>{offer.location.address && `${offer.location.address}, `}{offer.location.city}, {offer.location.state}</span>
              </div>
            </div>

            {/* Like Button Row */}
            <div className="action-row-buttons">
              <button className={`like-pill-btn ${liked ? 'active' : ''}`} onClick={handleLike}>
                <ThumbsUp size={18} fill={liked ? "currentColor" : "none"} />
                <span>{likeCount} Likes</span>
              </button>
            </div>

            {/* Discount Box */}
            <div className="discount-hero-box">
              <div className="discount-text-wrapper">
                <span className="discount-big-text">
                  {offer.discountLabel || (offer.discountValueNumeric && offer.discountValueNumeric > 0
                    ? `${offer.discountValueNumeric}% OFF`
                    : 'SPECIAL OFFER')}
                </span>
                <span className="discount-sub-text">{offer.discountType || 'FLAT DISCOUNT'}</span>
              </div>
            </div>

            {/* Description */}
            <div className="about-section">
              <h3 className="section-label">About This Offer</h3>
              <p className="about-text">{offer.description}</p>
            </div>
          </div>

          {/* RIGHT SIDEBAR COLUMN */}
          <div className="content-right-col">
            <div className="validity-card-premium">
              <div className="validity-header">
                <Calendar size={18} /> Offer Period
              </div>
              <div className="validity-dates">
                {formatDate(offer.validFrom)} to {formatDate(offer.validUntil)}
              </div>

              <div className="sidebar-divider"></div>

              <button className="sidebar-action-btn direction-btn" onClick={handleDirections}>
                <Navigation size={16} /> GET DIRECTIONS
              </button>

              <button className="sidebar-action-btn share-btn" onClick={handleShare}>
                <Share2 size={16} /> Share
              </button>
            </div>
          </div>

        </div>

        {/* ROW 4: BOTTOM CTA */}
        <div className="bottom-cta-row">
          <button className="gold-cta-button" onClick={handleBuyClick}>
            BUY ONLINE / CONNECT TO STORE WEBSITE
          </button>
        </div>

      </div>

      {/* POLICY MODAL */}
      {showPolicyModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Buyer Agreement</h3>
            <ul className="buyer-agreement-list">
              <li>We only list offers; final terms are decided by the store.</li>
              <li>We do not verify purity</li>
              <li>All responsibility is with the jewellery store</li>
              <li>Platform does not handle payments, refunds, or warranties</li>
              <li>Refunds, Returns & After-Sales are all governed by store policy</li>
            </ul>
            <p className="policy-disclaimer">
              By clicking "Proceed", you agree to the above terms and acknowledge that transactions on the store website are subject to their specific policies.
            </p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowPolicyModal(false)}>Cancel</button>
              <button className="proceed-btn" onClick={handleAcceptPolicy}>Proceed</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfferDetails;
