import React, { useState } from 'react';
import api from '../api';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      // Get or create customer by email
      let customerId;
      try {
        const customerRes = await api.post('customers/', {
          name: form.name,
          email: form.email,
          phone: form.phone,
        });
        customerId = customerRes.data.id;
      } catch (customerErr) {
        // If email already exists, fetch the existing customer
        if (customerErr.response?.data?.email) {
          const existing = await api.get(`customers/?email=${form.email}`);
          const customers = existing.data.results || existing.data;
          if (customers.length > 0) {
            customerId = customers[0].id;
          } else {
            throw customerErr;
          }
        } else {
          throw customerErr;
        }
      }

      // Save inquiry
      await api.post('inquiries/', {
        customer: customerId,
        message: form.message,
      });

      setSent(true);
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      console.error('Contact form error:', err.response?.data || err.message);
      setError('Failed to send message. Please contact us directly via WhatsApp or Email.');
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: '700px' }}>
        <h2 className="section-title">Contact <span>Us</span></h2>
        <p className="section-subtitle">We'd love to hear from you. Send us a message!</p>

        {/* Contact Info Cards */}
        <div className="contact-cards">
          <a href="mailto:wilmarkkorir@gmail.com" className="contact-card">
            <span className="contact-icon">✉️</span>
            <div>
              <div className="contact-label">Email</div>
              <div className="contact-value">wilmarkkorir@gmail.com</div>
            </div>
          </a>
          <a href="tel:+254705387545" className="contact-card">
            <span className="contact-icon">📞</span>
            <div>
              <div className="contact-label">Phone / WhatsApp</div>
              <div className="contact-value">+254 705 387 545</div>
            </div>
          </a>
          <a href="https://wa.me/qr/DK5VP3S2RE2EO1" target="_blank" rel="noreferrer" className="contact-card">
            <span className="contact-icon">💬</span>
            <div>
              <div className="contact-label">WhatsApp</div>
              <div className="contact-value">Chat with us</div>
            </div>
          </a>
          <a href="https://www.instagram.com/korirwilmark?igsh=dGZkdzljbTd3M2di" target="_blank" rel="noreferrer" className="contact-card">
            <span className="contact-icon">📸</span>
            <div>
              <div className="contact-label">Instagram</div>
              <div className="contact-value">@korirwilmark</div>
            </div>
          </a>
          <a href="https://www.facebook.com/profile.php?id=61584923624584" target="_blank" rel="noreferrer" className="contact-card">
            <span className="contact-icon">👥</span>
            <div>
              <div className="contact-label">Facebook</div>
              <div className="contact-value">BenBens Smart Cars</div>
            </div>
          </a>
          <div className="contact-card">
            <span className="contact-icon">📍</span>
            <div>
              <div className="contact-label">Location</div>
              <div className="contact-value">Nairobi, Kenya</div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="inquiry-form" style={{ marginTop: '32px' }}>
          <h3>📩 Send Us a Message</h3>
          <p style={{ fontSize: '13px', color: '#888', marginBottom: '16px' }}>Fill the form below and we'll get back to you shortly.</p>
          {sent && <div className="success-msg">✅ Message sent! We'll contact you shortly via email or WhatsApp.</div>}
          {error && <div className="error-msg">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="John Doe" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="john@example.com" />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+254 700 000 000" />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="How can we help you?" />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={sending}>
              {sending ? 'Sending...' : 'Send Message 📩'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
