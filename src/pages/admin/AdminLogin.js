import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = e => {
    e.preventDefault();
    const storedUsername = localStorage.getItem('admin_username') || 'admin';
    const storedPassword = localStorage.getItem('admin_password') || 'admin123';
    if (form.username === storedUsername && form.password === storedPassword) {
      localStorage.setItem('admin_auth', 'true');
      navigate('/admin');
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>🔐 Admin Login</h2>
        <p>BenBens Smart Cars Management</p>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input required value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} placeholder="admin" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input required type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Login</button>
        </form>
      </div>
    </div>
  );
}
