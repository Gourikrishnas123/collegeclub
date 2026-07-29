import React from 'react';

const Table = ({ headers = [], children, onRowClick }) => {
  return (
    <div style={{ width: '100%', overflowX: 'auto', border: '2px solid var(--line-strong)' }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        textAlign: 'left',
        fontSize: '12px',
        fontFamily: 'var(--font-mono)'
      }}>
        <thead>
          <tr style={{
            background: 'var(--panel)',
            borderBottom: '2px solid var(--line-strong)'
          }}>
            {headers.map((h, idx) => (
              <th key={idx} style={{
                padding: '12px 16px',
                color: 'var(--fg-dim)',
                textTransform: 'uppercase',
                fontSize: '11px',
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
