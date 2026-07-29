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

  useEffect(() => {
    if (clubId) {
      selectClub(clubId);
      loadDashboardData(clubId);
    }
  }, [clubId]);

  const loadDashboardData = async (targetClubId) => {
    try {
      const fin = await getFinanceSummaryApi(targetClubId);
      setFinanceSummary(fin);

      const memData = await getMembersApi(targetClubId, 1, 1);
      setMembersCount(memData.pagination?.total || 0);

      const notData = await getNoticesApi(targetClubId, 1, 10);
      setNoticesCount(notData.pagination?.total || 0);
      const urgent = notData.notices?.find(n => n.tag === 'Urgent' || n.pinned);
      setUrgentNotice(urgent || null);

      const galData = await getGalleryApi(targetClubId, 1, 1);
      setGalleryCount(galData.pagination?.total || 0);

      if (isSuperAdmin || isClubAdmin) {
        const txData = await getTransactionsApi(targetClubId, 1, 5);
        setRecentTransactions(txData.transactions || []);
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    }
  };

  const statItems = [
    { label: 'MEMBERS', value: membersCount, subtext: 'ACTIVE ROSTER' },
    { label: 'BUDGET USED', value: `${financeSummary?.utilization || 0}%`, subtext: `$${(financeSummary?.budgetSpent || 0).toLocaleString()} SPENT`, isDanger: financeSummary?.utilization > 90 },
    { label: 'NOTICES', value: noticesCount, subtext: 'ANNOUNCEMENTS' },
    { label: 'GALLERY', value: galleryCount, subtext: 'PHOTO ALBUMS' }
  ];

  return (
    <div>
      <Sidebar />
      <Topbar />
      <main style={{
        marginLeft: 'var(--sidebar-width)',
        padding: '36px 40px',
        minHeight: 'calc(100vh - var(--topbar-height))',
        backgroundColor: 'var(--bg)'
      }}>
        <SectionHead
          title="DASHBOARD"
          subtitle={`OVERVIEW FOR ${currentClub?.name || 'CLUB'}`}
        />

        {/* Minimal Urgent Notice Banner */}
        {urgentNotice && (
          <div style={{
            border: '1px solid var(--accent)',
            backgroundColor: 'rgba(212, 255, 61, 0.04)',
            padding: '12px 16px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                <Tag variant="filled-urgent">URGENT</Tag>
                <span style={{ fontSize: '10px', color: 'var(--fg-dim)' }}>
                  {new Date(urgentNotice.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h4 style={{ fontSize: '13px' }}>{urgentNotice.title}</h4>
              <p style={{ fontSize: '11px', color: 'var(--fg-dim)', marginTop: '2px' }}>{urgentNotice.body}</p>
            </div>
          </div>
        )}

        {/* Minimal Stat Grid */}
        <StatGrid stats={statItems} />

        {/* Compact Live Budget Bar */}
        <BudgetBar
          budgetTotal={financeSummary?.budgetTotal || 0}
          budgetSpent={financeSummary?.budgetSpent || 0}
        />

        {/* Recent Transactions Table */}
        {(isSuperAdmin || isClubAdmin) && (
          <div style={{ marginTop: '28px' }}>
            <SectionHead
              title="RECENT ACTIVITY"
              subtitle="LATEST FINANCIAL TRANSACTIONS"
            />
            <TransactionTable transactions={recentTransactions} canEdit={false} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
