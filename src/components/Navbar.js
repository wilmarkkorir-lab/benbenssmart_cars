import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="container">
        <Link to="/" className="logo">🚗 BenBens Smart Cars</Link>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/cars">Cars</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/admin/login" style={{ color: '#e94560' }}>Admin</Link>
        </nav>
      </div>
    </header>
  );
}
