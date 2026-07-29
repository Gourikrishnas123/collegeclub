import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useClub } from '../context/ClubContext';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import MembersTable from '../components/members/MembersTable';
import SectionHead from '../components/common/SectionHead';
import Button from '../components/common/Button';
import { getMembersApi, addMemberApi, updateMemberApi, deleteMemberApi } from '../api/members';
import { UserPlus, ChevronLeft, ChevronRight } from 'lucide-react';

const Members = () => {
  const { clubId } = useParams();
  const { user, isSuperAdmin, isClubAdmin } = useAuth();
  const { currentClub, selectClub } = useClub();

  const [members, setMembers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [showAddModal, setShowAddModal] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('member');
  const [year, setYear] = useState('1st Year');
  const [modalError, setModalError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canEdit = isSuperAdmin || isClubAdmin;

  useEffect(() => {
    if (clubId) {
      selectClub(clubId);
      loadMembers(clubId, 1);
    }
  }, [clubId]);

  const loadMembers = async (targetClubId, pageNum = 1) => {
    try {
      const data = await getMembersApi(targetClubId, pageNum, 10);
      setMembers(data.members || []);
      setPagination({
        page: data.pagination?.page || 1,
        totalPages: data.pagination?.totalPages || 1
      });
    } catch (err) {
      console.error('Error loading members:', err);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      setModalError('Name and email are required.');
      return;
    }
    try {
      setSubmitting(true);
      setModalError('');
      await addMemberApi(clubId, { name, email, password, role, year });
      setShowAddModal(false);
      setName('');
      setEmail('');
      setPassword('');
      loadMembers(clubId, 1);
    } catch (err) {
      setModalError(err.response?.data?.message || 'Error adding member.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRoleChange = async (memberId, newRole) => {
    await updateMemberApi(clubId, memberId, { role: newRole });
    loadMembers(clubId, pagination.page);
  };

  const handleDeleteMember = async (memberId) => {
    if (window.confirm('Are you sure you want to remove this member from the club?')) {
      await deleteMemberApi(clubId, memberId);
      loadMembers(clubId, pagination.page);
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
          title="MEMBERS ROSTER"
          subtitle={`REGISTERED MEMBERS & OFFICERS OF ${currentClub?.name || 'CLUB'}`}
          action={canEdit && (
            <Button variant="primary" onClick={() => setShowAddModal(true)}>
              <UserPlus size={14} /> ADD MEMBER
            </Button>
          )}
        />

        <MembersTable
          members={members}
          onDelete={handleDeleteMember}
          onRoleChange={handleRoleChange}
          canEdit={canEdit}
          currentUserId={user?.id}
        />

        {/* Pagination Controls */}
        {pagination.totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page <= 1}
              onClick={() => loadMembers(clubId, pagination.page - 1)}
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
              onClick={() => loadMembers(clubId, pagination.page + 1)}
            >
              NEXT <ChevronRight size={12} />
            </Button>
          </div>
        )}

        {/* Add Member Modal */}
        {showAddModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>ADD MEMBER TO CLUB</h3>

              {modalError && (
                <div style={{
                  padding: '8px 12px',
                  backgroundColor: 'rgba(255, 92, 77, 0.1)',
                  border: '1px solid var(--danger)',
                  color: 'var(--danger)',
                  fontSize: '11px',
                  marginBottom: '16px'
                }}>
                  {modalError}
                </div>
              )}

              <form onSubmit={handleAddMember}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Johnson"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@college.edu"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Initial Password</label>
                    <input
                      type="password"
                      className="form-input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Default: member123"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Role</label>
                    <select
                      className="form-select"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value="member">MEMBER</option>
                      <option value="club_admin">CLUB ADMIN</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Academic Year / Grade</label>
                  <select
                    className="form-select"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Graduate">Graduate</option>
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                  <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                    CANCEL
                  </Button>
                  <Button type="submit" variant="primary" disabled={submitting}>
                    {submitting ? 'SAVING...' : 'ADD MEMBER'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Members;
