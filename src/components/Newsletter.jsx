import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import './Newsletter.css';

const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [accepted, setAccepted] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!email) {
            setMessage('Email address is required');
            return;
        }

        if (!accepted) {
            setMessage('Please accept the terms and privacy policy');
            return;
        }

        // Here you would typically send the email to your backend
        console.log('Newsletter subscription:', email);
        setMessage('Thank you for subscribing!');
        setEmail('');
        setAccepted(false);

        // Clear success message after 3 seconds
        setTimeout(() => {
            setMessage('');
        }, 3000);
    };

    return (
        <section className="newsletter-section">
            <div className="container">
                <div className="newsletter-container">
                    <div className="newsletter-content">
                        <h2 className="newsletter-title">Join Our Newsletter Now!</h2>
                        <p className="newsletter-subtitle">
                            Be the first to know about new designs, events, and more!
                        </p>
                    </div>

                    <form className="newsletter-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <div className="input-wrapper">
                                <Mail className="input-icon" size={20} />
                                <input
                                    type="email"
                                    placeholder="Enter Your Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="newsletter-input"
                                />
                            </div>
                            <button type="submit" className="newsletter-btn">
                                SIGN UP
                            </button>
                        </div>

                        <div className="checkbox-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={accepted}
                                    onChange={(e) => setAccepted(e.target.checked)}
                                    className="checkbox-input"
                                />
                                <span className="checkbox-text">
                                    I accept the general conditions and the privacy policy
                                </span>
                            </label>
                        </div>

                        {message && (
                            <div className={`message ${message.includes('Thank you') ? 'success' : 'error'}`}>
                                {message}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Newsletter;
