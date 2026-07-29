import React from 'react';
import Table from '../common/Table';
import Tag from '../common/Tag';
import Button from '../common/Button';
import { Trash2 } from 'lucide-react';

const TransactionTable = ({ transactions = [], onDelete, canEdit = false }) => {
  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount', 'Added By'];
  if (canEdit) headers.push('Actions');

  return (
    <Table headers={headers}>
      {transactions.length === 0 ? (
        <tr>
          <td colSpan={headers.length} style={{ padding: '24px', textAlign: 'center', color: 'var(--fg-dim)' }}>
            No transactions recorded for this club yet.
          </td>
        </tr>
      ) : (
        transactions.map((tx) => (
          <tr key={tx._id} style={{ borderBottom: '1px solid var(--line)' }}>
            <td style={{ padding: '12px 16px', color: 'var(--fg-dim)', whiteSpace: 'nowrap' }}>
              {new Date(tx.date || tx.createdAt).toLocaleDateString()}
            </td>
            <td style={{ padding: '12px 16px', fontWeight: '600' }}>
              {tx.description}
            </td>
            <td style={{ padding: '12px 16px' }}>
              <Tag variant={tx.category}>{tx.category}</Tag>
            </td>
            <td style={{ padding: '12px 16px' }}>
              <Tag variant={tx.type === 'in' ? 'credit' : 'debit'}>
                {tx.type === 'in' ? 'CREDIT (+)' : 'DEBIT (-)'}
              </Tag>
            </td>
            <td style={{
              padding: '12px 16px',
              fontFamily: 'var(--font-heading)',
              fontWeight: '700',
              color: tx.type === 'in' ? 'var(--accent)' : 'var(--fg)',
              whiteSpace: 'nowrap'
            }}>
              {tx.type === 'in' ? '+' : '-'}${Number(tx.amount).toLocaleString()}
            </td>
            <td style={{ padding: '12px 16px', color: 'var(--fg-dim)' }}>
              {tx.addedBy?.name || 'Admin'}
            </td>
            {canEdit && (
              <td style={{ padding: '12px 16px' }}>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onDelete && onDelete(tx._id)}
                >
                  <Trash2 size={12} />
                </Button>
              </td>
            )}
          </tr>
        ))
      )}
    </Table>
  );
};

export default TransactionTable;
