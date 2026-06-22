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
            <div style={{ marginTop: '12px', display: 'flex', gap: '12px' }}>
              <a href="https://www.instagram.com/korirwilmark?igsh=dGZkdzljbTd3M2di" target="_blank" rel="noreferrer" style={{ color: '#e94560', fontSize: '20px' }}>📸</a>
              <a href="https://www.facebook.com/profile.php?id=61584923624584" target="_blank" rel="noreferrer" style={{ color: '#e94560', fontSize: '20px' }}>👥</a>
              <a href="https://wa.me/qr/DK5VP3S2RE2EO1" target="_blank" rel="noreferrer" style={{ color: '#e94560', fontSize: '20px' }}>💬</a>
            </div>
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
            <p>📞 <a href="tel:+254705387545">+254 705 387 545</a></p>
            <p>✉️ <a href="mailto:wilmarkkorir@gmail.com">wilmarkkorir@gmail.com</a></p>
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
