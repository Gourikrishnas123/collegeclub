import React from 'react';

const BudgetBar = ({ budgetTotal = 0, budgetSpent = 0 }) => {
  const rawUtilization = budgetTotal > 0 ? (budgetSpent / budgetTotal) * 100 : 0;
  const utilization = Math.min(100, rawUtilization);
  const isHighUtilization = rawUtilization > 90;
  const remaining = Math.max(0, budgetTotal - budgetSpent);

  return (
    <div style={{
      border: '1px solid var(--line)',
      backgroundColor: 'var(--panel)',
      padding: '16px 20px',
      marginBottom: '24px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
          <span style={{ fontSize: '10px', color: 'var(--fg-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            BUDGET:
          </span>
          <span style={{
            fontSize: '18px',
            fontFamily: 'var(--font-heading)',
            fontWeight: '700',
            color: isHighUtilization ? 'var(--danger)' : 'var(--accent)'
          }}>
            ${budgetSpent.toLocaleString()}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--fg-dim)' }}>
            / ${budgetTotal.toLocaleString()}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '10px', color: isHighUtilization ? 'var(--danger)' : 'var(--fg-dim)', textTransform: 'uppercase' }}>
            {isHighUtilization ? '⚠️ CRITICAL (>90%)' : `$${remaining.toLocaleString()} REMAINING`}
          </span>
          <span style={{
            fontSize: '14px',
            fontFamily: 'var(--font-heading)',
            fontWeight: '700',
            color: isHighUtilization ? 'var(--danger)' : 'var(--fg)'
          }}>
            {rawUtilization.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Thin Minimalist Progress Bar */}
      <div style={{
        width: '100%',
        height: '6px',
        backgroundColor: 'var(--bg)',
        border: '1px solid var(--line)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${utilization}%`,
          height: '100%',
          backgroundColor: isHighUtilization ? 'var(--danger)' : 'var(--accent)',
          transition: 'width 0.3s ease'
        }} />
      </div>
    </div>
  );
};

export default BudgetBar;
