import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Store, Star, Users, ChevronUp, ChevronDown } from 'lucide-react';

const API = 'http://localhost:5000/api';

const StoreOwnerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stores, setStores] = useState([]);

  useEffect(() => {
    fetchMyStores();
  }, []);

  const fetchMyStores = async () => {
    try {
      const { data } = await axios.get(`${API}/stores/my-stores`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setStores(data);
    } catch (err) {
      console.error('Error fetching my stores', err);
    }
  };

  return (
    <div className="dashboard-container animate-fade-in">
      <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>My Stores Dashboard</h2>

      {stores.length === 0 ? (
        <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <Store size={48} color="#94a3b8" />
          </div>
          <h3 style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>No stores assigned to you yet</h3>
          <p style={{ color: '#64748b' }}>Please contact the system administrator to add a store.</p>
        </div>
      ) : (
        stores.map(store => (
          <StoreCard key={store.id} store={store} />
        ))
      )}
    </div>
  );
};

const StoreCard = ({ store }) => {
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronUp size={14} style={{ opacity: 0.3 }} />;
    return sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  // Sort ratings based on current sort
  const sortedRatings = [...store.ratings].sort((a, b) => {
    let valA, valB;
    switch (sortField) {
      case 'name':
        valA = a.user?.name?.toLowerCase() || '';
        valB = b.user?.name?.toLowerCase() || '';
        break;
      case 'email':
        valA = a.user?.email?.toLowerCase() || '';
        valB = b.user?.email?.toLowerCase() || '';
        break;
      case 'rating':
        valA = a.rating;
        valB = b.rating;
        break;
      case 'date':
        valA = new Date(a.createdAt).getTime();
        valB = new Date(b.createdAt).getTime();
        break;
      default:
        return 0;
    }
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div style={{ marginBottom: '3rem' }}>
      {/* Store Header Card */}
      <div className="glass-panel" style={{
        padding: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
        flexWrap: 'wrap',
        gap: '1.5rem',
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
      }}>
        <div>
          <h3 style={{ fontSize: '1.5rem', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Store size={24} color="#3b82f6" /> {store.name}
          </h3>
          <p style={{ color: '#94a3b8', margin: 0 }}>{store.address}</p>
          <p style={{ color: '#64748b', margin: '0.25rem 0 0 0', fontSize: '0.85rem' }}>{store.email}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
            <Star size={28} fill="#fbbf24" color="#fbbf24" />
            <span style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-0.02em' }}>{store.averageRating}</span>
          </div>
          <p style={{ color: '#94a3b8', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end', fontSize: '0.9rem' }}>
            <Users size={16} /> {store.ratings.length} {store.ratings.length === 1 ? 'Rating' : 'Total Ratings'}
          </p>
        </div>
      </div>

      {/* Ratings Table */}
      <div className="glass-panel" style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th onClick={() => toggleSort('name')} style={{ cursor: 'pointer' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>User Name <SortIcon field="name" /></span>
              </th>
              <th onClick={() => toggleSort('email')} style={{ cursor: 'pointer' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>User Email <SortIcon field="email" /></span>
              </th>
              <th onClick={() => toggleSort('rating')} style={{ cursor: 'pointer' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>Rating <SortIcon field="rating" /></span>
              </th>
              <th onClick={() => toggleSort('date')} style={{ cursor: 'pointer' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>Date <SortIcon field="date" /></span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedRatings.length > 0 ? sortedRatings.map(rating => (
              <tr key={rating.id}>
                <td style={{ fontWeight: '500' }}>{rating.user?.name || 'Unknown'}</td>
                <td style={{ color: '#94a3b8' }}>{rating.user?.email || '—'}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        size={16}
                        fill={star <= rating.rating ? '#fbbf24' : 'transparent'}
                        color={star <= rating.rating ? '#fbbf24' : '#475569'}
                      />
                    ))}
                    <span style={{ marginLeft: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>{rating.rating}/5</span>
                  </div>
                </td>
                <td style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                  {new Date(rating.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'short', day: 'numeric'
                  })}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                  No ratings submitted yet for this store.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StoreOwnerDashboard;
