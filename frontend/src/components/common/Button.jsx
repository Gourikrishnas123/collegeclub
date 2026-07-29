import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', // 'primary' | 'secondary' | 'danger' | 'outline'
  size = 'md', 
  onClick, 
  type = 'button',
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseStyle = {
    fontFamily: 'var(--font-mono)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontWeight: '700',
    borderRadius: '0px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1,
    transition: 'all 0.15s ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px'
  };

  const sizes = {
    sm: { padding: '5px 10px', fontSize: '10px' },
    md: { padding: '8px 15px', fontSize: '11px' },
    lg: { padding: '11px 20px', fontSize: '12px' }
  };

  let variantStyle = {};
  if (variant === 'primary') {
    variantStyle = {
      backgroundColor: 'var(--accent)',
      color: 'var(--bg)',
      border: '1px solid var(--accent)'
    };
  } else if (variant === 'danger') {
    variantStyle = {
      backgroundColor: 'transparent',
      color: 'var(--danger)',
      border: '1px solid var(--danger)'
    };
  } else if (variant === 'secondary') {
    variantStyle = {
      backgroundColor: 'var(--panel)',
      color: 'var(--fg)',
      border: '1px solid var(--line)'
    };
  } else {
    // outline
    variantStyle = {
      backgroundColor: 'transparent',
      color: 'var(--fg)',
      border: '1px solid var(--line)'
    };
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{ ...baseStyle, ...sizes[size], ...variantStyle }}
      className={className}
      onMouseEnter={(e) => {
        if (!disabled) {
          if (variant === 'primary') {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--accent)';
          } else if (variant === 'danger') {
            e.currentTarget.style.backgroundColor = 'var(--danger)';
            e.currentTarget.style.color = 'var(--bg)';
          } else {
            e.currentTarget.style.borderColor = 'var(--line-strong)';
          }
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          if (variant === 'primary') {
            e.currentTarget.style.backgroundColor = 'var(--accent)';
            e.currentTarget.style.color = 'var(--bg)';
          } else if (variant === 'danger') {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--danger)';
          } else {
            e.currentTarget.style.borderColor = 'var(--line)';
          }
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
