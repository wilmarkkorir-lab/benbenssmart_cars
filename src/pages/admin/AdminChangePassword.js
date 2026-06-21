import React, { useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';

export default function AdminChangePassword() {
  const [form, setForm] = useState({ current: '', newPass: '', confirm: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const storedPassword = localStorage.getItem('admin_password') || 'admin123';

    if (form.current !== storedPassword) {
      setError('Current password is incorrect.');
      return;
    }
    if (form.newPass.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }
    if (form.newPass !== form.confirm) {
      setError('New passwords do not match.');
      return;
    }

    localStorage.setItem('admin_password', form.newPass);
    setSuccess('✅ Password changed successfully!');
    setForm({ current: '', newPass: '', confirm: '' });
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <h1>Change Password</h1>
        <div style={{ maxWidth: '480px' }}>
          <div className="inquiry-form">
            {success && <div className="success-msg">{success}</div>}
            {error && <div className="error-msg">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Current Password</label>
                <input
                  required
                  type="password"
                  value={form.current}
                  onChange={e => setForm({ ...form, current: e.target.value })}
                  placeholder="Enter current password"
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  required
                  type="password"
                  value={form.newPass}
                  onChange={e => setForm({ ...form, newPass: e.target.value })}
                  placeholder="Enter new password"
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  required
                  type="password"
                  value={form.confirm}
                  onChange={e => setForm({ ...form, confirm: e.target.value })}
                  placeholder="Repeat new password"
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Change Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
