import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useClub } from '../context/ClubContext';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import GalleryGrid from '../components/gallery/GalleryGrid';
import UploadDropzone from '../components/gallery/UploadDropzone';
import Lightbox from '../components/gallery/Lightbox';
import SectionHead from '../components/common/SectionHead';
import Button from '../components/common/Button';
import { getGalleryApi, createGalleryEventApi, deleteGalleryEventApi } from '../api/gallery';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';

const Gallery = () => {
  const { clubId } = useParams();
  const { isSuperAdmin, isClubAdmin } = useAuth();
  const { currentClub, selectClub } = useClub();

  const [events, setEvents] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [loading, setLoading] = useState(true);

  const canEdit = isSuperAdmin || isClubAdmin;

  useEffect(() => {
    if (clubId) {
      selectClub(clubId);
      loadGallery(clubId, 1);
    }
  }, [clubId]);

  const loadGallery = async (targetClubId, pageNum = 1) => {
    try {
      setLoading(true);
      const data = await getGalleryApi(targetClubId, pageNum, 6);
      setEvents(data.events || []);
      setPagination({
        page: data.pagination?.page || 1,
        totalPages: data.pagination?.totalPages || 1
      });
    } catch (err) {
      console.error('Error loading gallery:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSubmit = async (formData) => {
    await createGalleryEventApi(clubId, formData);
    loadGallery(clubId, 1);
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this gallery event?')) {
      await deleteGalleryEventApi(clubId, eventId);
      loadGallery(clubId, pagination.page);
    }
  };

  const handleImageClick = (url, caption, title) => {
    setLightboxImage({ url, caption, title });
  };

  return (
    <div>
      <Sidebar />
      <Topbar />
      <main style={{
        marginLeft: 'var(--sidebar-width)',
        padding: '32px',
        minHeight: 'calc(100vh - var(--topbar-height))',
        backgroundColor: 'var(--bg)'
      }}>
        <SectionHead
          title="EVENT GALLERY"
          subtitle={`PHOTO ALBUMS & EVENT SHOWCASES FOR ${currentClub?.name || 'CLUB'}`}
          action={canEdit && (
            <Button variant="primary" onClick={() => setShowUploadModal(true)}>
              <Plus size={14} /> UPLOAD EVENT PHOTOS
            </Button>
          )}
        />

        <GalleryGrid
          events={events}
          onDelete={handleDeleteEvent}
          onImageClick={handleImageClick}
          canEdit={canEdit}
        />

        {/* Pagination Controls */}
        {pagination.totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page <= 1}
              onClick={() => loadGallery(clubId, pagination.page - 1)}
            >
              <ChevronLeft size={12} /> PREV
            </Button>
            <span style={{ fontSize: '11px', color: 'var(--fg-dim)' }}>
              PAGE {pagination.page} OF {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => loadGallery(clubId, pagination.page + 1)}
            >
              NEXT <ChevronRight size={12} />
            </Button>
          </div>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <UploadDropzone
            onSubmit={handleUploadSubmit}
            onClose={() => setShowUploadModal(false)}
          />
        )}

        {/* Lightbox Modal */}
        {lightboxImage && (
          <Lightbox
            url={lightboxImage.url}
            caption={lightboxImage.caption}
            title={lightboxImage.title}
            onClose={() => setLightboxImage(null)}
          />
        )}
      </main>
    </div>
  );
};

export default Gallery;
