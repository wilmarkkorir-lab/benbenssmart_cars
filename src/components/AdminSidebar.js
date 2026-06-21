import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { to: '/admin', label: '📊 Dashboard' },
    { to: '/admin/cars', label: '🚗 Cars' },
    { to: '/admin/inquiries', label: '📩 Inquiries' },
    { to: '/admin/sales', label: '💰 Sales' },
    { to: '/admin/customers', label: '👤 Customers' },
    { to: '/admin/change-password', label: '🔑 Change Password' },
  ];

  const logout = () => {
    localStorage.removeItem('admin_auth');
    navigate('/admin/login');
  };

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-logo">🚗 BenBens Admin</div>
      {links.map(link => (
        <Link
          key={link.to}
          to={link.to}
          className={location.pathname === link.to ? 'active' : ''}
        >
          {link.label}
        </Link>
      ))}
      <div style={{ marginTop: 'auto', padding: '24px 24px 0' }}>
        <Link to="/" style={{ display: 'block', marginBottom: '8px' }}>🌐 View Site</Link>
        <button
          onClick={logout}
          style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: '14px', padding: '12px 0' }}
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}
