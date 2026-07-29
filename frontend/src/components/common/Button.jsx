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
    letterSpacing: '0.06em',
    fontWeight: '600',
    borderRadius: '0px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.15s ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  };

  const sizes = {
    sm: { padding: '6px 12px', fontSize: '10px' },
    md: { padding: '10px 18px', fontSize: '11px' },
    lg: { padding: '12px 24px', fontSize: '13px' }
  };

  // Hover state handles color inversion
  let variantStyle = {};
  if (variant === 'primary') {
    variantStyle = {
      backgroundColor: 'var(--accent)',
      color: 'var(--bg)',
      border: '2px solid var(--accent)'
    };
  } else if (variant === 'danger') {
    variantStyle = {
      backgroundColor: 'var(--danger)',
      color: 'var(--bg)',
      border: '2px solid var(--danger)'
    };
  } else if (variant === 'secondary') {
    variantStyle = {
      backgroundColor: 'var(--panel)',
      color: 'var(--fg)',
      border: '2px solid var(--line-strong)'
    };
  } else {
    // outline
    variantStyle = {
      backgroundColor: 'transparent',
      color: 'var(--fg)',
      border: '1px solid var(--line-strong)'
    };
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{ ...baseStyle, ...sizes[size], ...variantStyle }}
      className={`btn-${variant} ${className}`}
      onMouseEnter={(e) => {
        if (!disabled) {
          if (variant === 'primary') {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--accent)';
          } else if (variant === 'danger') {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--danger)';
          } else {
            e.currentTarget.style.backgroundColor = 'var(--fg)';
            e.currentTarget.style.color = 'var(--bg)';
          }
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          if (variant === 'primary') {
            e.currentTarget.style.backgroundColor = 'var(--accent)';
            e.currentTarget.style.color = 'var(--bg)';
          } else if (variant === 'danger') {
            e.currentTarget.style.backgroundColor = 'var(--danger)';
            e.currentTarget.style.color = 'var(--bg)';
          } else if (variant === 'secondary') {
            e.currentTarget.style.backgroundColor = 'var(--panel)';
            e.currentTarget.style.color = 'var(--fg)';
          } else {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--fg)';
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
