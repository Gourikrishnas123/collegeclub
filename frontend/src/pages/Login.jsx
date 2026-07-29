import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Tag from '../components/common/Tag';
import { ShieldAlert, UserCheck, Users, Lock, Mail, Building2, ArrowRight } from 'lucide-react';

const Login = () => {
  const [activeRole, setActiveRole] = useState('super_admin'); // 'super_admin' | 'club_admin' | 'member'
  const [selectedClub, setSelectedClub] = useState('CS'); // 'CS' | 'RO' | 'ME' | 'DS'
  const [email, setEmail] = useState('admin@college.edu');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const clubsList = [
    { mark: 'CS', name: 'Computer Science Society', adminEmail: 'cs_admin@college.edu', memberEmail: 'cs_member@college.edu' },
    { mark: 'RO', name: 'Robotics & Automation Club', adminEmail: 'ro_admin@college.edu', memberEmail: 'ro_member@college.edu' },
    { mark: 'ME', name: 'Mechanical Innovators Guild', adminEmail: 'me_admin@college.edu', memberEmail: 'me_member@college.edu' },
    { mark: 'DS', name: 'Design & Creative Media Club', adminEmail: 'ds_admin@college.edu', memberEmail: 'ds_admin@college.edu' }
  ];

  const rolePresets = {
    super_admin: {
      title: 'SUPER ADMIN',
      subtitle: 'MANAGES ALL CLUBS',
      description: 'Full administrative authority over all college clubs, budget allocations, and system settings.',
      badgeVariant: 'filled-urgent',
      icon: ShieldAlert
    },
    club_admin: {
      title: 'CLUB ADMIN',
      subtitle: 'MANAGES SINGLE CLUB',
      description: 'Full management over assigned club\'s budget, notices, gallery events, and members.',
      badgeVariant: 'accent',
      icon: UserCheck
    },
    member: {
      title: 'STUDENT MEMBER',
      subtitle: 'READ-ONLY VIEW',
      description: 'Student access to view announcements, event gallery, and club details.',
      badgeVariant: 'default',
      icon: Users
    }
  };

  const handleRoleSelect = (roleKey) => {
    setActiveRole(roleKey);
    setError('');
    if (roleKey === 'super_admin') {
      setEmail('admin@college.edu');
    } else if (roleKey === 'club_admin') {
      const match = clubsList.find(c => c.mark === selectedClub) || clubsList[0];
      setEmail(match.adminEmail);
    } else {
      const match = clubsList.find(c => c.mark === selectedClub) || clubsList[0];
      setEmail(match.memberEmail);
    }
    setPassword('password123');
  };

  const handleClubChange = (markCode) => {
    setSelectedClub(markCode);
    const match = clubsList.find(c => c.mark === markCode);
    if (match) {
      if (activeRole === 'club_admin') {
        setEmail(match.adminEmail);
      } else if (activeRole === 'member') {
        setEmail(match.memberEmail);
      }
    }
  };

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

  const currentPreset = rolePresets[activeRole];

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
        maxWidth: '480px',
        border: '2px solid var(--line-strong)',
        backgroundColor: 'var(--panel)',
        padding: '36px'
      }}>
        {/* Clean Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '4px'
          }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: 'var(--accent)' }} />
            <h1 style={{ fontSize: '20px', letterSpacing: '-0.02em' }}>CLUB CORE</h1>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--fg-dim)', textTransform: 'uppercase' }}>
            Multi-Club OS Portal
          </p>
        </div>

        {/* 3 Minimal Role Selector Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '24px' }}>
          {Object.keys(rolePresets).map((rKey) => {
            const r = rolePresets[rKey];
            const isSelected = activeRole === rKey;
            const Icon = r.icon;
            return (
              <button
                key={rKey}
                type="button"
                onClick={() => handleRoleSelect(rKey)}
                style={{
                  padding: '10px 4px',
                  border: isSelected ? '2px solid var(--accent)' : '1px solid var(--line)',
                  backgroundColor: isSelected ? 'rgba(212, 255, 61, 0.08)' : 'var(--bg)',
                  color: isSelected ? 'var(--accent)' : 'var(--fg-dim)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={14} />
                <span>{r.title}</span>
              </button>
            );
          })}
        </div>

        {/* Role Badge & Scope Description */}
        <div style={{
          padding: '12px 14px',
          border: '1px solid var(--line)',
          backgroundColor: 'var(--bg)',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--fg)' }}>
            {currentPreset.subtitle}
          </span>
          <Tag variant={currentPreset.badgeVariant}>{activeRole}</Tag>
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

        {/* Form */}
        <form onSubmit={handleLogin}>
          {/* Club Name Dropdown (For Club Admin & Member Identification) */}
          {activeRole !== 'super_admin' && (
            <div className="form-group">
              <label className="form-label">Select Club Name (for identification)</label>
              <div style={{ position: 'relative' }}>
                <select
                  className="form-select"
                  style={{ width: '100%', paddingLeft: '36px', appearance: 'auto', fontWeight: '600' }}
                  value={selectedClub}
                  onChange={(e) => handleClubChange(e.target.value)}
                >
                  {clubsList.map(c => (
                    <option key={c.mark} value={c.mark}>
                      [{c.mark}] {c.name}
                    </option>
                  ))}
                </select>
                <Building2 size={14} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--accent)' }} />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                className="form-input"
                style={{ width: '100%', paddingLeft: '36px' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@college.edu"
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
            {loading ? 'AUTHENTICATING...' : `LOG IN AS ${currentPreset.title}`} <ArrowRight size={14} />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
