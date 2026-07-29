import React from 'react';
import StatGrid from '../dashboard/StatGrid';

const AllClubsOverview = ({ stats }) => {
  if (!stats) return null;

  const statItems = [
    { label: 'TOTAL REGISTERED CLUBS', value: stats.totalClubs || 0, subtext: 'ACTIVE ORGANIZATIONS' },
    { label: 'TOTAL ACTIVE MEMBERS', value: stats.totalMembers || 0, subtext: 'STUDENTS & ADMINS' },
    { label: 'COMBINED BUDGET UTILIZATION', value: `${stats.budgetUtilization || 0}%`, subtext: `$${(stats.totalSpent || 0).toLocaleString()} OF $${(stats.totalBudget || 0).toLocaleString()}`, isDanger: stats.budgetUtilization > 90 },
    { label: 'TOTAL ANNOUNCEMENTS', value: stats.totalNotices || 0, subtext: 'POSTED ACROSS ALL CLUBS' }
  ];

  return <StatGrid stats={statItems} />;
};

export default AllClubsOverview;
