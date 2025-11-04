import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';

const LOCAL_STORAGE_KEY = 'signupFormData';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    password: '',
    password_confirmation: '',
  });

  const [autoSave, setAutoSave] = useState(false);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [redirectPath, setRedirectPath] = useState(null);
  const [savedIndicator, setSavedIndicator] = useState(false);
  const navigate = useNavigate();

  // debounce timer ref
  const saveTimeout = useRef(null);

  <div className="echo-message" style={{ textAlign: 'center', marginBottom: '15px', fontWeight: 'bold', color: status?.type === 'success' ? 'green' : 'red' }}>
  {status?.type === 'success' ? 'Successfully registered!' : 'Welcome to Signup!'}
</div>


  // Load saved data on mount
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      setFormData(JSON.parse(saved));
      setAutoSave(true);
    }
  }, []);

  // Save formData to localStorage with debounce
  useEffect(() => {
    if (!autoSave) return;

    if (saveTimeout.current) clearTimeout(saveTimeout.current);

    saveTimeout.current = setTimeout(() => {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
      setSavedIndicator(true);
      setTimeout(() => setSavedIndicator(false), 1500); // show saved indicator for 1.5s
    }, 500);

    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, [formData, autoSave]);

  // Redirect after 7 seconds if redirectPath set
  useEffect(() => {
    if (redirectPath) {
      const timer = setTimeout(() => {
        navigate(redirectPath);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [redirectPath, navigate]);

  // Handle input changes with phone number digit filtering
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone_number') {
      if (value === '' || /^[0-9]+$/.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Confirm clearing saved data when unchecking autoSave
  const handleAutoSaveToggle = (e) => {
    if (!e.target.checked) {
      const confirmed = window.confirm(
        'Are you sure you want to stop saving your data? Saved data will be cleared.'
      );
      if (!confirmed) return;
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setAutoSave(false);
    } else {
      setAutoSave(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (formData.phone_number === '') {
      setStatus({ type: 'error', message: 'Phone number is required.' });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessages = errorData.errors
          ? Object.values(errorData.errors).flat().join(' ')
          : errorData.message || 'Registration failed';
        throw new Error(errorMessages);
      }

      const data = await response.json();
      console.log('🎉 Registration successful:', data);

      localStorage.setItem('token', data.token);

      setStatus({
        type: 'success',
        message: '🎉 Account created successfully! Redirecting shortly...',
      });

      setFormData({
        name: '',
        email: '',
        phone_number: '',
        password: '',
        password_confirmation: '',
      });

      if (autoSave) {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }

      if (data.user.usertype === 'admin') {
        setRedirectPath('/admin-dashboard');
      } else if (data.user.usertype === 'agent') {
        setRedirectPath('/agent-dashboard');
      } else {
        setRedirectPath('/');
      }
    } catch (error) {
      console.error('Error:', error);
      setStatus({ type: 'error', message: error.message || 'Something went wrong' });
      setLoading(false);
    }
  };

  return (
    <div className="signup-bg">

        
      <div className="signup-card">
         {status && <p className={`status ${status.type}`}>{status.message}</p>}
      
        <h2>Create Account 🚀</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <input
            name="phone_number"
            type="tel"
            placeholder="Phone Number"
            value={formData.phone_number}
            onChange={handleChange}
            required
            maxLength={20}
            disabled={loading}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <input
            name="password_confirmation"
            type="password"
            placeholder="Confirm Password"
            value={formData.password_confirmation}
            onChange={handleChange}
            required
            disabled={loading}
          />

    

          <button type="submit" disabled={loading} style={{ marginTop: '15px' }}>
            {loading ? 'Creating...' : 'Sign Up'}
          </button>
        </form>
       
      </div>
    </div>
  );
};

export default SignUp;
