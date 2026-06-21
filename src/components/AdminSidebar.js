import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(true);

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
    <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <button className="admin-menu-toggle" onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? '☰ Menu' : '✕ Close Menu'}
      </button>
      <div className="admin-sidebar-links">
        <div className="sidebar-logo">🚗 BenBens Admin</div>
        {links.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={location.pathname === link.to ? 'active' : ''}
            onClick={() => setCollapsed(true)}
          >
            {link.label}
          </Link>
        ))}
        <Link to="/" onClick={() => setCollapsed(true)}>🌐 View Site</Link>
        <button
          onClick={logout}
          style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '14px', padding: '13px 24px', textAlign: 'left', width: '100%' }}
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}
