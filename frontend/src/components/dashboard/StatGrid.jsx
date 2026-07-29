import React from 'react';
import StatBox from '../common/StatBox';

const StatGrid = ({ stats = [] }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      border: '2px solid var(--line-strong)',
      backgroundColor: 'var(--line)',
      gap: '1px', // internal 1px line divider
      marginBottom: '24px'
    }}>
      {stats.map((stat, idx) => (
        <StatBox
          key={idx}
          label={stat.label}
          value={stat.value}
          subtext={stat.subtext}
          isDanger={stat.isDanger}
        />
      ))}
    </div>
  );
};

export default StatGrid;
