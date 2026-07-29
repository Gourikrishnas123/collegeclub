import React from 'react';

const StatBox = ({ label, value, subtext, isDanger = false }) => {
  return (
    <div style={{
      padding: '20px',
      background: 'var(--panel)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: '8px'
    }}>
      <span style={{
        fontSize: '11px',
        fontFamily: 'var(--font-mono)',
        color: 'var(--fg-dim)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        {label}
      </span>
      <div style={{
        fontSize: '28px',
        fontFamily: 'var(--font-heading)',
        fontWeight: '700',
        color: isDanger ? 'var(--danger)' : 'var(--fg)',
        lineHeight: '1'
      }}>
        {value}
      </div>
      {subtext && (
        <span style={{
          fontSize: '10px',
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
