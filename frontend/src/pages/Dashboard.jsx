import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useClub } from '../context/ClubContext';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import StatGrid from '../components/dashboard/StatGrid';
import BudgetBar from '../components/finance/BudgetBar';
import TransactionTable from '../components/finance/TransactionTable';
import SectionHead from '../components/common/SectionHead';
import Tag from '../components/common/Tag';
import { getFinanceSummaryApi, getTransactionsApi } from '../api/finance';
import { getNoticesApi } from '../api/notices';
import { getMembersApi } from '../api/members';
import { getGalleryApi } from '../api/gallery';

const Dashboard = () => {
  const { clubId } = useParams();
  const { isSuperAdmin, isClubAdmin } = useAuth();
  const { currentClub, selectClub } = useClub();

  const [financeSummary, setFinanceSummary] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [noticesCount, setNoticesCount] = useState(0);
  const [membersCount, setMembersCount] = useState(0);
  const [galleryCount, setGalleryCount] = useState(0);
  const [urgentNotice, setUrgentNotice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (clubId) {
      selectClub(clubId);
      loadDashboardData(clubId);
    }
  }, [clubId]);

  const loadDashboardData = async (targetClubId) => {
    try {
      setLoading(true);

      // Fetch summary data
      const fin = await getFinanceSummaryApi(targetClubId);
      setFinanceSummary(fin);

      // Fetch members count
      const memData = await getMembersApi(targetClubId, 1, 1);
      setMembersCount(memData.pagination?.total || 0);

      // Fetch notices
      const notData = await getNoticesApi(targetClubId, 1, 10);
      setNoticesCount(notData.pagination?.total || 0);
      const urgent = notData.notices?.find(n => n.tag === 'Urgent' || n.pinned);
      setUrgentNotice(urgent || null);

      // Fetch gallery
      const galData = await getGalleryApi(targetClubId, 1, 1);
      setGalleryCount(galData.pagination?.total || 0);

      // Fetch transactions (for super_admin and club_admin)
      if (isSuperAdmin || isClubAdmin) {
        const txData = await getTransactionsApi(targetClubId, 1, 5);
        setRecentTransactions(txData.transactions || []);
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const statItems = [
    { label: 'REGISTERED MEMBERS', value: membersCount, subtext: 'ACTIVE STUDENT ROSTER' },
    { label: 'BUDGET UTILIZATION', value: `${financeSummary?.utilization || 0}%`, subtext: `$${(financeSummary?.budgetSpent || 0).toLocaleString()} / $${(financeSummary?.budgetTotal || 0).toLocaleString()}`, isDanger: financeSummary?.utilization > 90 },
    { label: 'ANNOUNCEMENTS', value: noticesCount, subtext: 'POSTED ON NOTICEBOARD' },
    { label: 'GALLERY EVENTS', value: galleryCount, subtext: 'EVENT PHOTO ALBUMS' }
  ];

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
          title="CLUB DASHBOARD OVERVIEW"
          subtitle={`STATISTICS & RECENT ACTIVITY FOR ${currentClub?.name || 'CLUB'}`}
        />

        {/* Urgent Notice Banner if exists */}
        {urgentNotice && (
          <div style={{
            border: '2px solid var(--accent)',
            backgroundColor: 'rgba(212, 255, 61, 0.05)',
            padding: '16px 20px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Tag variant="filled-urgent">URGENT ANNOUNCEMENT</Tag>
                <span style={{ fontSize: '11px', color: 'var(--fg-dim)' }}>
                  {new Date(urgentNotice.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h4 style={{ fontSize: '14px' }}>{urgentNotice.title}</h4>
              <p style={{ fontSize: '12px', color: 'var(--fg-dim)', marginTop: '2px' }}>{urgentNotice.body}</p>
            </div>
          </div>
        )}

        {/* Canonical 4-Column Stat Grid */}
        <StatGrid stats={statItems} />

        {/* Live Budget Utilization Bar */}
        <BudgetBar
          budgetTotal={financeSummary?.budgetTotal || 0}
          budgetSpent={financeSummary?.budgetSpent || 0}
        />

        {/* Recent Transactions Section (for admins) */}
        {(isSuperAdmin || isClubAdmin) && (
          <div style={{ marginTop: '32px' }}>
            <SectionHead
              title="RECENT TRANSACTIONS"
              subtitle="LATEST FINANCIAL REVENUE & EXPENSE RECORDINGS"
            />
            <TransactionTable transactions={recentTransactions} canEdit={false} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
