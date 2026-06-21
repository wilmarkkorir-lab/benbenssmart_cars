import React, { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: '600px' }}>
        <h2 className="section-title">Contact <span>Us</span></h2>
        {sent && <div className="success-msg">✅ Message sent! We'll get back to you soon.</div>}
        <div className="inquiry-form">
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
              <label>Message</label>
              <textarea required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="How can we help you?" />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Send Message</button>
          </form>
        </div>
        <div style={{ marginTop: '40px', lineHeight: '2.2', color: '#555' }}>
          <p>📍 Nairobi, Kenya</p>
          <p>📞 +254 700 000 000</p>
          <p>✉️ info@benbenssmartcars.com</p>
          <p>🕒 Mon–Sat: 8am – 6pm</p>
        </div>
      </div>
    </section>
  );
}
