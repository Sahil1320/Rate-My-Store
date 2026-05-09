import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Star, KeyRound, X } from 'lucide-react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [pwMsg, setPwMsg] = useState({ text: '', isError: false });

  if (!user) return null;

  const roleLabel = {
    ADMIN: 'System Admin',
    STORE_OWNER: 'Store Owner',
    NORMAL: 'User',
  };

  const roleColor = {
    ADMIN: '#ef4444',
    STORE_OWNER: '#f59e0b',
    NORMAL: '#10b981',
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPwMsg({ text: '', isError: false });

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$&*]).{8,16}$/;
    if (!passwordRegex.test(newPassword)) {
      setPwMsg({ text: 'Password must be 8-16 characters, include at least one uppercase letter and one special character (!@#$&*).', isError: true });
      return;
    }

    try {
      await axios.put(`${API}/auth/password`, { newPassword }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setPwMsg({ text: 'Password updated successfully!', isError: false });
      setNewPassword('');
      setTimeout(() => setShowPasswordModal(false), 1500);
    } catch (err) {
      setPwMsg({ text: err.response?.data?.message || 'Failed to update password', isError: true });
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Star size={24} color="#fbbf24" fill="#fbbf24" />
            <span className="navbar-brand">RateMyStore</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ color: '#e2e8f0', fontWeight: '500' }}>{user.name}</span>
              <span style={{
                padding: '0.2rem 0.6rem',
                borderRadius: '99px',
                fontSize: '0.7rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                background: `${roleColor[user.role]}22`,
                color: roleColor[user.role],
                border: `1px solid ${roleColor[user.role]}44`,
              }}>
                {roleLabel[user.role]}
              </span>
            </div>
            <button
              className="btn"
              onClick={() => { setShowPasswordModal(true); setPwMsg({ text: '', isError: false }); setNewPassword(''); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(59, 130, 246, 0.15)',
                color: '#3b82f6',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                padding: '0.5rem 1rem',
                fontSize: '0.85rem',
              }}
            >
              <KeyRound size={16} />
              Change Password
            </button>
            <button
              className="btn"
              onClick={logout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#ef4444',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '0.5rem 1rem',
                fontSize: '0.85rem',
              }}
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel animate-fade-in" style={{ padding: '2rem', width: '100%', maxWidth: '420px', position: 'relative' }}>
            <button
              onClick={() => setShowPasswordModal(false)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
            <h3 style={{ marginBottom: '1.5rem' }}>Update Password</h3>

            {pwMsg.text && (
              <div style={{
                background: pwMsg.isError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                color: pwMsg.isError ? '#ef4444' : '#10b981',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                marginBottom: '1.25rem',
                border: `1px solid ${pwMsg.isError ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`,
                fontSize: '0.875rem'
              }}>
                {pwMsg.text}
              </div>
            )}

            <form onSubmit={handlePasswordUpdate}>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="8-16 chars, 1 uppercase, 1 special char"
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" className="btn" onClick={() => setShowPasswordModal(false)} style={{ background: 'transparent' }}>Cancel</button>
                <button type="submit" className="btn btn-primary">Update Password</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
