import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useClub } from '../context/ClubContext';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import AllClubsOverview from '../components/admin/AllClubsOverview';
import ClubsTable from '../components/admin/ClubsTable';
import SectionHead from '../components/common/SectionHead';
import Button from '../components/common/Button';
import { getAdminOverviewApi, createClubApi, deactivateClubApi } from '../api/clubs';
import { Plus, ShieldAlert } from 'lucide-react';

const AdminOverview = () => {
  const { isSuperAdmin } = useAuth();
  const { selectClub, refreshClub } = useClub();
  const navigate = useNavigate();

  const [overviewData, setOverviewData] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // New club form state
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [mark, setMark] = useState('');
  const [description, setDescription] = useState('');
  const [budgetTotal, setBudgetTotal] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isSuperAdmin) {
      navigate('/login');
      return;
    }
    loadOverview();
  }, [isSuperAdmin]);

  const loadOverview = async () => {
    try {
      setLoading(true);
      const data = await getAdminOverviewApi();
      setOverviewData(data);
    } catch (err) {
      console.error('Error loading admin overview:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectClub = (clubId) => {
    selectClub(clubId);
    navigate(`/club/${clubId}/dashboard`);
  };

  const handleToggleDeactivate = async (clubId) => {
    await deactivateClubApi(clubId);
    loadOverview();
    refreshClub();
  };

  const handleCreateClub = async (e) => {
    e.preventDefault();
    if (!name || !department || !mark) {
      setError('Name, department, and 2-letter badge code are required.');
      return;
    }
    try {
      setSubmitting(true);
      setError('');
      await createClubApi({
        name,
        department,
        mark,
        description,
        budgetTotal: Number(budgetTotal) || 0,
        adminName,
        adminEmail,
        adminPassword: adminPassword || 'password123'
      });
      setShowCreateModal(false);
      setName('');
      setDepartment('');
      setMark('');
      setDescription('');
      setBudgetTotal('');
      setAdminName('');
      setAdminEmail('');
      setAdminPassword('');
      loadOverview();
      refreshClub();
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating club.');
    } finally {
      setSubmitting(false);
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
          title="SUPER ADMIN CONTROL PANEL"
          subtitle="AGGREGATED METRICS & CAMPUS MULTI-CLUB OVERVIEW"
          action={(
            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
              <Plus size={14} /> CREATE NEW CLUB
            </Button>
          )}
        />

        {/* Aggregated Metrics Grid */}
        <AllClubsOverview stats={overviewData?.stats} />

        {/* All Clubs Directory Table */}
        <div style={{ marginTop: '32px' }}>
          <SectionHead
            title="ALL REGISTERED CLUBS DIRECTORY"
            subtitle="CLICK ANY CLUB ROW TO DRILL DOWN INTO ITS INDIVIDUAL DASHBOARD & MANAGEMENT SYSTEM"
          />
          <ClubsTable
            clubs={overviewData?.clubs || []}
            onSelectClub={handleSelectClub}
            onToggleDeactivate={handleToggleDeactivate}
          />
        </div>

        {/* Create Club Modal */}
        {showCreateModal && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '580px' }}>
              <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>INITIALIZE NEW COLLEGE CLUB</h3>

              {error && (
                <div style={{
                  padding: '8px 12px',
                  backgroundColor: 'rgba(255, 92, 77, 0.1)',
                  border: '1px solid var(--danger)',
                  color: 'var(--danger)',
                  fontSize: '11px',
                  marginBottom: '16px'
                }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleCreateClub}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Club Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. AI & Robotics Society"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Badge Code (2-4 letters)</label>
                    <input
                      type="text"
                      maxLength={4}
                      className="form-input"
                      value={mark}
                      onChange={(e) => setMark(e.target.value.toUpperCase())}
                      placeholder="AI"
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Department / School</label>
                    <input
                      type="text"
                      className="form-input"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="School of Computing"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Annual Budget Allocation ($)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={budgetTotal}
                      onChange={(e) => setBudgetTotal(e.target.value)}
                      placeholder="15000"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Club Description</label>
                  <input
                    type="text"
                    className="form-input"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief objective of the organization..."
                  />
                </div>

                <div style={{
                  padding: '12px',
                  border: '1px solid var(--line)',
                  backgroundColor: 'var(--bg)',
                  marginTop: '12px',
                  marginBottom: '16px'
                }}>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '8px' }}>
                    🔑 INITIAL CLUB ADMIN ASSIGNMENT
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Admin Name"
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                    />
                    <input
                      type="email"
                      className="form-input"
                      placeholder="Admin Email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                    />
                  </div>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Initial Password (default: password123)"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    style={{ marginTop: '8px' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                    CANCEL
                  </Button>
                  <Button type="submit" variant="primary" disabled={submitting}>
                    {submitting ? 'CREATING...' : 'CREATE CLUB & ASSIGN ADMIN'}
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

export default AdminOverview;
