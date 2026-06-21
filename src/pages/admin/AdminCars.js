import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../api';
import { imageUrl } from '../../api/imageUrl';

const EMPTY_FORM = { brand: '', model: '', year: '', price: '', mileage: '', condition: 'used', description: '', category: '', is_available: true, image: null };

export default function AdminCars() {
  const [cars, setCars] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchCars = () => {
    setLoading(true);
    api.get('cars/').then(res => setCars(res.data.results || res.data)).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCars();
    api.get('categories/').then(res => setCategories(res.data.results || res.data));
  }, []);

  const openAdd = () => { setForm(EMPTY_FORM); setEditing(null); setShowModal(true); };

  const openEdit = car => {
    setForm({ ...car, image: null });
    setEditing(car.id);
    setShowModal(true);
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this car?')) return;
    await api.delete(`cars/${id}/`);
    fetchCars();
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => { if (v !== null && v !== '') data.append(k, v); });
    try {
      if (editing) {
        await api.patch(`cars/${editing}/`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('cars/', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      setShowModal(false);
      fetchCars();
    } catch (err) {
      alert('Error saving car. Check all fields.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <h1>Cars Management</h1>
        <div className="admin-table-wrap">
          <div className="admin-table-header">
            <h2>All Cars ({cars.length})</h2>
            <button className="btn btn-primary btn-sm" onClick={openAdd}>➕ Add Car</button>
          </div>
          {loading
            ? <div className="loading">Loading...</div>
            : <table>
                <thead>
                  <tr>
                    <th>Image</th><th>Car</th><th>Price</th><th>Condition</th><th>Year</th><th>Available</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cars.map(car => (
                    <tr key={car.id}>
                      <td>{car.image ? <img src={imageUrl(car.image)} alt="" /> : '🚗'}</td>
                      <td><strong>{car.brand} {car.model}</strong></td>
                      <td>KSh {Number(car.price).toLocaleString()}</td>
                      <td><span className={`badge ${car.condition}`}>{car.condition}</span></td>
                      <td>{car.year}</td>
                      <td>{car.is_available ? '✅' : '❌'}</td>
                      <td>
                        <button className="btn btn-sm btn-secondary" onClick={() => openEdit(car)} style={{ marginRight: '8px' }}>✏️ Edit</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(car.id)}>🗑️ Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
          }
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <h2>{editing ? 'Edit Car' : 'Add New Car'}</h2>
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label>Brand</label>
                    <input required value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} placeholder="Toyota" />
                  </div>
                  <div className="form-group">
                    <label>Model</label>
                    <input required value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} placeholder="Corolla" />
                  </div>
                  <div className="form-group">
                    <label>Year</label>
                    <input required type="number" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} placeholder="2020" />
                  </div>
                  <div className="form-group">
                    <label>Price (KSh)</label>
                    <input required type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="1500000" />
                  </div>
                  <div className="form-group">
                    <label>Mileage (km)</label>
                    <input required type="number" value={form.mileage} onChange={e => setForm({ ...form, mileage: e.target.value })} placeholder="50000" />
                  </div>
                  <div className="form-group">
                    <label>Condition</label>
                    <select value={form.condition} onChange={e => setForm({ ...form, condition: e.target.value })}>
                      <option value="new">New</option>
                      <option value="used">Used</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                      <option value="">Select Category</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Available</label>
                    <select value={form.is_available} onChange={e => setForm({ ...form, is_available: e.target.value === 'true' })}>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Car description..." />
                </div>
                <div className="form-group">
                  <label>Main Image</label>
                  <input type="file" accept="image/*" onChange={e => setForm({ ...form, image: e.target.files[0] })} />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : editing ? 'Update Car' : 'Add Car'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
