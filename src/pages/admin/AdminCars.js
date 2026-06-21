import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import Toast from '../../components/Toast';
import Loading from '../../components/Loading';
import api from '../../api';
import { imageUrl } from '../../api/imageUrl';

const EMPTY_FORM = { brand: '', model: '', year: '', price: '', mileage: '0', condition: 'used', description: '', category: '', is_available: true, image: null };

export default function AdminCars() {
  const [cars, setCars] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const fetchCars = () => {
    setLoading(true);
    api.get('cars/?is_available=all').then(res => setCars(res.data.results || res.data)).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCars();
    api.get('categories/').then(res => setCategories(res.data.results || res.data));
  }, []);

  const openAdd = () => { 
    setForm(EMPTY_FORM); 
    setEditing(null); 
    setErrors({}); 
    setSubmitError('');
    setShowModal(true); 
  };

  const openEdit = car => {
    setForm({ ...car, image: null });
    setEditing(car.id);
    setErrors({});
    setSubmitError('');
    setShowModal(true);
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this car?')) return;
    try {
      await api.delete(`cars/${id}/`);
      fetchCars();
      setToast({ message: 'Car deleted successfully!', type: 'success' });
    } catch (err) {
      setToast({ message: 'Error deleting car. Please try again.', type: 'error' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const currentYear = new Date().getFullYear();
    
    if (!form.brand?.trim()) newErrors.brand = 'Brand is required';
    if (!form.model?.trim()) newErrors.model = 'Model is required';
    if (!form.year || form.year < 1900 || form.year > currentYear + 1) {
      newErrors.year = `Year must be between 1900 and ${currentYear + 1}`;
    }
    if (!form.price || form.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (form.mileage < 0) newErrors.mileage = 'Mileage cannot be negative';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitError('');
    
    if (!validateForm()) {
      return;
    }
    
    setSaving(true);
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k === 'image' && v === null) return;
      if (k === 'category' && v === '') return;
      data.append(k, v);
    });
    
    try {
      if (editing) {
        await api.patch(`cars/${editing}/`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('cars/', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      setShowModal(false);
      fetchCars();
      setToast({ 
        message: `Car ${editing ? 'updated' : 'added'} successfully!`, 
        type: 'success' 
      });
    } catch (err) {
      console.error('Save error:', err);
      if (err.response?.data) {
        const errorData = err.response.data;
        if (typeof errorData === 'object') {
          const fieldErrors = {};
          Object.entries(errorData).forEach(([field, messages]) => {
            if (Array.isArray(messages)) {
              fieldErrors[field] = messages[0];
            } else {
              fieldErrors[field] = messages;
            }
          });
          setErrors(fieldErrors);
          setSubmitError('Please fix the errors below.');
        } else {
          setSubmitError(errorData.toString());
        }
      } else {
        setSubmitError('Error saving car. Please check your connection and try again.');
      }
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
            ? <Loading text="Loading cars..." />
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
              
              {submitError && (
                <div className="error-msg">{submitError}</div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label>Brand *</label>
                    <input 
                      required 
                      value={form.brand} 
                      onChange={e => setForm({ ...form, brand: e.target.value })} 
                      placeholder="Toyota" 
                      className={errors.brand ? 'error' : ''}
                    />
                    {errors.brand && <span className="field-error">{errors.brand}</span>}
                  </div>
                  <div className="form-group">
                    <label>Model *</label>
                    <input 
                      required 
                      value={form.model} 
                      onChange={e => setForm({ ...form, model: e.target.value })} 
                      placeholder="Corolla" 
                      className={errors.model ? 'error' : ''}
                    />
                    {errors.model && <span className="field-error">{errors.model}</span>}
                  </div>
                  <div className="form-group">
                    <label>Year *</label>
                    <input 
                      required 
                      type="number" 
                      min="1900" 
                      max={new Date().getFullYear() + 1}
                      value={form.year} 
                      onChange={e => setForm({ ...form, year: e.target.value })} 
                      placeholder="2020" 
                      className={errors.year ? 'error' : ''}
                    />
                    {errors.year && <span className="field-error">{errors.year}</span>}
                  </div>
                  <div className="form-group">
                    <label>Price (KSh) *</label>
                    <input 
                      required 
                      type="number" 
                      min="1"
                      step="0.01"
                      value={form.price} 
                      onChange={e => setForm({ ...form, price: e.target.value })} 
                      placeholder="1500000" 
                      className={errors.price ? 'error' : ''}
                    />
                    {errors.price && <span className="field-error">{errors.price}</span>}
                  </div>
                  <div className="form-group">
                    <label>Mileage (km)</label>
                    <input 
                      type="number" 
                      min="0"
                      value={form.mileage} 
                      onChange={e => setForm({ ...form, mileage: e.target.value })} 
                      placeholder="50000" 
                      className={errors.mileage ? 'error' : ''}
                    />
                    {errors.mileage && <span className="field-error">{errors.mileage}</span>}
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
                  <textarea 
                    value={form.description} 
                    onChange={e => setForm({ ...form, description: e.target.value })} 
                    placeholder="Car description..."
                    rows="3"
                  />
                </div>
                <div className="form-group">
                  <label>Main Image</label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={e => setForm({ ...form, image: e.target.files[0] })} 
                  />
                  {editing && !form.image && (
                    <small style={{ color: '#888', fontSize: '12px' }}>Leave empty to keep current image</small>
                  )}
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Saving...' : editing ? 'Update Car' : 'Add Car'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        <Toast 
          message={toast.message} 
          type={toast.type}
          onClose={() => setToast({ message: '', type: 'success' })}
        />
      </div>
    </div>
  );
}
