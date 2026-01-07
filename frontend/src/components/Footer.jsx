import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer-section">
            <div className="container">
                <div className="footer-content">
                    {/* Column 1: Brand Info */}
                    <div className="footer-col">
                        <h3>Project J</h3>
                        <p className="brand-desc">
                            Experience the finest craftsmanship with our premium jewellery collection.
                            Designed for elegance, crafted for you.
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
                                <span>123 Gold Street, Jewellery District, NY</span>
                            </li>
                            <li>
                                <Phone size={18} />
                                <span>+1 234 567 8900</span>
                            </li>
                            <li>
                                <Mail size={18} />
                                <span>contact@projectj.com</span>
                            </li>
                        </ul>

                        <div className="social-links">
                            <a href="#" className="social-icon" aria-label="Facebook">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="social-icon" aria-label="Instagram">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="social-icon" aria-label="Twitter">
                                <Twitter size={20} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Project J. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
