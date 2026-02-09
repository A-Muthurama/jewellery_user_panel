import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer-section">
            <div className="container">
                <div className="footer-content">
                    {/* Column 1: Brand Info */}
                    <div className="footer-col">
                        <div className="pj-brand">
                            <div className="pj-logo-wrapper">
                                <img src="/icon.png" alt="Jewellers Paradise" className="pj-logo-icon" />
                            </div>
                            <span className="pj-brand-name">JEWELLERS PARADISE</span>
                        </div>
                        <p className="brand-desc">
                            We’re building the world’s gold
                            Online marketplace connecting jewellery shops
                            from India to every corner of the globe.
                            From local artisans to global brands,
                            we make gold online shopping simple, secure, and seamless.
                            One network. Infinite shine.
                        </p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="footer-col">
                        <h3>Quick Links</h3>
                        <ul className="footer-links">
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/privacy">Privacy Policy</Link></li>
                            <li><Link to="/terms">Terms of Service</Link></li>
                            <li><Link to="/offers">Latest Offers</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Contact & Socials */}
                    <div className="footer-col">
                        <h3>Contact Us</h3>
                        <ul className="footer-links">
                            <li>
                                <MapPin size={18} />
                                <span>India</span>
                            </li>
                            <li>
                                <Phone size={18} />
                                <span>+1 234 567 8900</span>
                            </li>
                            <li>
                                <Mail size={18} />
                                <span>contact@jewellersparadise.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} JEWELLERS PARADISE. All rights reserved.</p>
                </div>
            </div>
        </footer >
    );
};

export default Footer;
