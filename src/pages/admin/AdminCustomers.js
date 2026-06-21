import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../api';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('customers/')
      .then(res => setCustomers(res.data.results || res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async id => {
    if (!window.confirm('Delete this customer?')) return;
    await api.delete(`customers/${id}/`);
    setCustomers(customers.filter(c => c.id !== id));
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <h1>Customers</h1>
        <div className="admin-table-wrap">
          <div className="admin-table-header">
            <h2>All Customers ({customers.length})</h2>
          </div>
          {loading
            ? <div className="loading">Loading...</div>
            : customers.length === 0
              ? <div className="empty">No customers yet.</div>
              : <table>
                  <thead>
                    <tr><th>#</th><th>Name</th><th>Email</th><th>Phone</th><th>Joined</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {customers.map((c, i) => (
                      <tr key={c.id}>
                        <td>{i + 1}</td>
                        <td><strong>{c.name}</strong></td>
                        <td>{c.email}</td>
                        <td>{c.phone}</td>
                        <td>{new Date(c.created_at).toLocaleDateString()}</td>
                        <td>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c.id)}>🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
          }
        </div>
      </div>
    </div>
  );
}
