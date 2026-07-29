import React from 'react';
import Tag from '../common/Tag';
import Button from '../common/Button';
import { Pin, Trash2 } from 'lucide-react';

const NoticeCard = ({ notice, onDelete, onTogglePin, canEdit = false }) => {
  const isUrgent = notice.tag === 'Urgent';

  return (
    <div style={{
      border: notice.pinned ? '2px solid var(--accent)' : '2px solid var(--line-strong)',
      backgroundColor: notice.pinned ? 'rgba(212, 255, 61, 0.03)' : 'var(--panel)',
      padding: '20px',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: '12px'
    }}>
      {/* Top Metadata */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {notice.pinned && (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              color: 'var(--accent)',
              fontSize: '10px',
              fontWeight: '700',
              textTransform: 'uppercase'
            }}>
              <Pin size={12} style={{ fill: 'var(--accent)' }} /> PINNED
            </span>
          )}
          <Tag variant={isUrgent ? 'filled-urgent' : notice.tag}>
            {notice.tag}
          </Tag>
        </div>

        <span style={{ fontSize: '11px', color: 'var(--fg-dim)' }}>
          {new Date(notice.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Title and Body */}
      <div>
        <h3 style={{ fontSize: '16px', marginBottom: '8px', lineHeight: '1.3' }}>
          {notice.title}
        </h3>
        <p style={{
          fontSize: '12px',
          color: 'var(--fg)',
          lineHeight: '1.6',
          whiteSpace: 'pre-wrap'
        }}>
          {notice.body}
        </p>
      </div>

      {/* Footer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '12px',
        borderTop: '1px solid var(--line)',
        fontSize: '11px',
        color: 'var(--fg-dim)'
      }}>
        <span>Posted by {notice.postedBy?.name || 'Admin'}</span>

        {canEdit && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              variant={notice.pinned ? 'primary' : 'outline'}
              size="sm"
              onClick={() => onTogglePin && onTogglePin(notice._id, !notice.pinned)}
            >
              <Pin size={10} /> {notice.pinned ? 'UNPIN' : 'PIN'}
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => onDelete && onDelete(notice._id)}
            >
              <Trash2 size={10} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoticeCard;
