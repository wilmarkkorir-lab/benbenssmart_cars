import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <h4>🚗 BenBens Smart Cars</h4>
            <p>Your trusted partner for quality new and used vehicles. We make car buying simple, transparent and affordable.</p>
          </div>
          <div>
            <h4>Quick Links</h4>
            <Link to="/">Home</Link><br />
            <Link to="/cars">Browse Cars</Link><br />
            <Link to="/contact">Contact Us</Link>
          </div>
          <div>
            <h4>Contact</h4>
            <p>📍 Nairobi, Kenya</p>
            <p>📞 +254 700 000 000</p>
            <p>✉️ info@benbenssmartcars.com</p>
            <p>🕒 Mon–Sat: 8am – 6pm</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} BenBens Smart Cars. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
