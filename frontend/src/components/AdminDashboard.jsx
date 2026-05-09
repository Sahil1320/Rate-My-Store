import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Users, Store as StoreIcon, Star, Plus, Search, ChevronUp, ChevronDown, X } from 'lucide-react';

const API = 'http://localhost:5000/api';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Filters & Sorting for Users
  const [uSearch, setUSearch] = useState({ name: '', email: '', address: '', role: '' });
  const [uSort, setUSort] = useState({ field: 'name', order: 'asc' });

  // Filters & Sorting for Stores
  const [sSearch, setSSearch] = useState({ name: '', email: '', address: '' });
  const [sSort, setSSort] = useState({ field: 'name', order: 'asc' });

  // Modals
  const [showUserModal, setShowUserModal] = useState(false);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [formError, setFormError] = useState('');

  const headers = { Authorization: `Bearer ${user.token}` };

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchStores();
  }, []);

  useEffect(() => { fetchUsers(); }, [uSearch, uSort]);
  useEffect(() => { fetchStores(); }, [sSearch, sSort]);

  const fetchStats = async () => {
    try {
      const { data } = await axios.get(`${API}/users/dashboard`, { headers });
      setStats(data);
    } catch (err) { console.error(err); }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${API}/users`, {
        params: { ...uSearch, sortField: uSort.field, sortOrder: uSort.order },
        headers
      });
      setUsers(data);
    } catch (err) { console.error(err); }
  };

  const fetchStores = async () => {
    try {
      const { data } = await axios.get(`${API}/stores`, {
        params: { ...sSearch, sortField: sSort.field, sortOrder: sSort.order },
        headers
      });
      setStores(data);
    } catch (err) { console.error(err); }
  };

  // Validation helpers
  const validateUserForm = (data) => {
    if (!data.name || data.name.length < 10 || data.name.length > 60) {
      return 'Name must be between 10 and 60 characters.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
      return 'Please enter a valid email address.';
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$&*]).{8,16}$/;
    if (!data.password || !passwordRegex.test(data.password)) {
      return 'Password must be 8-16 characters, include at least one uppercase letter and one special character.';
    }
    if (!data.address || data.address.length > 400) {
      return 'Address is required and must be at most 400 characters.';
    }
    return null;
  };

  const validateStoreForm = (data) => {
    if (!data.name) return 'Store name is required.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
      return 'Please enter a valid store email address.';
    }
    if (!data.address || data.address.length > 400) {
      return 'Address is required and must be at most 400 characters.';
    }
    if (!data.ownerId) return 'Owner ID is required.';
    return null;
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const validationError = validateUserForm(formData);
    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      await axios.post(`${API}/users`, formData, { headers });
      setShowUserModal(false);
      setFormData({});
      fetchUsers();
      fetchStats();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Error creating user');
    }
  };

  const handleStoreSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const validationError = validateStoreForm(formData);
    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      await axios.post(`${API}/stores`, formData, { headers });
      setShowStoreModal(false);
      setFormData({});
      fetchStores();
      fetchStats();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Error creating store');
    }
  };

  const toggleUserSort = (field) => {
    setUSort(prev => ({
      field,
      order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc'
    }));
  };

  const toggleStoreSort = (field) => {
    setSSort(prev => ({
      field,
      order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc'
    }));
  };

  const SortIcon = ({ field, currentSort }) => {
    if (currentSort.field !== field) return <ChevronUp size={14} style={{ opacity: 0.3 }} />;
    return currentSort.order === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  const roleBadge = (role) => {
    const colors = {
      ADMIN: { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444', border: 'rgba(239, 68, 68, 0.3)' },
      STORE_OWNER: { bg: 'rgba(245, 158, 11, 0.15)', text: '#f59e0b', border: 'rgba(245, 158, 11, 0.3)' },
      NORMAL: { bg: 'rgba(16, 185, 129, 0.15)', text: '#10b981', border: 'rgba(16, 185, 129, 0.3)' },
    };
    const c = colors[role] || colors.NORMAL;
    return (
      <span style={{
        padding: '0.25rem 0.75rem',
        borderRadius: '99px',
        fontSize: '0.72rem',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        background: c.bg,
        color: c.text,
        border: `1px solid ${c.border}`,
      }}>{role === 'STORE_OWNER' ? 'Store Owner' : role === 'ADMIN' ? 'Admin' : 'Normal'}</span>
    );
  };

  const storeOwners = users.filter(u => u.role === 'STORE_OWNER');

  return (
    <div className="dashboard-container animate-fade-in">
      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem', flexWrap: 'wrap' }}>
        {['dashboard', 'users', 'stores'].map(tab => (
          <button
            key={tab}
            className={`btn ${activeTab === tab ? 'btn-primary' : ''}`}
            onClick={() => setActiveTab(tab)}
            style={{
              background: activeTab !== tab ? 'transparent' : undefined,
              color: activeTab !== tab ? '#94a3b8' : undefined,
              textTransform: 'capitalize',
            }}
          >
            {tab === 'dashboard' ? 'Overview' : tab === 'users' ? 'Users Management' : 'Stores Management'}
          </button>
        ))}
      </div>

      {/* ===== OVERVIEW TAB ===== */}
      {activeTab === 'dashboard' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {[
            { label: 'Total Users', value: stats.totalUsers, icon: <Users size={28} color="#3b82f6" />, bg: 'rgba(59, 130, 246, 0.15)' },
            { label: 'Total Stores', value: stats.totalStores, icon: <StoreIcon size={28} color="#10b981" />, bg: 'rgba(16, 185, 129, 0.15)' },
            { label: 'Total Ratings', value: stats.totalRatings, icon: <Star size={28} color="#f59e0b" />, bg: 'rgba(245, 158, 11, 0.15)' },
          ].map((card, i) => (
            <div key={i} className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ background: card.bg, padding: '1rem', borderRadius: '14px' }}>
                {card.icon}
              </div>
              <div>
                <p style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>{card.label}</p>
                <h3 style={{ fontSize: '2.25rem', margin: 0, fontWeight: '800', letterSpacing: '-0.02em' }}>{card.value}</h3>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===== USERS MANAGEMENT TAB ===== */}
      {activeTab === 'users' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h2>Users Directory</h2>
            <button className="btn btn-primary" onClick={() => { setFormData({ role: 'NORMAL' }); setFormError(''); setShowUserModal(true); }}>
              <Plus size={18} /> Add User
            </button>
          </div>

          {/* Filters */}
          <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 180px', position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', top: '12px', left: '12px', color: '#64748b' }} />
                <input type="text" className="form-input" style={{ paddingLeft: '2.25rem' }} placeholder="Filter by Name" value={uSearch.name} onChange={e => setUSearch({ ...uSearch, name: e.target.value })} />
              </div>
              <div style={{ flex: '1 1 180px', position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', top: '12px', left: '12px', color: '#64748b' }} />
                <input type="text" className="form-input" style={{ paddingLeft: '2.25rem' }} placeholder="Filter by Email" value={uSearch.email} onChange={e => setUSearch({ ...uSearch, email: e.target.value })} />
              </div>
              <div style={{ flex: '1 1 180px', position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', top: '12px', left: '12px', color: '#64748b' }} />
                <input type="text" className="form-input" style={{ paddingLeft: '2.25rem' }} placeholder="Filter by Address" value={uSearch.address} onChange={e => setUSearch({ ...uSearch, address: e.target.value })} />
              </div>
              <div style={{ flex: '0 1 180px' }}>
                <select className="form-input" value={uSearch.role} onChange={e => setUSearch({ ...uSearch, role: e.target.value })}>
                  <option value="">All Roles</option>
                  <option value="NORMAL">Normal User</option>
                  <option value="STORE_OWNER">Store Owner</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="glass-panel" style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th onClick={() => toggleUserSort('name')} style={{ cursor: 'pointer' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>Name <SortIcon field="name" currentSort={uSort} /></span>
                  </th>
                  <th onClick={() => toggleUserSort('email')} style={{ cursor: 'pointer' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>Email <SortIcon field="email" currentSort={uSort} /></span>
                  </th>
                  <th onClick={() => toggleUserSort('address')} style={{ cursor: 'pointer' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>Address <SortIcon field="address" currentSort={uSort} /></span>
                  </th>
                  <th onClick={() => toggleUserSort('role')} style={{ cursor: 'pointer' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>Role <SortIcon field="role" currentSort={uSort} /></span>
                  </th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: '500' }}>{u.name}</td>
                    <td style={{ color: '#94a3b8' }}>{u.email}</td>
                    <td style={{ color: '#94a3b8', maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.address}</td>
                    <td>{roleBadge(u.role)}</td>
                    <td>
                      {u.role === 'STORE_OWNER' ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Star size={16} fill="#fbbf24" color="#fbbf24" />
                          <span style={{ fontWeight: '600' }}>{u.averageStoreRating || '0.00'}</span>
                        </div>
                      ) : (
                        <span style={{ color: '#64748b' }}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>No users found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===== STORES MANAGEMENT TAB ===== */}
      {activeTab === 'stores' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h2>Stores Directory</h2>
            <button className="btn btn-primary" onClick={() => { setFormData({}); setFormError(''); setShowStoreModal(true); }}>
              <Plus size={18} /> Add Store
            </button>
          </div>

          {/* Filters */}
          <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 200px', position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', top: '12px', left: '12px', color: '#64748b' }} />
                <input type="text" className="form-input" style={{ paddingLeft: '2.25rem' }} placeholder="Filter by Name" value={sSearch.name} onChange={e => setSSearch({ ...sSearch, name: e.target.value })} />
              </div>
              <div style={{ flex: '1 1 200px', position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', top: '12px', left: '12px', color: '#64748b' }} />
                <input type="text" className="form-input" style={{ paddingLeft: '2.25rem' }} placeholder="Filter by Email" value={sSearch.email} onChange={e => setSSearch({ ...sSearch, email: e.target.value })} />
              </div>
              <div style={{ flex: '1 1 200px', position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', top: '12px', left: '12px', color: '#64748b' }} />
                <input type="text" className="form-input" style={{ paddingLeft: '2.25rem' }} placeholder="Filter by Address" value={sSearch.address} onChange={e => setSSearch({ ...sSearch, address: e.target.value })} />
              </div>
            </div>
          </div>

          {/* Stores Table */}
          <div className="glass-panel" style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th onClick={() => toggleStoreSort('name')} style={{ cursor: 'pointer' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>Store Name <SortIcon field="name" currentSort={sSort} /></span>
                  </th>
                  <th onClick={() => toggleStoreSort('email')} style={{ cursor: 'pointer' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>Email <SortIcon field="email" currentSort={sSort} /></span>
                  </th>
                  <th onClick={() => toggleStoreSort('address')} style={{ cursor: 'pointer' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>Address <SortIcon field="address" currentSort={sSort} /></span>
                  </th>
                  <th>Owner</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {stores.map(s => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: '500' }}>{s.name}</td>
                    <td style={{ color: '#94a3b8' }}>{s.email}</td>
                    <td style={{ color: '#94a3b8', maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.address}</td>
                    <td style={{ fontWeight: '500' }}>{s.owner?.name || 'N/A'}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Star size={16} fill="#fbbf24" color="#fbbf24" />
                        <span style={{ fontWeight: '600' }}>{s.overallRating || '0.00'}</span>
                      </div>
                    </td>
                  </tr>
                ))}
                {stores.length === 0 && (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>No stores found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===== ADD USER MODAL ===== */}
      {showUserModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 1000, padding: '2rem 1rem', overflowY: 'auto' }}>
          <div className="glass-panel animate-fade-in" style={{ padding: '2rem', width: '100%', maxWidth: '500px', position: 'relative', margin: 'auto 0' }}>
            <button onClick={() => setShowUserModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={20} /></button>
            <h3 style={{ marginBottom: '1.5rem' }}>Add New User</h3>

            {formError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', border: '1px solid rgba(239, 68, 68, 0.2)', fontSize: '0.875rem' }}>{formError}</div>
            )}

            <form onSubmit={handleUserSubmit}>
              <div className="form-group">
                <label className="form-label">Name <span style={{ color: '#64748b', fontWeight: '400', textTransform: 'none' }}>(10-60 characters)</span></label>
                <input type="text" className="form-input" required minLength={10} maxLength={60} value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Enter full name" />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" className="form-input" required value={formData.email || ''} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="email@example.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Password <span style={{ color: '#64748b', fontWeight: '400', textTransform: 'none' }}>(8-16 chars, 1 uppercase, 1 special)</span></label>
                <input type="password" className="form-input" required value={formData.password || ''} onChange={e => setFormData({ ...formData, password: e.target.value })} placeholder="Enter password" />
              </div>
              <div className="form-group">
                <label className="form-label">Address <span style={{ color: '#64748b', fontWeight: '400', textTransform: 'none' }}>(max 400 characters)</span></label>
                <textarea className="form-input" required maxLength={400} rows="3" value={formData.address || ''} onChange={e => setFormData({ ...formData, address: e.target.value })} placeholder="Enter address"></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select className="form-input" required value={formData.role || 'NORMAL'} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                  <option value="NORMAL">Normal User</option>
                  <option value="STORE_OWNER">Store Owner</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" className="btn" onClick={() => setShowUserModal(false)} style={{ background: 'transparent' }}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create User</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== ADD STORE MODAL ===== */}
      {showStoreModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 1000, padding: '2rem 1rem', overflowY: 'auto' }}>
          <div className="glass-panel animate-fade-in" style={{ padding: '2rem', width: '100%', maxWidth: '500px', position: 'relative', margin: 'auto 0' }}>
            <button onClick={() => setShowStoreModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={20} /></button>
            <h3 style={{ marginBottom: '1.5rem' }}>Add New Store</h3>

            {formError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', border: '1px solid rgba(239, 68, 68, 0.2)', fontSize: '0.875rem' }}>{formError}</div>
            )}

            <form onSubmit={handleStoreSubmit}>
              <div className="form-group">
                <label className="form-label">Store Name</label>
                <input type="text" className="form-input" required value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Enter store name" />
              </div>
              <div className="form-group">
                <label className="form-label">Store Email</label>
                <input type="email" className="form-input" required value={formData.email || ''} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="store@example.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Address <span style={{ color: '#64748b', fontWeight: '400', textTransform: 'none' }}>(max 400 characters)</span></label>
                <textarea className="form-input" required maxLength={400} rows="3" value={formData.address || ''} onChange={e => setFormData({ ...formData, address: e.target.value })} placeholder="Enter store address"></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">Store Owner</label>
                {storeOwners.length > 0 ? (
                  <select className="form-input" required value={formData.ownerId || ''} onChange={e => setFormData({ ...formData, ownerId: e.target.value })}>
                    <option value="">Select an owner</option>
                    {storeOwners.map(o => (
                      <option key={o.id} value={o.id}>{o.name} ({o.email})</option>
                    ))}
                  </select>
                ) : (
                  <div>
                    <input type="text" className="form-input" required value={formData.ownerId || ''} onChange={e => setFormData({ ...formData, ownerId: e.target.value })} placeholder="Owner User ID (create a Store Owner first)" />
                    <p style={{ fontSize: '0.75rem', color: '#f59e0b', marginTop: '0.5rem' }}>No Store Owners found. Create a user with "Store Owner" role first, or paste an Owner ID.</p>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" className="btn" onClick={() => setShowStoreModal(false)} style={{ background: 'transparent' }}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Store</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
