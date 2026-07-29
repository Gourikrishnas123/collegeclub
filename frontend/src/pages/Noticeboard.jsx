import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useClub } from '../context/ClubContext';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import NoticeList from '../components/notices/NoticeList';
import PostNoticeForm from '../components/notices/PostNoticeForm';
import SectionHead from '../components/common/SectionHead';
import Button from '../components/common/Button';
import { getNoticesApi, createNoticeApi, updateNoticeApi, deleteNoticeApi } from '../api/notices';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';

const Noticeboard = () => {
  const { clubId } = useParams();
  const { isSuperAdmin, isClubAdmin } = useAuth();
  const { currentClub, selectClub } = useClub();

  const [notices, setNotices] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [showPostModal, setShowPostModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const canEdit = isSuperAdmin || isClubAdmin;

  useEffect(() => {
    if (clubId) {
      selectClub(clubId);
      loadNotices(clubId, 1);
    }
  }, [clubId]);

  const loadNotices = async (targetClubId, pageNum = 1) => {
    try {
      setLoading(true);
      const data = await getNoticesApi(targetClubId, pageNum, 8);
      setNotices(data.notices || []);
      setPagination({
        page: data.pagination?.page || 1,
        totalPages: data.pagination?.totalPages || 1
      });
    } catch (err) {
      console.error('Error loading notices:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostSubmit = async (noticeData) => {
    await createNoticeApi(clubId, noticeData);
    loadNotices(clubId, 1);
  };

  const handleTogglePin = async (noticeId, currentPinnedStatus) => {
    await updateNoticeApi(clubId, noticeId, { pinned: currentPinnedStatus });
    loadNotices(clubId, pagination.page);
  };

  const handleDeleteNotice = async (noticeId) => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      await deleteNoticeApi(clubId, noticeId);
      loadNotices(clubId, pagination.page);
    }
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
          title="OFFICIAL NOTICEBOARD"
          subtitle={`ANNOUNCEMENTS & URGENT BROADCASTS FOR ${currentClub?.name || 'CLUB'}`}
          action={canEdit && (
            <Button variant="primary" onClick={() => setShowPostModal(true)}>
              <Plus size={14} /> POST ANNOUNCEMENT
            </Button>
          )}
        />

        <NoticeList
          notices={notices}
          onDelete={handleDeleteNotice}
          onTogglePin={handleTogglePin}
          canEdit={canEdit}
        />

        {/* Pagination Controls */}
        {pagination.totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page <= 1}
              onClick={() => loadNotices(clubId, pagination.page - 1)}
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
              onClick={() => loadNotices(clubId, pagination.page + 1)}
            >
              NEXT <ChevronRight size={12} />
            </Button>
          </div>
        )}

        {/* Post Notice Modal */}
        {showPostModal && (
          <PostNoticeForm
            onSubmit={handlePostSubmit}
            onClose={() => setShowPostModal(false)}
          />
        )}
      </main>
    </div>
  );
};

export default Noticeboard;
