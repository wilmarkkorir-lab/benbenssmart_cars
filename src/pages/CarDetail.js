import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { imageUrl } from '../api/imageUrl';

export default function CarDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`cars/${id}/`)
      .then(res => setCar(res.data))
      .catch(() => navigate('/cars'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const customerRes = await api.post('customers/', {
        name: form.name, email: form.email, phone: form.phone,
      });
      await api.post('inquiries/', {
        car: id, customer: customerRes.data.id, message: form.message,
      });
      setSubmitted(true);
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch {
      alert('Failed to send inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!car) return null;

  return (
    <section className="car-detail">
      <div className="container">
        <button onClick={() => navigate('/cars')} style={{ marginBottom: '24px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '15px', color: '#e94560' }}>
          ← Back to Cars
        </button>
        <div className="car-detail-grid">
          <div>
            {car.image
              ? <img src={imageUrl(car.image)} alt={car.model} />
              : <div className="car-card-placeholder" style={{ height: '320px', borderRadius: '10px', fontSize: '80px' }}>🚗</div>
            }
            {car.images?.length > 0 && (
              <div style={{ display: 'flex', gap: '10px', marginTop: '12px', flexWrap: 'wrap' }}>
                {car.images.map(img => (
                  <img key={img.id} src={imageUrl(img.image)} alt="" style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} />
                ))}
              </div>
            )}
          </div>
          <div>
            <div className="car-detail-info">
              <h1>{car.year} {car.brand} {car.model}</h1>
              <div className="price">KSh {Number(car.price).toLocaleString()}</div>
              <div className="car-specs">
                <div className="spec-item"><label>Condition</label><span style={{ textTransform: 'capitalize' }}>{car.condition}</span></div>
                <div className="spec-item"><label>Year</label><span>{car.year}</span></div>
                <div className="spec-item"><label>Mileage</label><span>{Number(car.mileage).toLocaleString()} km</span></div>
                <div className="spec-item"><label>Category</label><span>{car.category_name || '—'}</span></div>
              </div>
              {car.description && <p className="car-description">{car.description}</p>}
            </div>
            <div className="inquiry-form">
              <h3>📩 Inquire About This Car</h3>
              {submitted && <div className="success-msg">✅ Inquiry sent! We'll contact you shortly.</div>}
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
                  <textarea required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="I'm interested in this car..." />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={submitting}>
                  {submitting ? 'Sending...' : 'Send Inquiry'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
