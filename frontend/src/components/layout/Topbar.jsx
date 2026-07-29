import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useClub } from '../../context/ClubContext';
import Tag from '../common/Tag';

const Topbar = () => {
  const { user } = useAuth();
  const { currentClub } = useClub();

  return (
    <header style={{
      height: 'var(--topbar-height)',
      marginLeft: 'var(--sidebar-width)',
      backgroundColor: 'var(--panel)',
      borderBottom: '2px solid var(--line-strong)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 90
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {currentClub ? (
          <>
            <Tag variant="accent">{currentClub.mark}</Tag>
            <h2 style={{ fontSize: '16px', textTransform: 'uppercase' }}>
              {currentClub.name}
            </h2>
            <span style={{ color: 'var(--fg-dim)', fontSize: '12px' }}>
              [{currentClub.department}]
            </span>
          </>
        ) : (
          <h2 style={{ fontSize: '16px' }}>SYSTEM DASHBOARD</h2>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ textAlign: 'right' }}>
          <span style={{ display: 'block', fontSize: '12px', fontWeight: '700' }}>
            {user?.name}
          </span>
          <span style={{ fontSize: '10px', color: 'var(--fg-dim)', textTransform: 'uppercase' }}>
            {user?.email}
          </span>
        </div>
        <Tag variant={user?.role === 'super_admin' ? 'filled-urgent' : 'accent'}>
          {user?.role}
        </Tag>
      </div>
    </header>
  );
};

export default Topbar;
