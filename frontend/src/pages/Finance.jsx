import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useClub } from '../context/ClubContext';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import BudgetBar from '../components/finance/BudgetBar';
import TransactionTable from '../components/finance/TransactionTable';
import AddTransactionForm from '../components/finance/AddTransactionForm';
import SectionHead from '../components/common/SectionHead';
import Button from '../components/common/Button';
import { getFinanceSummaryApi, getTransactionsApi, createTransactionApi, deleteTransactionApi } from '../api/finance';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';

const Finance = () => {
  const { clubId } = useParams();
  const { isSuperAdmin, isClubAdmin } = useAuth();
  const { currentClub, selectClub, refreshClub } = useClub();

  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [showAddModal, setShowAddModal] = useState(false);

  const canEdit = isSuperAdmin || isClubAdmin;

  useEffect(() => {
    if (clubId) {
      selectClub(clubId);
      loadFinanceData(clubId, 1);
    }
  }, [clubId]);

  const loadFinanceData = async (targetClubId, pageNum = 1) => {
    try {
      const sumData = await getFinanceSummaryApi(targetClubId);
      setSummary(sumData);

      if (canEdit) {
        const txData = await getTransactionsApi(targetClubId, pageNum, 8);
        setTransactions(txData.transactions || []);
        setPagination({
          page: txData.pagination?.page || 1,
          totalPages: txData.pagination?.totalPages || 1
        });
      }
    } catch (err) {
      console.error('Error loading finance data:', err);
    }
  };

  const handleAddTransaction = async (data) => {
    await createTransactionApi(clubId, data);
    await refreshClub(clubId);
    loadFinanceData(clubId, 1);
  };

  const handleDeleteTransaction = async (transactionId) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      await deleteTransactionApi(clubId, transactionId);
      await refreshClub(clubId);
      loadFinanceData(clubId, pagination.page);
    }
  };

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
          title="FINANCE"
          subtitle={`BUDGET & TRANSACTIONS FOR ${currentClub?.name || 'CLUB'}`}
          action={canEdit && (
            <Button variant="primary" onClick={() => setShowAddModal(true)}>
              <Plus size={13} /> RECORD TRANSACTION
            </Button>
          )}
        />

        {/* Compact Budget Utilization Bar */}
        <BudgetBar
          budgetTotal={summary?.budgetTotal || 0}
          budgetSpent={summary?.budgetSpent || 0}
        />

        {/* Transactions Table */}
        {canEdit ? (
          <div style={{ marginTop: '28px' }}>
            <SectionHead title="TRANSACTIONS" subtitle="CREDITS & DEBITS RECORDED" />
            <TransactionTable
              transactions={transactions}
              onDelete={handleDeleteTransaction}
              canEdit={canEdit}
            />

            {/* Minimal Pagination */}
            {pagination.totalPages > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page <= 1}
                  onClick={() => loadFinanceData(clubId, pagination.page - 1)}
                >
                  <ChevronLeft size={11} /> PREV
                </Button>
                <span style={{ fontSize: '10px', color: 'var(--fg-dim)' }}>
                  PAGE {pagination.page} / {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => loadFinanceData(clubId, pagination.page + 1)}
                >
                  NEXT <ChevronRight size={11} />
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ padding: '16px', border: '1px solid var(--line)', backgroundColor: 'var(--panel)', color: 'var(--fg-dim)', fontSize: '11px' }}>
            ℹ️ Line-item transactions are visible to Club Admins. Members can view budget summaries above.
          </div>
        )}

        {/* Modal Form */}
        {showAddModal && (
          <AddTransactionForm
            onSubmit={handleAddTransaction}
            onClose={() => setShowAddModal(false)}
          />
        )}
      </main>
    </div>
  );
};

export default Finance;
