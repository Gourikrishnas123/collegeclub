import React from 'react';
import Table from '../common/Table';
import Tag from '../common/Tag';
import Button from '../common/Button';
import { ArrowRight, Power } from 'lucide-react';

const ClubsTable = ({ clubs = [], onSelectClub, onToggleDeactivate }) => {
  const headers = ['Mark', 'Club Name', 'Department', 'Admin', 'Budget Spent / Total', 'Members', 'Status', 'Actions'];

  return (
    <Table headers={headers}>
      {clubs.length === 0 ? (
        <tr>
          <td colSpan={headers.length} style={{ padding: '24px', textAlign: 'center', color: 'var(--fg-dim)' }}>
            No clubs created yet.
          </td>
        </tr>
      ) : (
        clubs.map((club) => {
          const util = club.budgetTotal > 0 ? ((club.budgetSpent / club.budgetTotal) * 100).toFixed(1) : 0;
          const isDanger = util > 90;

          return (
            <tr
              key={club._id}
              style={{
                borderBottom: '1px solid var(--line)',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--panel)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <td style={{ padding: '14px 16px' }} onClick={() => onSelectClub(club._id)}>
                <Tag variant="accent">{club.mark}</Tag>
              </td>
              <td style={{ padding: '14px 16px', fontWeight: '700', fontSize: '13px' }} onClick={() => onSelectClub(club._id)}>
                {club.name}
              </td>
              <td style={{ padding: '14px 16px', color: 'var(--fg-dim)' }} onClick={() => onSelectClub(club._id)}>
                {club.department}
              </td>
              <td style={{ padding: '14px 16px' }} onClick={() => onSelectClub(club._id)}>
                <div>{club.adminName}</div>
                <div style={{ fontSize: '10px', color: 'var(--fg-dim)' }}>{club.adminEmail}</div>
              </td>
              <td style={{ padding: '14px 16px' }} onClick={() => onSelectClub(club._id)}>
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', color: isDanger ? 'var(--danger)' : 'var(--fg)' }}>
                  ${(club.budgetSpent || 0).toLocaleString()} / ${(club.budgetTotal || 0).toLocaleString()}
                </div>
                <div style={{ fontSize: '10px', color: isDanger ? 'var(--danger)' : 'var(--fg-dim)' }}>
                  {util}% UTILIZED {isDanger && '⚠️'}
                </div>
              </td>
              <td style={{ padding: '14px 16px', fontWeight: '600' }} onClick={() => onSelectClub(club._id)}>
                {club.memberCount || 0}
              </td>
              <td style={{ padding: '14px 16px' }} onClick={() => onSelectClub(club._id)}>
                <Tag variant={club.isActive ? 'credit' : 'danger'}>
                  {club.isActive ? 'ACTIVE' : 'DEACTIVATED'}
                </Tag>
              </td>
              <td style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectClub(club._id);
                    }}
                  >
                    ENTER <ArrowRight size={10} />
                  </Button>

                  <Button
                    variant={club.isActive ? 'danger' : 'secondary'}
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleDeactivate(club._id);
                    }}
                    title={club.isActive ? 'Deactivate Club' : 'Activate Club'}
                  >
                    <Power size={10} />
                  </Button>
                </div>
              </td>
            </tr>
          );
        })
      )}
    </Table>
  );
};

export default ClubsTable;
