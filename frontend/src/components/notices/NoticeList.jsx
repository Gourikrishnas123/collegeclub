import React from 'react';
import NoticeCard from './NoticeCard';

const NoticeList = ({ notices = [], onDelete, onTogglePin, canEdit = false }) => {
  if (notices.length === 0) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        border: '2px solid var(--line-strong)',
        backgroundColor: 'var(--panel)',
        color: 'var(--fg-dim)'
      }}>
        No notices posted for this club yet.
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      {notices.map((notice) => (
        <NoticeCard
          key={notice._id}
          notice={notice}
          onDelete={onDelete}
          onTogglePin={onTogglePin}
          canEdit={canEdit}
        />
      ))}
    </div>
  );
};

export default NoticeList;
