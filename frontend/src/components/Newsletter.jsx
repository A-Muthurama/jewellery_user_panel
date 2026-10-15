import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import './Newsletter.css';

const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [accepted, setAccepted] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!email || !email.trim()) {
            setStatus({ type: 'error', message: 'Please enter a valid email address.' });
            return;
        }

        if (!accepted) {
            setStatus({
                type: 'error',
                message: 'Please accept the terms and privacy policy to continue.'
            });
            return;
        }

        // Mock subscription handling
        console.log('Newsletter subscription:', email);
        setStatus({
            type: 'success',
            message: 'Thank you for subscribing! Check your inbox for exclusive updates.'
        });
        setEmail('');
        setAccepted(false);

        // Clear status after 4 seconds
        setTimeout(() => {
            setStatus({ type: '', message: '' });
        }, 4000);
    };

    return (
        <section className="newsletter-section">
            <div className="container">
                <div className="newsletter-container">
                    {/* Left: Heading & Subtitle */}
                    <div className="newsletter-content">
                        <span className="newsletter-tag">Exclusive Privilege Club</span>
                        <h2 className="newsletter-title">Join Our Newsletter</h2>
                        <p className="newsletter-subtitle">
                            Be the first to discover new showroom arrivals, exclusive gold & diamond offers, and private festive collections.
                        </p>
                    </div>

                    {/* Right: Modern Luxury Subscription Form */}
                    <div className="newsletter-form-wrapper">
                        <form className="newsletter-form" onSubmit={handleSubmit}>
                            <div className="newsletter-input-pill">
                                <div className="newsletter-icon-container">
                                    <Mail className="newsletter-mail-icon" size={20} />
                                </div>
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (status.type) setStatus({ type: '', message: '' });
                                    }}
                                    className="newsletter-text-input"
                                    required
                                />
                                <button type="submit" className="newsletter-submit-btn">
                                    <span>SUBSCRIBE</span>
                                    <ArrowRight size={16} />
                                </button>
                            </div>

                            {/* Checkbox consent */}
                            <div className="newsletter-consent-row">
                                <label className="newsletter-consent-label">
                                    <input
                                        type="checkbox"
                                        checked={accepted}
                                        onChange={(e) => {
                                            setAccepted(e.target.checked);
                                            if (status.type) setStatus({ type: '', message: '' });
                                        }}
                                        className="newsletter-checkbox"
                                    />
                                    <span className="newsletter-consent-text">
                                        I accept the general conditions and the privacy policy
                                    </span>
                                </label>
                            </div>

                            {/* Status notification */}
                            {status.message && (
                                <div className={`newsletter-status-alert ${status.type}`}>
                                    {status.type === 'success' ? (
                                        <CheckCircle2 size={18} />
                                    ) : (
                                        <AlertCircle size={18} />
                                    )}
                                    <span>{status.message}</span>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Newsletter;
