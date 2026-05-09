import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!formData.name || formData.name.length < 10 || formData.name.length > 60) {
      return 'Name must be between 10 and 60 characters.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      return 'Please enter a valid email address.';
    }
    if (!formData.address || formData.address.length > 400) {
      return 'Address is required and must be at most 400 characters.';
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$&*]).{8,16}$/;
    if (!formData.password || !passwordRegex.test(formData.password)) {
      return 'Password must be 8-16 characters, include at least one uppercase letter and one special character (!@#$&*).';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '90vh', padding: '2rem 0' }}>
      <div className="glass-panel animate-fade-in" style={{ padding: '3rem', width: '100%', maxWidth: '500px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '16px', background: 'rgba(16, 185, 129, 0.1)', marginBottom: '1rem' }}>
            <UserPlus size={32} color="#10b981" />
          </div>
          <h2 style={{ margin: '0 0 0.5rem 0' }}>Create Account</h2>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>Sign up as a new user</p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            color: '#ef4444',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            fontSize: '0.875rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name <span style={{ color: '#64748b', fontWeight: '400', textTransform: 'none' }}>(10-60 characters)</span></label>
            <input
              type="text"
              name="name"
              className="form-input"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              minLength={10}
              maxLength={60}
            />
            <span style={{ fontSize: '0.75rem', color: formData.name.length < 10 ? '#94a3b8' : '#10b981', marginTop: '0.25rem', display: 'block' }}>
              {formData.name.length}/60 characters {formData.name.length < 10 ? `(${10 - formData.name.length} more needed)` : '✓'}
            </span>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Address <span style={{ color: '#64748b', fontWeight: '400', textTransform: 'none' }}>(max 400 characters)</span></label>
            <textarea
              name="address"
              className="form-input"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your address"
              rows="3"
              maxLength={400}
              required
            ></textarea>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem', display: 'block' }}>
              {formData.address.length}/400 characters
            </span>
          </div>

          <div className="form-group">
            <label className="form-label">Password <span style={{ color: '#64748b', fontWeight: '400', textTransform: 'none' }}>(8-16 chars, 1 uppercase, 1 special)</span></label>
            <input
              type="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem', padding: '0.85rem', fontSize: '0.95rem' }}
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', color: '#94a3b8', fontSize: '0.9rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: '600' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
