import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // Ensure to style your navbar here

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = !isMenuOpen ? 'hidden' : '';
  };

  const handleResize = () => {
    if (window.innerWidth > 768 && isMenuOpen) {
      setIsMenuOpen(false);
      document.body.style.overflow = '';
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = '';
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const handleKeydown = (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        closeMenu();
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    document.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [isMenuOpen]);

  return (
    <div className="body">
      <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
        <div className="navbar-container">
          <div className="logo"><img src="./src/assets/resume.png" alt="Logo" /></div>
          <button
            className={`mobile-nav-toggle ${isMenuOpen ? "active" : ""}`}
            aria-label="Toggle navigation"
            onClick={toggleMenu}
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
          <ul className={`nav-links ${isMenuOpen ? "active" : ""}`}>
            <li><Link to="/" onClick={closeMenu}>Home</Link></li>
            <li><Link to="/create-resume" onClick={closeMenu}>Resume</Link></li>
            <li><Link to="/match-resume" onClick={closeMenu}>Compare</Link></li>
            <li><Link to="/create-email" onClick={closeMenu}>Email</Link></li>
          </ul>
          {isMenuOpen && <div className="overlay" onClick={toggleMenu}></div>}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
