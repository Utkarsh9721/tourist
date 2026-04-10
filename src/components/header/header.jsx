// src/components/Header.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './header.css';
import Logo from '../../assets/logo.png';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState('up');
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    // Prevent body scroll when menu is open on mobile
    if (!menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  };

  const closeMenu = () => {
    setMenuOpen(false);
    document.body.style.overflow = 'unset';
  };

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Check if scrolled
      if (currentScrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
      
      // Check scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setScrollDirection('down');
      } else {
        setScrollDirection('up');
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.body.style.overflow = 'unset';
    };
  }, [lastScrollY]);

  // Close menu on route change
  useEffect(() => {
    closeMenu();
  }, [location]);

  // Check if link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''} ${scrollDirection === 'down' ? 'scroll-down' : 'scroll-up'}`}>
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="logo-section" onClick={closeMenu}>
          <img src={Logo} alt="TransXs Logo" className="logo" />
          <h2 className="site-name">TransXs</h2>
        </Link>

        {/* Three Dots Menu */}
        <div className={`menu-icon ${menuOpen ? 'active' : ''}`} onClick={toggleMenu} role="button" aria-label="Menu">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>

        {/* Navigation */}
        <nav className={`navbar ${menuOpen ? 'active' : ''}`}>
          {menuOpen && (
            <button className="close-menu" onClick={closeMenu} aria-label="Close menu">
              ✕
            </button>
          )}
          <Link to="/" className={isActive('/') ? 'active' : ''} onClick={closeMenu}>
            Home
          </Link>
          <Link to="/travels" className={isActive('/travels') ? 'active' : ''} onClick={closeMenu}>
            Travels
          </Link>
          <Link to="/find" className={isActive('/find') ? 'active' : ''} onClick={closeMenu}>
            Find Places
          </Link>
          <Link to="/book" className={isActive('/book') ? 'active' : ''} onClick={closeMenu}>
            Book Places
          </Link>
          <Link to="/guides" className={isActive('/guides') ? 'active' : ''} onClick={closeMenu}>
            Guides
          </Link>
          <Link to="/history" className={isActive('/history') ? 'active' : ''} onClick={closeMenu}>
            History
          </Link>
          <Link to="/about" className={isActive('/about') ? 'active' : ''} onClick={closeMenu}>
            About Us
          </Link>
          <Link to="/contact" className={isActive('/contact') ? 'active' : ''} onClick={closeMenu}>
            Contact Us
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
