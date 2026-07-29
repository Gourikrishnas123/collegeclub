import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useClub } from '../../context/ClubContext';
import { LayoutDashboard, Wallet, Image, Bell, Users, ShieldAlert, LogOut } from 'lucide-react';
import Tag from '../common/Tag';

const Sidebar = () => {
  const { user, isSuperAdmin, isClubAdmin, ownClubId, logout } = useAuth();
  const { clubs, currentClubId, selectClub, currentClub } = useClub();
  const navigate = useNavigate();

  const activeClubId = isSuperAdmin 
    ? (currentClubId || (clubs[0] ? clubs[0]._id : null)) 
    : (ownClubId || (currentClub ? currentClub._id : (clubs[0] ? clubs[0]._id : null)));

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: `/club/${activeClubId}/dashboard` },
    { label: 'Finance', icon: Wallet, path: `/club/${activeClubId}/finance` },
    { label: 'Gallery', icon: Image, path: `/club/${activeClubId}/gallery` },
    { label: 'Noticeboard', icon: Bell, path: `/club/${activeClubId}/notices` },
    { label: 'Members', icon: Users, path: `/club/${activeClubId}/members` },
  ];

  return (
    <aside style={{
      width: 'var(--sidebar-width)',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      backgroundColor: 'var(--panel)',
      borderRight: '1px solid var(--line)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      zIndex: 100
    }}>
      <div>
        {/* Brand Header */}
        <div style={{
          padding: '18px 16px',
          borderBottom: '1px solid var(--line)',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '10px',
              height: '10px',
              backgroundColor: 'var(--accent)'
            }} />
            <h1 style={{ fontSize: '14px', letterSpacing: '-0.02em' }}>CLUB CORE</h1>
          </div>
          <span style={{ fontSize: '9px', color: 'var(--fg-dim)', textTransform: 'uppercase' }}>
            Multi-Club OS
          </span>
        </div>

        {/* Club Badge & Switcher for Super Admin */}
        <div style={{
          padding: '14px 16px',
          borderBottom: '1px solid var(--line)',
          backgroundColor: 'var(--bg)'
        }}>
          <div style={{ fontSize: '9px', color: 'var(--fg-dim)', textTransform: 'uppercase', marginBottom: '6px' }}>
            ACTIVE CLUB
          </div>

          {isSuperAdmin ? (
            <select
              value={activeClubId || ''}
              onChange={(e) => {
                selectClub(e.target.value);
                navigate(`/club/${e.target.value}/dashboard`);
              }}
              style={{
                width: '100%',
                backgroundColor: 'var(--panel)',
                color: 'var(--fg)',
                border: '1px solid var(--line)',
                padding: '6px 8px',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              {clubs.map(c => (
                <option key={c._id} value={c._id}>
                  [{c.mark}] {c.name}
                </option>
              ))}
            </select>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Tag variant="accent">{currentClub?.mark || 'CLUB'}</Tag>
              <div style={{
                fontSize: '11px',
                fontWeight: '600',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {currentClub?.name || 'My Club'}
              </div>
            </div>
          )}
        </div>

        {/* Super Admin Global Link */}
        {isSuperAdmin && (
          <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--line)' }}>
            <NavLink
              to="/admin"
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 10px',
                border: '1px solid var(--accent)',
                backgroundColor: isActive ? 'var(--accent)' : 'transparent',
                color: isActive ? 'var(--bg)' : 'var(--accent)',
                fontWeight: '700',
                fontSize: '10px',
                textTransform: 'uppercase'
              })}
            >
              <ShieldAlert size={13} />
              ALL CLUBS OVERVIEW
            </NavLink>
          </div>
        )}

        {/* Navigation Items */}
        <nav style={{ padding: '12px 0' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.path}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '9px 16px',
                  fontSize: '11px',
                  fontWeight: '600',
                  color: isActive ? 'var(--bg)' : 'var(--fg)',
                  backgroundColor: isActive ? 'var(--fg)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent',
                  transition: 'all 0.15s ease',
                  textTransform: 'uppercase'
                })}
              >
                <Icon size={14} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User Profile & Logout */}
      <div style={{
        padding: '14px 16px',
        borderTop: '1px solid var(--line)',
        backgroundColor: 'var(--bg)'
      }}>
        <div style={{ marginBottom: '10px' }}>
          <div style={{ fontWeight: '700', fontSize: '11px', color: 'var(--fg)' }}>
            {user?.name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
            <Tag variant={isSuperAdmin ? 'filled-urgent' : isClubAdmin ? 'accent' : 'default'}>
              {user?.role}
            </Tag>
          </div>
        </div>
        <button
          onClick={logout}
          style={{
            width: '100%',
            padding: '7px',
            backgroundColor: 'transparent',
            color: 'var(--danger)',
            border: '1px solid var(--danger)',
            fontSize: '10px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            textTransform: 'uppercase'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--danger)';
            e.currentTarget.style.color = 'var(--bg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--danger)';
          }}
        >
          <LogOut size={11} /> LOGOUT
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
