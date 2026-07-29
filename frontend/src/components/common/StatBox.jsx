import React from 'react';

const StatBox = ({ label, value, subtext, isDanger = false }) => {
  return (
    <div style={{
      padding: '18px 20px',
      background: 'var(--panel)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: '6px'
    }}>
      <span style={{
        fontSize: '10px',
        fontFamily: 'var(--font-mono)',
        color: 'var(--fg-dim)',
        textTransform: 'uppercase',
        letterSpacing: '0.06em'
      }}>
        {label}
      </span>
      <div style={{
        fontSize: '26px',
        fontFamily: 'var(--font-heading)',
        fontWeight: '700',
        color: isDanger ? 'var(--danger)' : 'var(--fg)',
        lineHeight: '1'
      }}>
        {value}
      </div>
      {subtext && (
        <span style={{
          fontSize: '9px',
          color: isDanger ? 'var(--danger)' : 'var(--fg-dim)',
          textTransform: 'uppercase'
        }}>
          {subtext}
        </span>
      )}
    </div>
  );
};

export default StatBox;
