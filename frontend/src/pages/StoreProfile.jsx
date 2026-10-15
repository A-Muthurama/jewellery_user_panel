import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  MessageCircle,
  Globe,
  Navigation,
  ShieldCheck,
  Clock,
  Sparkles,
  Calendar,
  Share2,
  ChevronLeft,
  ChevronRight,
  X,
  Tag,
  AlertTriangle,
  Building2,
  Instagram,
  Facebook,
  ExternalLink,
  CheckCircle2,
  Info,
  FileCheck,
  Send,
  Loader2
} from "lucide-react";
import {
  fetchStoreBySlugOrId,
  submitStoreClaim,
  submitStoreReport
} from "../services/stores.service";
import "./StoreProfile.css";

const StoreProfile = () => {
  const { slugOrId } = useParams();
  const [store, setStore] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Gallery lightbox state
  const [activeImageIndex, setActiveImageIndex] = useState(null);

  // Claim modal state
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [claimForm, setClaimForm] = useState({
    claimantName: "",
    claimantPhone: "",
    claimantEmail: "",
    proofType: "GSTIN / Business Registration",
    proofDocUrl: "",
    notes: ""
  });
  const [isSubmittingClaim, setIsSubmittingClaim] = useState(false);
  const [claimSuccessMessage, setClaimSuccessMessage] = useState(null);
  const [claimError, setClaimError] = useState(null);

  // Report modal state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportForm, setReportForm] = useState({
    reportType: "Incorrect Contact / Phone",
    description: "",
    reportedByEmail: ""
  });
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [reportSuccessMessage, setReportSuccessMessage] = useState(null);
  const [reportError, setReportError] = useState(null);

  // Offer terms expand state
  const [expandedOfferId, setExpandedOfferId] = useState(null);

  // Share state
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchStoreBySlugOrId(slugOrId);
        if (isMounted) {
          if (data) {
            setStore(data);
          } else {
            setError("Store listing not found or is currently inactive.");
          }
        }
      } catch (err) {
        if (isMounted) setError("Failed to load store profile.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadProfile();
    return () => {
      isMounted = false;
    };
  }, [slugOrId]);

  if (isLoading) {
    return (
      <div className="store-profile-loading">
        <div className="loading-spinner">
          <Loader2 size={36} className="spin-icon" />
          <p>Loading store profile...</p>
        </div>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="container store-profile-not-found">
        <h2>Store Listing Not Found</h2>
        <p>{error || "The requested jewellery store listing could not be found."}</p>
        <Link to="/stores" className="back-btn">
          <ChevronLeft size={16} /> Back to All Stores
        </Link>
      </div>
    );
  }

  // Formatting helpers
  const cleanPhone = (store.phone || "").replace(/[^\d+]/g, "");
  const whatsappNumber = (store.whatsapp || store.phone || "").replace(/[^\d]/g, "");
  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        `Hi ${store.storeName}, I saw your showroom on JewellersParadise and would like to inquire about your collections.`
      )}`
    : null;

  const mapsUrl =
    store.googleMapsLink ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${store.storeName} ${store.address || ""} ${store.city || ""}`
    )}`;

  const updatedDateStr = store.updatedAt || store.publishedAt || store.createdAt;
  const formattedUpdatedDate = updatedDateStr
    ? new Date(updatedDateStr).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric"
      })
    : null;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${store.storeName} â€” JewellersParadise`,
          text: `Check out ${store.storeName} in ${store.city} on JewellersParadise!`,
          url: window.location.href
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Claim submit handler
  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    setClaimError(null);
    setIsSubmittingClaim(true);
    try {
      const res = await submitStoreClaim(store.id, claimForm);
      setClaimSuccessMessage(res.message);
      setClaimForm({
        claimantName: "",
        claimantPhone: "",
        claimantEmail: "",
        proofType: "GSTIN / Business Registration",
        proofDocUrl: "",
        notes: ""
      });
    } catch (err) {
      setClaimError(err.message || "Failed to submit claim request.");
    } finally {
      setIsSubmittingClaim(false);
    }
  };

  // Report submit handler
  const handleReportSubmit = async (e) => {
    e.preventDefault();
    setReportError(null);
    setIsSubmittingReport(true);
    try {
      const res = await submitStoreReport(store.id, reportForm);
      setReportSuccessMessage(res.message);
      setReportForm({
        reportType: "Incorrect Contact / Phone",
        description: "",
        reportedByEmail: ""
      });
    } catch (err) {
      setReportError(err.message || "Failed to submit report.");
    } finally {
      setIsSubmittingReport(false);
    }
  };

  // Lightbox navigation
  const galleryImages = store.gallery || [];
  const handlePrevImage = () => {
    setActiveImageIndex((prev) =>
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
  };
  const handleNextImage = () => {
    setActiveImageIndex((prev) =>
      prev === galleryImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="store-profile-page">
      {/* Breadcrumb Bar */}
      <div className="profile-breadcrumb-bar">
        <div className="container breadcrumb-container">
          <Link to="/stores" className="breadcrumb-link">
            <ChevronLeft size={16} /> All Stores
          </Link>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-item">{store.city}</span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">{store.storeName}</span>
        </div>
      </div>

      {/* Hero Cover Header */}
      <section className="profile-hero-section">
        <div className="profile-cover-wrap">
          <img
            src={
              store.coverPhotoUrl ||
              "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1600&q=80"
            }
            alt={store.storeName}
            className="profile-cover-img"
          />
          <div className="profile-cover-gradient" />
        </div>

        <div className="container profile-header-container">
          <div className="profile-header-card">
            {/* Store Avatar Logo */}
            <div className="profile-logo-wrapper">
              {store.logoUrl ? (
                <img src={store.logoUrl} alt={store.storeName} className="profile-logo-img" />
              ) : (
                <div className="profile-logo-placeholder">
                  {store.storeName.charAt(0)}
                </div>
              )}
            </div>

            {/* Header Main Info */}
            <div className="profile-header-info">
              <div className="profile-badges-row">
                {store.isVerified ? (
                  <span className="profile-verified-badge">
                    <ShieldCheck size={16} /> Verified Jeweller
                  </span>
                ) : (
                  <span className="profile-standard-badge">
                    <Sparkles size={14} /> Listed Showroom
                  </span>
                )}
                <span className="profile-status-badge">Active Listing</span>
                {formattedUpdatedDate && (
                  <span className="profile-updated-text">
                    <Calendar size={13} /> Updated on {formattedUpdatedDate}
                  </span>
                )}
              </div>

              <h1 className="profile-store-title">{store.storeName}</h1>

              <div className="profile-locality-row">
                <MapPin size={16} className="loc-pin" />
                <span>
                  {store.address ? `${store.address}, ` : ""}
                  {store.city}, {store.state} {store.pincode ? `â€“ ${store.pincode}` : ""}
                </span>
              </div>

              {store.shortDescription && (
                <p className="profile-short-desc">{store.shortDescription}</p>
              )}

              {/* Categories Pills */}
              {store.categories && store.categories.length > 0 && (
                <div className="profile-categories-row">
                  {store.categories.map((cat, idx) => (
                    <span key={idx} className="profile-cat-pill">
                      {cat}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Top Action Buttons (Visit Website, Directions, Call, WhatsApp) */}
            <div className="profile-header-actions-col">
              <div className="profile-actions-buttons-grid">
                {cleanPhone && (
                  <a
                    href={`tel:${cleanPhone}`}
                    className="profile-action-btn btn-call"
                    title="Call Store"
                  >
                    <Phone size={16} />
                    <span>Call Store</span>
                  </a>
                )}

                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="profile-action-btn btn-whatsapp"
                    title="WhatsApp Store"
                  >
                    <MessageCircle size={16} />
                    <span>WhatsApp</span>
                  </a>
                )}

                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="profile-action-btn btn-directions"
                  title="Get Directions"
                >
                  <Navigation size={16} />
                  <span>Get Directions</span>
                </a>

                {store.website && (
                  <a
                    href={
                      store.website.startsWith("http")
                        ? store.website
                        : `https://${store.website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="profile-action-btn btn-website"
                    title="Visit Official Website"
                  >
                    <Globe size={16} />
                    <span>Visit Website</span>
                  </a>
                )}

                <button
                  type="button"
                  className="profile-action-btn btn-share"
                  onClick={handleShare}
                  title="Share Store Profile"
                >
                  <Share2 size={16} />
                  <span>{copiedLink ? "Link Copied!" : "Share Profile"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Body Content Columns */}
      <main className="container profile-body-container">
        <div className="profile-main-grid">
          {/* Left Column: Details, Offers, Gallery */}
          <div className="profile-left-col">
            {/* Exclusive Offers Section */}
            {store.offers && store.offers.length > 0 ? (
              <section className="profile-section offers-section">
                <div className="section-header">
                  <div className="section-title-wrap">
                    <Tag size={20} className="section-icon" />
                    <h2>Active Store Offers & Promotions</h2>
                  </div>
                  <span className="offers-count-badge">
                    {store.offers.length}{" "}
                    {store.offers.length === 1 ? "Offer Available" : "Offers Available"}
                  </span>
                </div>

                <div className="profile-offers-grid">
                  {store.offers.map((offer) => {
                    const isExpanded = expandedOfferId === offer.id;
                    const validTill = offer.endDate
                      ? new Date(offer.endDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })
                      : "Limited Period";

                    return (
                      <div key={offer.id} className="profile-offer-card">
                        {offer.posterUrl && (
                          <div className="offer-poster-wrap">
                            <img
                              src={offer.posterUrl}
                              alt={offer.title}
                              className="offer-poster"
                            />
                            <span className="offer-validity-tag">
                              Valid till {validTill}
                            </span>
                          </div>
                        )}
                        <div className="offer-card-body">
                          <h3 className="offer-card-title">{offer.title}</h3>
                          {offer.description && (
                            <p className="offer-card-desc">{offer.description}</p>
                          )}

                          {offer.terms && (
                            <div className="offer-terms-accordion">
                              <button
                                type="button"
                                className="toggle-terms-btn"
                                onClick={() =>
                                  setExpandedOfferId(isExpanded ? null : offer.id)
                                }
                              >
                                {isExpanded ? "Hide Terms & Conditions" : "View Terms & Conditions"}
                              </button>
                              {isExpanded && (
                                <p className="offer-terms-text">{offer.terms}</p>
                              )}
                            </div>
                          )}

                          <div className="offer-claim-prompt">
                            <span>Claim this offer in-store at {store.storeName}.</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ) : null}

            {/* Photo Gallery Section */}
            {galleryImages.length > 0 && (
              <section className="profile-section gallery-section">
                <div className="section-header">
                  <div className="section-title-wrap">
                    <Sparkles size={20} className="section-icon" />
                    <h2>Store & Collection Gallery</h2>
                  </div>
                  <span className="gallery-count-text">
                    {galleryImages.length} Photographs
                  </span>
                </div>

                <div className="profile-gallery-grid">
                  {galleryImages.map((img, idx) => (
                    <div
                      key={img.id || idx}
                      className="gallery-thumb-wrap"
                      onClick={() => setActiveImageIndex(idx)}
                      role="button"
                      tabIndex={0}
                      title={img.caption || "Click to view full photo"}
                    >
                      <img
                        src={img.imageUrl}
                        alt={img.caption || `${store.storeName} gallery`}
                        className="gallery-thumb"
                        loading="lazy"
                      />
                      {img.caption && (
                        <div className="gallery-thumb-caption">
                          <span>{img.caption}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Mandatory Listing Disclaimer */}
            <div className="profile-disclaimer-box">
              <div className="disclaimer-header">
                <Info size={18} />
                <h4>Important Listing Disclaimer</h4>
              </div>
              <p className="disclaimer-body">
                {store.disclaimer ||
                  "JewellersParadise is a jewellery offers discovery platform. Purchases and enquiries are handled directly by the jeweller. Please confirm offer availability and terms with the store."}
              </p>
            </div>
          </div>

          {/* Right Column: Store Info Cards & Claim / Report Actions */}
          <div className="profile-right-col">
            {/* Opening Hours & Weekly Holiday Card */}
            <div className="info-sidebar-card">
              <h3 className="sidebar-card-title">
                <Clock size={18} /> Hours & Schedule
              </h3>
              <div className="schedule-list">
                <div className="schedule-row">
                  <span className="schedule-label">Opening Hours</span>
                  <span className="schedule-val">{store.openingHours || "10:30 AM â€“ 08:30 PM"}</span>
                </div>
                <div className="schedule-row">
                  <span className="schedule-label">Weekly Holiday</span>
                  <span className="schedule-val holiday-val">
                    {store.weeklyHoliday || "None (Open 7 Days)"}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact & Social Links Card */}
            <div className="info-sidebar-card">
              <h3 className="sidebar-card-title">
                <Building2 size={18} /> Store Contact Details
              </h3>
              <div className="sidebar-contact-list">
                <div className="contact-item">
                  <Phone size={16} />
                  <div>
                    <span className="item-label">Telephone</span>
                    <a href={`tel:${cleanPhone}`} className="item-val">
                      {store.phone}
                    </a>
                  </div>
                </div>

                {store.whatsapp && (
                  <div className="contact-item">
                    <MessageCircle size={16} />
                    <div>
                      <span className="item-label">WhatsApp Enquiry</span>
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="item-val"
                      >
                        {store.whatsapp}
                      </a>
                    </div>
                  </div>
                )}

                {store.website && (
                  <div className="contact-item">
                    <Globe size={16} />
                    <div>
                      <span className="item-label">Official Website</span>
                      <a
                        href={
                          store.website.startsWith("http")
                            ? store.website
                            : `https://${store.website}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="item-val external"
                      >
                        {store.website.replace(/^https?:\/\//, "")}
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                )}

                {store.socialLinks && (
                  <div className="social-links-row">
                    {store.socialLinks.instagram && (
                      <a
                        href={store.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-btn instagram"
                        title="Instagram"
                      >
                        <Instagram size={18} />
                      </a>
                    )}
                    {store.socialLinks.facebook && (
                      <a
                        href={store.socialLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-btn facebook"
                        title="Facebook"
                      >
                        <Facebook size={18} />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Address & Navigation Card */}
            <div className="info-sidebar-card">
              <h3 className="sidebar-card-title">
                <MapPin size={18} /> Location & Address
              </h3>
              <p className="sidebar-address-text">{store.address}</p>
              <p className="sidebar-city-text">
                {store.city}, {store.state} {store.pincode}
              </p>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="maps-direction-button"
              >
                <Navigation size={15} />
                Open in Google Maps
              </a>
            </div>

            {/* Claim Listing & Report Detail Links (Required Features) */}
            <div className="store-management-actions-card">
              <div className="management-action-item">
                <FileCheck size={20} className="action-icon claim-icon" />
                <div className="action-text-wrap">
                  <h4>Own this store?</h4>
                  <p>Claim or update this listing to manage store details directly.</p>
                  <button
                    type="button"
                    className="claim-trigger-link"
                    onClick={() => {
                      setClaimSuccessMessage(null);
                      setClaimError(null);
                      setIsClaimModalOpen(true);
                    }}
                  >
                    Claim or update this listing &rarr;
                  </button>
                </div>
              </div>

              <div className="management-action-divider" />

              <div className="management-action-item">
                <AlertTriangle size={20} className="action-icon report-icon" />
                <div className="action-text-wrap">
                  <h4>Found an error?</h4>
                  <p>Help us keep JewellersParadise verified and reliable.</p>
                  <button
                    type="button"
                    className="report-trigger-link"
                    onClick={() => {
                      setReportSuccessMessage(null);
                      setReportError(null);
                      setIsReportModalOpen(true);
                    }}
                  >
                    Report incorrect details &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* --- Lightbox Modal --- */}
      {activeImageIndex !== null && galleryImages[activeImageIndex] && (
        <div className="lightbox-overlay" onClick={() => setActiveImageIndex(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="lightbox-close-btn"
              onClick={() => setActiveImageIndex(null)}
              title="Close"
            >
              <X size={24} />
            </button>
            {galleryImages.length > 1 && (
              <>
                <button
                  className="lightbox-nav-btn prev"
                  onClick={handlePrevImage}
                  title="Previous Photo"
                >
                  <ChevronLeft size={28} />
                </button>
                <button
                  className="lightbox-nav-btn next"
                  onClick={handleNextImage}
                  title="Next Photo"
                >
                  <ChevronRight size={28} />
                </button>
              </>
            )}
            <img
              src={galleryImages[activeImageIndex].imageUrl}
              alt={galleryImages[activeImageIndex].caption || "Jewellery gallery photo"}
              className="lightbox-img"
            />
            {galleryImages[activeImageIndex].caption && (
              <p className="lightbox-caption">
                {galleryImages[activeImageIndex].caption}
              </p>
            )}
          </div>
        </div>
      )}

      {/* --- Claim Store Listing Modal --- */}
      {isClaimModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsClaimModalOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-wrap">
                <FileCheck size={22} className="modal-icon" />
                <div>
                  <h3>Claim or Update Listing</h3>
                  <p className="modal-subtitle">{store.storeName}</p>
                </div>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setIsClaimModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            {claimSuccessMessage ? (
              <div className="modal-success-state">
                <CheckCircle2 size={48} className="success-icon" />
                <h4>Claim Request Received!</h4>
                <p>{claimSuccessMessage}</p>
                <button
                  type="button"
                  className="modal-primary-btn"
                  onClick={() => setIsClaimModalOpen(false)}
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleClaimSubmit} className="modal-form">
                {claimError && <div className="modal-error-alert">{claimError}</div>}

                <p className="modal-instructions">
                  Are you the owner or authorized representative of this showroom? Please provide
                  your credentials. Our verification team will review and contact you.
                </p>

                <div className="form-group">
                  <label>Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Chandra (Proprietor)"
                    value={claimForm.claimantName}
                    onChange={(e) =>
                      setClaimForm({ ...claimForm, claimantName: e.target.value })
                    }
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Official Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98450 XXXXX"
                      value={claimForm.claimantPhone}
                      onChange={(e) =>
                        setClaimForm({ ...claimForm, claimantPhone: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Official Business Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="owner@store.com"
                      value={claimForm.claimantEmail}
                      onChange={(e) =>
                        setClaimForm({ ...claimForm, claimantEmail: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Proof of Business Ownership *</label>
                  <select
                    value={claimForm.proofType}
                    onChange={(e) =>
                      setClaimForm({ ...claimForm, proofType: e.target.value, proofDocUrl: "" })
                    }
                  >
                    <option value="GSTIN / Business Registration">
                      GSTIN / Business Registration Certificate
                    </option>
                    <option value="Visiting Card / Letterhead">
                      Store Visiting Card / Letterhead
                    </option>
                    <option value="BIS Hallmark Registration">
                      BIS Hallmark License Document
                    </option>
                    <option value="Trade License">Municipal Trade License</option>
                  </select>
                </div>

                {/* --- Dynamic Verification Input Field based on Selected Proof --- */}
                {claimForm.proofType === "GSTIN / Business Registration" && (
                  <div className="form-group">
                    <label>15-Digit GSTIN Number *</label>
                    <input
                      type="text"
                      required
                      maxLength={15}
                      placeholder="e.g. 29AAAAA0000A1Z5"
                      value={claimForm.proofDocUrl}
                      onChange={(e) =>
                        setClaimForm({
                          ...claimForm,
                          proofDocUrl: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "")
                        })
                      }
                      style={{
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                        fontFamily: "monospace",
                        fontWeight: 600
                      }}
                    />
                    <div style={{ marginTop: "6px", display: "flex", alignItems: "center", gap: "6px", fontSize: "11.5px", color: "#065f46", backgroundColor: "#ecfdf5", border: "1px solid #a7f3d0", padding: "6px 10px", borderRadius: "6px" }}>
                      <span>✓ <strong>No document upload needed!</strong> Simply enter your 15-digit GST number. Our verification team will verify it directly on the official Government GST portal.</span>
                    </div>
                  </div>
                )}

                {claimForm.proofType === "Visiting Card / Letterhead" && (
                  <div className="form-group">
                    <label>Visiting Card Photo Link or Document URL *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Google Drive link, Imgur, or cloud link"
                      value={claimForm.proofDocUrl}
                      onChange={(e) =>
                        setClaimForm({ ...claimForm, proofDocUrl: e.target.value })
                      }
                    />
                    <span style={{ fontSize: "11.5px", color: "#6b7280", marginTop: "4px", display: "block" }}>
                      Please provide a shareable link to a photo of your showroom business card or company letterhead.
                    </span>
                  </div>
                )}

                {claimForm.proofType === "BIS Hallmark Registration" && (
                  <div className="form-group">
                    <label>BIS Hallmark License Number or Document Link *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. HM/C - 7894561 or Document URL"
                      value={claimForm.proofDocUrl}
                      onChange={(e) =>
                        setClaimForm({ ...claimForm, proofDocUrl: e.target.value })
                      }
                    />
                    <span style={{ fontSize: "11.5px", color: "#6b7280", marginTop: "4px", display: "block" }}>
                      Enter your Bureau of Indian Standards (BIS) hallmark center license number or certificate link.
                    </span>
                  </div>
                )}

                {claimForm.proofType === "Trade License" && (
                  <div className="form-group">
                    <label>Municipal Trade License Number or Document Link *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. TL-2024-XXXX or Document link"
                      value={claimForm.proofDocUrl}
                      onChange={(e) =>
                        setClaimForm({ ...claimForm, proofDocUrl: e.target.value })
                      }
                    />
                    <span style={{ fontSize: "11.5px", color: "#6b7280", marginTop: "4px", display: "block" }}>
                      Enter your Municipal Trade License / Shop & Establishment Act number or document link.
                    </span>
                  </div>
                )}

                <div className="form-group">
                  <label>Notes or Updates Requested</label>
                  <textarea
                    rows={3}
                    placeholder="Describe changes or additions you would like to make..."
                    value={claimForm.notes}
                    onChange={(e) =>
                      setClaimForm({ ...claimForm, notes: e.target.value })
                    }
                  />
                </div>

                <div className="modal-actions-footer">
                  <button
                    type="button"
                    className="modal-cancel-btn"
                    onClick={() => setIsClaimModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="modal-primary-btn"
                    disabled={isSubmittingClaim}
                  >
                    {isSubmittingClaim ? (
                      <>
                        <Loader2 size={16} className="spin-icon" /> Submitting...
                      </>
                    ) : (
                      <>
                        <Send size={15} /> Submit Claim Request
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* --- Report Incorrect Details Modal --- */}
      {isReportModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsReportModalOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-wrap">
                <AlertTriangle size={22} className="modal-icon report-color" />
                <div>
                  <h3>Report Incorrect Details</h3>
                  <p className="modal-subtitle">{store.storeName}</p>
                </div>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setIsReportModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            {reportSuccessMessage ? (
              <div className="modal-success-state">
                <CheckCircle2 size={48} className="success-icon" />
                <h4>Report Submitted!</h4>
                <p>{reportSuccessMessage}</p>
                <button
                  type="button"
                  className="modal-primary-btn"
                  onClick={() => setIsReportModalOpen(false)}
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="modal-form">
                {reportError && <div className="modal-error-alert">{reportError}</div>}

                <div className="form-group">
                  <label>What needs correction? *</label>
                  <select
                    value={reportForm.reportType}
                    onChange={(e) =>
                      setReportForm({ ...reportForm, reportType: e.target.value })
                    }
                  >
                    <option value="Incorrect Contact / Phone">
                      Wrong Phone Number or WhatsApp
                    </option>
                    <option value="Wrong Address / Pin Code">
                      Incorrect Address or Map Location
                    </option>
                    <option value="Store Permanently Closed">
                      Store Has Closed or Relocated
                    </option>
                    <option value="Expired or Inaccurate Offer">
                      Expired or Inaccurate Offer Listed
                    </option>
                    <option value="Wrong Timings or Holiday">
                      Incorrect Opening Hours / Holiday
                    </option>
                    <option value="Other">Other Issues</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Please describe the correct details *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Provide details about the error and what the correct information should be..."
                    value={reportForm.description}
                    onChange={(e) =>
                      setReportForm({ ...reportForm, description: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Your Email (Optional, if you wish to receive updates)</label>
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    value={reportForm.reportedByEmail}
                    onChange={(e) =>
                      setReportForm({ ...reportForm, reportedByEmail: e.target.value })
                    }
                  />
                </div>

                <div className="modal-actions-footer">
                  <button
                    type="button"
                    className="modal-cancel-btn"
                    onClick={() => setIsReportModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="modal-primary-btn"
                    disabled={isSubmittingReport}
                  >
                    {isSubmittingReport ? (
                      <>
                        <Loader2 size={16} className="spin-icon" /> Submitting...
                      </>
                    ) : (
                      <>
                        <Send size={15} /> Submit Report
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreProfile;
