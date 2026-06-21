import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ cars: 0, customers: 0, inquiries: 0, sales: 0 });

  useEffect(() => {
    Promise.all([
      api.get('cars/'),
      api.get('customers/'),
      api.get('inquiries/'),
      api.get('sales/'),
    ]).then(([cars, customers, inquiries, sales]) => {
      setStats({
        cars: (cars.data.results || cars.data).length,
        customers: (customers.data.results || customers.data).length,
        inquiries: (inquiries.data.results || inquiries.data).length,
        sales: (sales.data.results || sales.data).length,
      });
    });
  }, []);

  const cards = [
    { icon: '🚗', label: 'Total Cars', value: stats.cars },
    { icon: '👤', label: 'Customers', value: stats.customers },
    { icon: '📩', label: 'Inquiries', value: stats.inquiries },
    { icon: '💰', label: 'Sales', value: stats.sales },
  ];

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <h1>Dashboard</h1>
        <div className="dashboard-grid">
          {cards.map(card => (
            <div className="dash-card" key={card.label}>
              <div className="icon">{card.icon}</div>
              <h3>{card.label}</h3>
              <div className="number">{card.value}</div>
            </div>
          ))}
        </div>
        <div style={{ background: '#fff', padding: '24px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h2 style={{ marginBottom: '12px', fontSize: '18px' }}>Quick Actions</h2>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <a href="/admin/cars" className="btn btn-primary">➕ Add New Car</a>
            <a href="/admin/inquiries" className="btn btn-secondary">📩 View Inquiries</a>
            <a href="/admin/sales" className="btn btn-success">💰 Record Sale</a>
          </div>
        </div>
      </div>
    </div>
  );
}
