import React from 'react';
import GalleryCard from './GalleryCard';

const GalleryGrid = ({ events = [], onDelete, onImageClick, canEdit = false }) => {
  if (events.length === 0) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        border: '2px solid var(--line-strong)',
        backgroundColor: 'var(--panel)',
        color: 'var(--fg-dim)'
      }}>
        No gallery events uploaded for this club yet.
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
      gap: '24px'
    }}>
      {events.map((event) => (
        <GalleryCard
          key={event._id}
          event={event}
          onDelete={onDelete}
          onImageClick={onImageClick}
          canEdit={canEdit}
        />
      ))}
    </div>
  );
};

export default GalleryGrid;
