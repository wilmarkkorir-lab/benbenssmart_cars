import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

export default function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('auth/login/', {
        username: form.username,
        password: form.password,
      });
      if (res.data.token) {
        localStorage.setItem('admin_auth', 'true');
        localStorage.setItem('admin_token', res.data.token);
        localStorage.setItem('admin_username', form.username);
        navigate('/admin');
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      if (err.response?.status === 400 || err.response?.status === 401) {
        setError('Invalid username or password.');
      } else {
        // Fallback to hardcoded credentials if auth endpoint not available
        const storedUsername = localStorage.getItem('admin_username') || 'admin';
        const storedPassword = localStorage.getItem('admin_password') || 'Benbens@2026';
        if (form.username === storedUsername && form.password === storedPassword) {
          localStorage.setItem('admin_auth', 'true');
          navigate('/admin');
        } else {
          setError('Invalid username or password.');
        }
      }
    } finally {
      setLoading(false);
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
            <input
              required
              autoComplete="username"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              placeholder="admin"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              required
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Logging in...' : 'Login 🔐'}
          </button>
        </form>
      </div>
    </div>
  );
}
