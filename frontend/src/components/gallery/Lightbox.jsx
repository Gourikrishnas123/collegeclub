import React from 'react';
import { X } from 'lucide-react';

const Lightbox = ({ url, caption, title, onClose }) => {
  if (!url) return null;

  const fullUrl = url.startsWith('http') ? url : `http://localhost:3001${url}`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        style={{
          position: 'relative',
          maxWidth: '90vw',
          maxHeight: '90vh',
          backgroundColor: 'var(--panel)',
          border: '2px solid var(--line-strong)',
          padding: '16px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            backgroundColor: 'var(--accent)',
            color: 'var(--bg)',
            border: 'none',
            padding: '6px',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          <X size={16} />
        </button>

        <div style={{ marginBottom: '12px' }}>
          <h4 style={{ fontSize: '14px' }}>{title || 'EVENT IMAGE'}</h4>
          {caption && <p style={{ fontSize: '11px', color: 'var(--fg-dim)', marginTop: '2px' }}>{caption}</p>}
        </div>

        <img
          src={fullUrl}
          alt={caption || 'Enlarged gallery photo'}
          style={{
            maxWidth: '100%',
            maxHeight: '75vh',
            display: 'block',
            margin: '0 auto',
            border: '1px solid var(--line-strong)'
          }}
        />
      </div>
    </div>
  );
};

export default Lightbox;
