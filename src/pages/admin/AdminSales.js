import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../api';

const EMPTY_FORM = { car: '', customer: '', sale_price: '', payment_method: 'cash', notes: '' };

export default function AdminSales() {
  const [sales, setSales] = useState([]);
  const [cars, setCars] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSales = () => {
    setLoading(true);
    api.get('sales/').then(res => setSales(res.data.results || res.data)).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSales();
    api.get('cars/').then(res => setCars(res.data.results || res.data));
    api.get('customers/').then(res => setCustomers(res.data.results || res.data));
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('sales/', form);
      setShowModal(false);
      setForm(EMPTY_FORM);
      fetchSales();
    } catch {
      alert('Error recording sale. Make sure car is not already sold.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this sale record?')) return;
    await api.delete(`sales/${id}/`);
    fetchSales();
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <h1>Sales</h1>
        <div className="admin-table-wrap">
          <div className="admin-table-header">
            <h2>All Sales ({sales.length})</h2>
            <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>➕ Record Sale</button>
          </div>
          {loading
            ? <div className="loading">Loading...</div>
            : sales.length === 0
              ? <div className="empty">No sales recorded yet.</div>
              : <table>
                  <thead>
                    <tr><th>Car</th><th>Customer</th><th>Sale Price</th><th>Payment</th><th>Date</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {sales.map(sale => (
                      <tr key={sale.id}>
                        <td>{sale.car_name || `Car #${sale.car}`}</td>
                        <td>{sale.customer_name || `Customer #${sale.customer}`}</td>
                        <td>KSh {Number(sale.sale_price).toLocaleString()}</td>
                        <td style={{ textTransform: 'capitalize' }}>{sale.payment_method.replace('_', ' ')}</td>
                        <td>{sale.sale_date}</td>
                        <td>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDelete(sale.id)}>🗑️</button>
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
              <h2>Record New Sale</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Car</label>
                  <select required value={form.car} onChange={e => setForm({ ...form, car: e.target.value })}>
                    <option value="">Select Car</option>
                    {cars.map(c => <option key={c.id} value={c.id}>{c.year} {c.brand} {c.model}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Customer</label>
                  <select required value={form.customer} onChange={e => setForm({ ...form, customer: e.target.value })}>
                    <option value="">Select Customer</option>
                    {customers.map(c => <option key={c.id} value={c.id}>{c.name} — {c.phone}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Sale Price (KSh)</label>
                  <input required type="number" value={form.sale_price} onChange={e => setForm({ ...form, sale_price: e.target.value })} placeholder="1500000" />
                </div>
                <div className="form-group">
                  <label>Payment Method</label>
                  <select value={form.payment_method} onChange={e => setForm({ ...form, payment_method: e.target.value })}>
                    <option value="cash">Cash</option>
                    <option value="installment">Installment</option>
                    <option value="bank_transfer">Bank Transfer</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Notes</label>
                  <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Any additional notes..." />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Record Sale'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
