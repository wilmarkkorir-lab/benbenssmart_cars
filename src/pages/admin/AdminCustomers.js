import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../api';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('customers/'),
      api.get('inquiries/'),
    ]).then(([custRes, inqRes]) => {
      setCustomers(custRes.data.results || custRes.data);
      setInquiries(inqRes.data.results || inqRes.data);
    }).finally(() => setLoading(false));
  }, []);

  const handleDelete = async id => {
    if (!window.confirm('Delete this customer?')) return;
    await api.delete(`customers/${id}/`);
    setCustomers(customers.filter(c => c.id !== id));
  };

  const getInquiryCount = (customerId) => 
    inquiries.filter(inq => inq.customer === customerId).length;

  const getLastMessage = (customerId) => {
    const custInquiries = inquiries.filter(inq => inq.customer === customerId);
    if (custInquiries.length === 0) return '-';
    return custInquiries[0].message?.substring(0, 50) + (custInquiries[0].message?.length > 50 ? '...' : '');
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
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Last Message</th>
                      <th>Inquiries</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((c, i) => (
                      <tr key={c.id}>
                        <td>{i + 1}</td>
                        <td><strong>{c.name}</strong></td>
                        <td>
                          <a href={`mailto:${c.email}`} style={{ color: '#e94560' }}>
                            {c.email}
                          </a>
                        </td>
                        <td>
                          <a href={`https://wa.me/${c.phone?.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" style={{ color: '#25D366' }}>
                            📱 {c.phone}
                          </a>
                        </td>
                        <td style={{ maxWidth: '180px', color: '#888', fontSize: '12px' }}>
                          {getLastMessage(c.id)}
                        </td>
                        <td>
                          <span className="badge">{getInquiryCount(c.id)} 💬</span>
                        </td>
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
