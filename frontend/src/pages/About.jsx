import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './Privacy.css'; // Reusing legal page styles for consistency

const About = () => {
    return (
        <div className="legal-page">
            <div className="container section">
                <Link to="/" className="back-link">
                    <ArrowLeft size={18} /> Back to Home
                </Link>

                <h1 className="page-title">About Us</h1>

                <div className="legal-content">
                    <p className="intro-text">
                        JEWELLERS PARADISE is a curated platform dedicated exclusively to gold jewellery offers from trusted jewellers across India. We bring together verified stores and compelling deals in one refined destination, helping customers discover value without compromising on authenticity or elegance.
                    </p>

                    <p>
                        Our mission is simple: to make gold buying smarter, more transparent, and more rewarding—by connecting discerning buyers with jewellers they can trust.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default About;
