import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../api';

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [customers, setCustomers] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchInquiries = () => {
    setLoading(true);
    Promise.all([
      api.get('inquiries/'),
      api.get('customers/'),
    ]).then(([inqRes, custRes]) => {
      setInquiries(inqRes.data.results || inqRes.data);
      // Build customer lookup map by id
      const custMap = {};
      (custRes.data.results || custRes.data).forEach(c => { custMap[c.id] = c; });
      setCustomers(custMap);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchInquiries(); }, []);

  const toggleResolved = async (inquiry) => {
    await api.patch(`inquiries/${inquiry.id}/`, { is_resolved: !inquiry.is_resolved });
    fetchInquiries();
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this inquiry?')) return;
    await api.delete(`inquiries/${id}/`);
    fetchInquiries();
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <h1>Inquiries</h1>
        <div className="admin-table-wrap">
          <div className="admin-table-header">
            <h2>All Inquiries ({inquiries.length})</h2>
          </div>
          {loading
            ? <div className="loading">Loading...</div>
            : inquiries.length === 0
              ? <div className="empty">No inquiries yet.</div>
              : <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Car</th>
                      <th>Message</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inquiries.map(inq => {
                      const customer = customers[inq.customer] || {};
                      return (
                        <tr key={inq.id}>
                          <td><strong>{customer.name || '-'}</strong></td>
                          <td>
                            <a href={`mailto:${customer.email}`} style={{ color: '#e94560' }}>
                              {customer.email || '-'}
                            </a>
                          </td>
                          <td>
                            <a href={`https://wa.me/${customer.phone?.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" style={{ color: '#25D366' }}>
                              📱 {customer.phone || '-'}
                            </a>
                          </td>
                          <td>{inq.car ? `Car #${inq.car}` : 'General'}</td>
                          <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={inq.message}>
                            {inq.message}
                          </td>
                          <td>{new Date(inq.created_at).toLocaleDateString()}</td>
                          <td>
                            <span className={`badge ${inq.is_resolved ? '' : 'used'}`}>
                              {inq.is_resolved ? '✅ Resolved' : '⏳ Pending'}
                            </span>
                          </td>
                          <td>
                            <button className="btn btn-sm btn-success" onClick={() => toggleResolved(inq)} style={{ marginRight: '6px' }}>
                              {inq.is_resolved ? 'Reopen' : 'Resolve'}
                            </button>
                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(inq.id)}>🗑️</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
          }
        </div>
      </div>
    </div>
  );
}
