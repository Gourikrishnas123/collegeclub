import React from 'react';

const BudgetBar = ({ budgetTotal = 0, budgetSpent = 0 }) => {
  const rawUtilization = budgetTotal > 0 ? (budgetSpent / budgetTotal) * 100 : 0;
  const utilization = Math.min(100, rawUtilization);
  const isHighUtilization = rawUtilization > 90;
  const remaining = Math.max(0, budgetTotal - budgetSpent);

  return (
    <div style={{
      border: '2px solid var(--line-strong)',
      backgroundColor: 'var(--panel)',
      padding: '20px',
      marginBottom: '24px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '12px'
      }}>
        <div>
          <span style={{ fontSize: '11px', color: 'var(--fg-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            ANNUAL BUDGET UTILIZATION
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginTop: '4px' }}>
            <span style={{
              fontSize: '24px',
              fontFamily: 'var(--font-heading)',
              fontWeight: '700',
              color: isHighUtilization ? 'var(--danger)' : 'var(--accent)'
            }}>
              ${budgetSpent.toLocaleString()}
            </span>
            <span style={{ fontSize: '13px', color: 'var(--fg-dim)' }}>
              of ${budgetTotal.toLocaleString()} total
            </span>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{
            fontSize: '18px',
            fontFamily: 'var(--font-heading)',
            fontWeight: '700',
            color: isHighUtilization ? 'var(--danger)' : 'var(--fg)'
          }}>
            {rawUtilization.toFixed(1)}%
          </span>
          <div style={{ fontSize: '10px', color: isHighUtilization ? 'var(--danger)' : 'var(--fg-dim)', textTransform: 'uppercase' }}>
            {isHighUtilization ? '⚠️ BUDGET CRITICAL (>90%)' : `$${remaining.toLocaleString()} REMAINING`}
          </div>
        </div>
      </div>

      {/* Progress Bar Container - 2px solid line-strong */}
      <div style={{
        width: '100%',
        height: '20px',
        backgroundColor: 'var(--bg)',
        border: '2px solid var(--line-strong)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${utilization}%`,
          height: '100%',
          backgroundColor: isHighUtilization ? 'var(--danger)' : 'var(--accent)',
          transition: 'width 0.3s ease, background-color 0.3s ease'
        }} />
      </div>
    </div>
  );
};

export default BudgetBar;
