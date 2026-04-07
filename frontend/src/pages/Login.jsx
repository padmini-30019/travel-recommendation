import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Login({ setAuthUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await axios.post('/api/users/login', { email, password });
      setAuthUser(response.data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="glass" style={{ padding: '3rem', borderRadius: '20px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Welcome Back</h2>
        {error && <div style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '1rem', borderRadius: '10px', marginBottom: '1.5rem' }}>{error}</div>}
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="search-input glass" 
              style={{ width: '100%', padding: '1rem', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.08)', color: 'var(--text-primary)', border: '1px solid rgba(255, 255, 255, 0.15)' }}
            />
          </div>
          
          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="search-input glass" 
              style={{ width: '100%', padding: '1rem', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.08)', color: 'var(--text-primary)', border: '1px solid rgba(255, 255, 255, 0.15)' }}
            />
          </div>
          
          <button type="submit" className="btn-primary" style={{ justifyContent: 'center', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        
        <p style={{ marginTop: '2rem', color: 'var(--text-muted)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold' }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
