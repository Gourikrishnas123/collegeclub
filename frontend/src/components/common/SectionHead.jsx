import React from 'react';

const SectionHead = ({ title, subtitle, action }) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingBottom: '14px',
      marginBottom: '20px',
      borderBottom: '1px solid var(--line)'
    }}>
      <div>
        <h2 style={{ fontSize: '18px', letterSpacing: '-0.01em' }}>{title}</h2>
        {subtitle && (
          <p style={{ fontSize: '10px', color: 'var(--fg-dim)', marginTop: '2px', textTransform: 'uppercase' }}>
            {subtitle}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

export default SectionHead;
