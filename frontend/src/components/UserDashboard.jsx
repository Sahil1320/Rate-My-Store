import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Star, Search, ChevronUp, ChevronDown } from 'lucide-react';

const API = import.meta.env.VITE_API_URL;

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stores, setStores] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const headers = { Authorization: `Bearer ${user.token}` };

  const fetchStores = async () => {
    try {
      const { data } = await axios.get(`${API}/stores`, {
        params: { name: searchName, address: searchAddress, sortField, sortOrder },
        headers
      });
      setStores(data);
    } catch (err) {
      console.error('Error fetching stores', err);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [searchName, searchAddress, sortField, sortOrder]);

  const handleRatingSubmit = async (storeId, rating, existingRatingId) => {
    try {
      if (existingRatingId) {
        await axios.put(`${API}/ratings/${existingRatingId}`, { rating }, { headers });
      } else {
        await axios.post(`${API}/ratings`, { storeId, rating }, { headers });
      }
      fetchStores();
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting rating');
    }
  };

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronUp size={14} style={{ opacity: 0.3 }} />;
    return sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  const renderStars = (currentRating, onRate) => {
    return (
      <div style={{ display: 'flex', gap: '0.2rem' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={20}
            fill={star <= currentRating ? '#fbbf24' : 'transparent'}
            color={star <= currentRating ? '#fbbf24' : '#475569'}
            style={{
              cursor: onRate ? 'pointer' : 'default',
              transition: 'all 0.2s ease',
            }}
            onClick={() => onRate && onRate(star)}
            onMouseEnter={(e) => {
              if (onRate) {
                e.currentTarget.style.transform = 'scale(1.25)';
                e.currentTarget.style.color = '#fbbf24';
              }
            }}
            onMouseLeave={(e) => {
              if (onRate) {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.color = star <= currentRating ? '#fbbf24' : '#475569';
              }
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="dashboard-container animate-fade-in">
      <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Store Directory</h2>

      {/* Search Filters */}
      <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 250px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: '#64748b' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              placeholder="Search by store name..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </div>
          <div style={{ flex: '1 1 250px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: '#64748b' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              placeholder="Search by address..."
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Stores Table */}
      <div className="glass-panel" style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th onClick={() => toggleSort('name')} style={{ cursor: 'pointer' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  Store Name <SortIcon field="name" />
                </span>
              </th>
              <th onClick={() => toggleSort('address')} style={{ cursor: 'pointer' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  Address <SortIcon field="address" />
                </span>
              </th>
              <th>Overall Rating</th>
              <th>My Rating</th>
            </tr>
          </thead>
          <tbody>
            {stores.map(store => (
              <tr key={store.id}>
                <td style={{ fontWeight: '500' }}>{store.name}</td>
                <td style={{ color: '#94a3b8', maxWidth: '300px' }}>{store.address}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {renderStars(Math.round(parseFloat(store.overallRating) || 0))}
                    <span style={{ fontSize: '0.875rem', color: '#94a3b8', fontWeight: '600' }}>({store.overallRating || '0.00'})</span>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {renderStars(store.myRating || 0, (rating) => handleRatingSubmit(store.id, rating, store.myRatingId))}
                    {store.myRating ? (
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: '600',
                        color: '#10b981',
                        background: 'rgba(16, 185, 129, 0.1)',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '99px',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                      }}>
                        Submitted · Click to modify
                      </span>
                    ) : (
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: '600',
                        color: '#3b82f6',
                        background: 'rgba(59, 130, 246, 0.1)',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '99px',
                        border: '1px solid rgba(59, 130, 246, 0.2)',
                      }}>
                        Click to rate
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {stores.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                  No stores found. Try adjusting your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserDashboard;
