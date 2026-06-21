import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import CarCard from '../components/CarCard';

const TYPING_WORDS = ['Dream Car', 'Perfect SUV', 'Family Sedan', 'Luxury Ride', 'Budget Car'];

export default function Home() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wordIndex, setWordIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  // Typing animation
  useEffect(() => {
    const word = TYPING_WORDS[wordIndex];
    let timeout;
    if (!deleting && displayed.length < word.length) {
      timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 100);
    } else if (!deleting && displayed.length === word.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 60);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setWordIndex(i => (i + 1) % TYPING_WORDS.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, wordIndex]);

  useEffect(() => {
    api.get('cars/?ordering=-created_at')
      .then(res => setCars(res.data.results || res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg-overlay" />
        <div className="container hero-inner">
          <div className="hero-badge">🏆 Kenya's #1 Car Dealership</div>
          <h1>
            Find Your <br />
            <span className="typing-text">{displayed}<span className="cursor">|</span></span>
          </h1>
          <p>Browse hundreds of quality new and used vehicles at unbeatable prices. Trusted by over 1,200 happy customers across Kenya.</p>
          <div className="hero-buttons">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/cars')}>
              🚗 Browse Cars
            </button>
            <button className="btn btn-outline btn-lg" onClick={() => navigate('/contact')}>
              📞 Contact Us
            </button>
          </div>
          <div className="hero-features">
            <div className="hero-feature">✅ Verified Cars</div>
            <div className="hero-feature">✅ Best Prices</div>
            <div className="hero-feature">✅ Easy Financing</div>
            <div className="hero-feature">✅ After-Sale Support</div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats-bar">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon">🚗</div>
              <h2>500+</h2>
              <p>Cars Available</p>
            </div>
            <div className="stat-item">
              <div className="stat-icon">😊</div>
              <h2>1,200+</h2>
              <p>Happy Customers</p>
            </div>
            <div className="stat-item">
              <div className="stat-icon">🏅</div>
              <h2>10+</h2>
              <p>Years Experience</p>
            </div>
            <div className="stat-item">
              <div className="stat-icon">🌍</div>
              <h2>50+</h2>
              <p>Car Brands</p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="section why-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose <span>BenBens?</span></h2>
            <p className="section-subtitle">We make car buying simple, transparent and enjoyable</p>
          </div>
          <div className="why-grid">
            <div className="why-card">
              <div className="why-icon">🔍</div>
              <h3>Verified Listings</h3>
              <p>Every car is thoroughly inspected and verified before listing.</p>
            </div>
            <div className="why-card">
              <div className="why-icon">💰</div>
              <h3>Best Prices</h3>
              <p>Competitive pricing with flexible payment and financing options.</p>
            </div>
            <div className="why-card">
              <div className="why-icon">🤝</div>
              <h3>Trusted Dealer</h3>
              <p>Over 10 years of experience and thousands of satisfied customers.</p>
            </div>
            <div className="why-card">
              <div className="why-icon">🛡️</div>
              <h3>After-Sale Support</h3>
              <p>We stand behind every sale with full after-purchase support.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED CARS */}
      <section className="section featured-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured <span>Cars</span></h2>
            <p className="section-subtitle">Hand-picked vehicles just for you</p>
          </div>
          {loading
            ? <div className="loading"><div className="spinner" />Loading cars...</div>
            : cars.length === 0
              ? <div className="empty">No cars available yet. Check back soon!</div>
              : <>
                  <div className="car-grid">
                    {cars.slice(0, 6).map(car => <CarCard key={car.id} car={car} />)}
                  </div>
                  <div style={{ textAlign: 'center', marginTop: '40px' }}>
                    <button className="btn btn-primary btn-lg" onClick={() => navigate('/cars')}>
                      View All Cars →
                    </button>
                  </div>
                </>
          }
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="cta-banner">
        <div className="container cta-inner">
          <div>
            <h2>Ready to find your perfect car?</h2>
            <p>Talk to our experts today — we'll help you find the right fit for your budget.</p>
          </div>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/contact')}>
            Get In Touch 📞
          </button>
        </div>
      </section>
    </>
  );
}
