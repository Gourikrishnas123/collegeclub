import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Tag from '../components/common/Tag';
import { Lock, Mail, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }
    try {
      setLoading(true);
      setError('');
      const data = await login({ email, password });
      if (data.user?.role === 'super_admin') {
        navigate('/admin');
      } else if (data.user?.clubId) {
        const clubId = typeof data.user.clubId === 'object' ? data.user.clubId._id : data.user.clubId;
        navigate(`/club/${clubId}/dashboard`);
      } else {
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        border: '2px solid var(--line-strong)',
        backgroundColor: 'var(--panel)',
        padding: '32px'
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '8px'
          }}>
            <div style={{ width: '16px', height: '16px', backgroundColor: 'var(--accent)' }} />
            <h1 style={{ fontSize: '24px', letterSpacing: '-0.02em' }}>CLUB CORE</h1>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--fg-dim)', textTransform: 'uppercase' }}>
            Multi-Club OS Login Portal
          </p>
        </div>

        {error && (
          <div style={{
            padding: '10px 14px',
            backgroundColor: 'rgba(255, 92, 77, 0.1)',
            border: '1px solid var(--danger)',
            color: 'var(--danger)',
            fontSize: '11px',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                className="form-input"
                style={{ width: '100%', paddingLeft: '36px' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@college.edu"
                required
              />
              <Mail size={14} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--fg-dim)' }} />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                className="form-input"
                style={{ width: '100%', paddingLeft: '36px' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <Lock size={14} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--fg-dim)' }} />
            </div>
          </div>

          <Button type="submit" variant="primary" size="lg" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'AUTHENTICATING...' : 'ACCESS DASHBOARD'}
          </Button>
        </form>

        {/* Demo Quick Logins */}
        <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--line)' }}>
          <div style={{ fontSize: '10px', color: 'var(--fg-dim)', textTransform: 'uppercase', marginBottom: '12px', textAlign: 'center' }}>
            ⚡ QUICK DEMO ACCOUNTS (PASSWORD: password123)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickLogin('admin@college.edu')}
            >
              SUPER ADMIN
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickLogin('cs_admin@college.edu')}
            >
              CS CLUB ADMIN
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickLogin('cs_member@college.edu')}
            >
              CS MEMBER
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickLogin('ro_admin@college.edu')}
            >
              ROBOTICS ADMIN
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
