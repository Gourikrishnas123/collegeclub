import React from 'react';

const Table = ({ headers = [], children }) => {
  return (
    <div style={{ width: '100%', overflowX: 'auto', border: '1px solid var(--line)' }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        textAlign: 'left',
        fontSize: '11px',
        fontFamily: 'var(--font-mono)'
      }}>
        <thead>
          <tr style={{
            background: 'var(--panel)',
            borderBottom: '1px solid var(--line)'
          }}>
            {headers.map((h, idx) => (
              <th key={idx} style={{
                padding: '10px 14px',
                color: 'var(--fg-dim)',
                textTransform: 'uppercase',
                fontSize: '10px',
                fontWeight: '600',
                letterSpacing: '0.05em'
              }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {children}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
