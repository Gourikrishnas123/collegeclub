import React from 'react';
import Tag from '../common/Tag';
import Button from '../common/Button';
import { Trash2, Image as ImageIcon } from 'lucide-react';

const GalleryCard = ({ event, onDelete, onImageClick, canEdit = false }) => {
  return (
    <div style={{
      border: '2px solid var(--line-strong)',
      backgroundColor: 'var(--panel)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      {/* Event Header */}
      <div style={{ padding: '16px', borderBottom: '1px solid var(--line)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
          <div>
            <h3 style={{ fontSize: '15px', marginBottom: '4px' }}>{event.title}</h3>
            <span style={{ fontSize: '11px', color: 'var(--fg-dim)', textTransform: 'uppercase' }}>
              {new Date(event.date || event.createdAt).toLocaleDateString()}
            </span>
          </div>
          {canEdit && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => onDelete && onDelete(event._id)}
            >
              <Trash2 size={12} />
            </Button>
          )}
        </div>
        {event.description && (
          <p style={{ fontSize: '12px', color: 'var(--fg-dim)', marginTop: '8px' }}>
            {event.description}
          </p>
        )}
      </div>

      {/* Image Grid Preview */}
      <div style={{
        padding: '16px',
        display: 'grid',
        gridTemplateColumns: event.images?.length === 1 ? '1fr' : 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: '10px'
      }}>
        {event.images && event.images.map((img, idx) => (
          <div
            key={idx}
            onClick={() => onImageClick && onImageClick(img.url, img.caption, event.title)}
            style={{
              position: 'relative',
              cursor: 'pointer',
              border: '1px solid var(--line-strong)',
              overflow: 'hidden',
              height: '110px'
            }}
          >
            <img
              src={img.url.startsWith('http') ? img.url : `http://localhost:3001${img.url}`}
              alt={img.caption || event.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.00)'}
            />
            {img.caption && (
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'rgba(10, 10, 10, 0.85)',
                color: 'var(--fg)',
                padding: '4px 6px',
                fontSize: '9px',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {img.caption}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Event Footer */}
      <div style={{
        padding: '10px 16px',
        borderTop: '1px solid var(--line)',
        backgroundColor: 'var(--bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '11px',
        color: 'var(--fg-dim)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ImageIcon size={12} />
          <span>{event.images?.length || 0} IMAGES</span>
        </div>
        <span>Posted by {event.createdBy?.name || 'Admin'}</span>
      </div>
    </div>
  );
};

export default GalleryCard;
