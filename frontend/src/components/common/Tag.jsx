import React from 'react';

const Tag = ({ 
  children, 
  variant = 'default', // 'accent' | 'danger' | 'filled-urgent' | 'default' | 'credit' | 'debit'
  size = 'sm' 
}) => {
  const baseStyle = {
    fontFamily: 'var(--font-mono)',
    fontSize: size === 'sm' ? '10px' : '11px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    padding: '2px 8px',
    borderRadius: '2px',
    display: 'inline-flex',
    alignItems: 'center',
    lineHeight: '1.2'
  };

  let variantStyle = {};

  if (variant === 'filled-urgent' || variant === 'Urgent') {
    variantStyle = {
      backgroundColor: 'var(--accent)',
      color: 'var(--bg)',
      border: '1px solid var(--accent)'
    };
  } else if (variant === 'accent' || variant === 'credit' || variant === 'in' || variant === 'Events') {
    variantStyle = {
      backgroundColor: 'transparent',
      color: 'var(--accent)',
      border: '1px solid var(--accent)'
    };
  } else if (variant === 'danger' || variant === 'debit' || variant === 'out') {
    variantStyle = {
      backgroundColor: 'transparent',
      color: 'var(--danger)',
      border: '1px solid var(--danger)'
    };
  } else if (variant === 'Finance') {
    variantStyle = {
      backgroundColor: 'transparent',
      color: '#4D9EFF',
      border: '1px solid #4D9EFF'
    };
  } else {
    variantStyle = {
      backgroundColor: 'transparent',
      color: 'var(--fg-dim)',
      border: '1px solid var(--line)'
    };
  }

  return (
    <span style={{ ...baseStyle, ...variantStyle }}>
      {children}
    </span>
  );
};

export default Tag;
