import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Gem } from "lucide-react";
import LiveRatesBar from "./LiveRatesBar";
import "./Header.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Offers", path: "/offers" },
    { name: "Regulation", path: "/regulation" },
    { name: "Trending news", path: "/trendingnews" },
  ];

  return (
    <header className="header">
      <div className="container header-content">
        <Link to="/" className="logo">
          <Gem color="var(--color-gold-primary)" size={32} />
          Project J
        </Link>

        <nav className="nav-desktop">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          {/* Theme toggle removed - Forced Light Premium Theme */}

          <button className="btn-vendor" onClick={() =>
    window.open("http://localhost:3000/vendor/login", "_blank")
  }
>
            Join as Partner
          </button>

          <button className="mobile-menu-btn" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div className={`mobile-nav-overlay ${isMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-content">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="mobile-nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <button className="btn-primary" onClick={() => alert("Vendor Panel Coming Soon!")}>
            Join as Vendor
          </button>
        </div>
      </div>

      <LiveRatesBar />
    </header>
  );
};

export default Header;
