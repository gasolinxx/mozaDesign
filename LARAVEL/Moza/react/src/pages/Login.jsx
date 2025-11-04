import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import loginImage from '../assets/logo.jpeg';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      setStatus({ type: 'success', message: 'Login successful!' });

      if (data.user.usertype === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <img src={loginImage} alt="Logo" className="login-logo" />
        <h2 className="login-title">Welcome Back</h2>

        {status && (
          <div className={`status-message ${status.type}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <label htmlFor="email" className="input-label">Email Address</label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
            className="input-field"
            autoComplete="username"
          />

          <label htmlFor="password" className="input-label">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
            className="input-field"
            autoComplete="current-password"
          />

          <button type="submit" disabled={loading} className="btn-submit">
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
