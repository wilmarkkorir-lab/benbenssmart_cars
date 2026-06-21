import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const links = [
    { to: '/', label: 'Home' },
    { to: '/cars', label: 'Cars' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <header className="navbar">
      <div className="container">
        <Link to="/" className="logo">🚗 BenBens Smart Cars</Link>

        {/* Desktop Nav */}
        <nav className="nav-desktop">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={location.pathname === link.to ? 'nav-active' : ''}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/admin/login" className="nav-admin-btn">Admin</Link>
        </nav>

        {/* Mobile Hamburger */}
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="nav-mobile">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={location.pathname === link.to ? 'nav-active' : ''}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/admin/login" onClick={() => setMenuOpen(false)} className="nav-admin-btn">
            Admin
          </Link>
        </div>
      )}
    </header>
  );
}
