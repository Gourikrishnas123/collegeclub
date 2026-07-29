import React from 'react';
import Table from '../common/Table';
import Tag from '../common/Tag';
import Button from '../common/Button';
import { Trash2, UserCheck, Shield } from 'lucide-react';

const MembersTable = ({ members = [], onDelete, onRoleChange, canEdit = false, currentUserId }) => {
  const headers = ['Name', 'Email', 'Year / Grade', 'Role', 'Joined Date'];
  if (canEdit) headers.push('Actions');

  return (
    <Table headers={headers}>
      {members.length === 0 ? (
        <tr>
          <td colSpan={headers.length} style={{ padding: '24px', textAlign: 'center', color: 'var(--fg-dim)' }}>
            No members registered in this club yet.
          </td>
        </tr>
      ) : (
        members.map((m) => (
          <tr key={m._id} style={{ borderBottom: '1px solid var(--line)' }}>
            <td style={{ padding: '12px 16px', fontWeight: '700' }}>
              {m.name} {m._id === currentUserId && <span style={{ color: 'var(--accent)', fontSize: '10px' }}>(YOU)</span>}
            </td>
            <td style={{ padding: '12px 16px', color: 'var(--fg-dim)' }}>
              {m.email}
            </td>
            <td style={{ padding: '12px 16px' }}>
              {m.year || 'N/A'}
            </td>
            <td style={{ padding: '12px 16px' }}>
              <Tag variant={m.role === 'club_admin' ? 'accent' : 'default'}>
                {m.role}
              </Tag>
            </td>
            <td style={{ padding: '12px 16px', color: 'var(--fg-dim)', whiteSpace: 'nowrap' }}>
              {new Date(m.createdAt).toLocaleDateString()}
            </td>
            {canEdit && (
              <td style={{ padding: '12px 16px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {m._id !== currentUserId && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRoleChange && onRoleChange(m._id, m.role === 'club_admin' ? 'member' : 'club_admin')}
                        title="Toggle Admin / Member Role"
                      >
                        <Shield size={10} /> {m.role === 'club_admin' ? 'DEMOTE' : 'MAKE ADMIN'}
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => onDelete && onDelete(m._id)}
                      >
                        <Trash2 size={10} />
                      </Button>
                    </>
                  )}
                </div>
              </td>
            )}
          </tr>
        ))
      )}
    </Table>
  );
};

export default MembersTable;
