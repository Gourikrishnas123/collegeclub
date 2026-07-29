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
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';

const Finance = () => {
  const { clubId } = useParams();
  const { isSuperAdmin, isClubAdmin } = useAuth();
  const { currentClub, selectClub, refreshClub } = useClub();

  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const canEdit = isSuperAdmin || isClubAdmin;

  useEffect(() => {
    if (clubId) {
      selectClub(clubId);
      loadFinanceData(clubId, 1);
    }
  }, [clubId]);

  const loadFinanceData = async (targetClubId, pageNum = 1) => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
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
        padding: '32px',
        minHeight: 'calc(100vh - var(--topbar-height))',
        backgroundColor: 'var(--bg)'
      }}>
        <SectionHead
          title="FINANCE & BUDGET MANAGEMENT"
          subtitle={`FINANCIAL TRANSACTIONS AND SPEND BREAKDOWN FOR ${currentClub?.name || 'CLUB'}`}
          action={canEdit && (
            <Button variant="primary" onClick={() => setShowAddModal(true)}>
              <Plus size={14} /> ADD TRANSACTION
            </Button>
          )}
        />

        {/* Budget Bar */}
        <BudgetBar
          budgetTotal={summary?.budgetTotal || 0}
          budgetSpent={summary?.budgetSpent || 0}
        />

        {/* Spend by Category Recharts Bar Chart */}
        <div style={{
          border: '2px solid var(--line-strong)',
          backgroundColor: 'var(--panel)',
          padding: '24px',
          marginBottom: '32px'
        }}>
          <h3 style={{ fontSize: '15px', marginBottom: '20px' }}>SPEND BREAKDOWN BY CATEGORY</h3>
          {summary?.categoryBreakdown && summary.categoryBreakdown.some(c => c.amount > 0) ? (
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={summary.categoryBreakdown} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                  <XAxis dataKey="category" stroke="var(--fg-dim)" tick={{ fontSize: 11, fontFamily: 'var(--font-mono)' }} />
                  <YAxis stroke="var(--fg-dim)" tick={{ fontSize: 11, fontFamily: 'var(--font-mono)' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--panel)', border: '1px solid var(--line-strong)', color: 'var(--fg)', fontFamily: 'var(--font-mono)' }}
                    formatter={(val) => [`$${Number(val).toLocaleString()}`, 'Spent']}
                  />
                  <Bar dataKey="amount" radius={[0, 0, 0, 0]}>
                    {summary.categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? 'var(--accent)' : 'var(--fg)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--fg-dim)' }}>
              No expenses recorded yet to render chart.
            </div>
          )}
        </div>

        {/* Transactions Table for Admins */}
        {canEdit ? (
          <div>
            <SectionHead title="TRANSACTION HISTORY" subtitle="ALL CREDITS AND DEBITS RECORDED" />
            <TransactionTable
              transactions={transactions}
              onDelete={handleDeleteTransaction}
              canEdit={canEdit}
            />

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page <= 1}
                  onClick={() => loadFinanceData(clubId, pagination.page - 1)}
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
                  onClick={() => loadFinanceData(clubId, pagination.page + 1)}
                >
                  NEXT <ChevronRight size={12} />
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ padding: '20px', border: '1px solid var(--line)', backgroundColor: 'var(--panel)', color: 'var(--fg-dim)' }}>
            ℹ️ Detailed line-item transactions are restricted to Club Admins. Members can view budget summaries and category metrics above.
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
