import React from 'react';

const SectionHead = ({ title, subtitle, action }) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingBottom: '16px',
      marginBottom: '20px',
      borderBottom: '2px solid var(--line-strong)'
    }}>
      <div>
        <h2 style={{ fontSize: '20px', letterSpacing: '-0.01em' }}>{title}</h2>
        {subtitle && (
          <p style={{ fontSize: '11px', color: 'var(--fg-dim)', marginTop: '4px', textTransform: 'uppercase' }}>
            {subtitle}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

export default SectionHead;
