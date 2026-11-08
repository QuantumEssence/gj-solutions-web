import React from 'react';
import type { Inquiry } from './types';

interface InquiriesTableProps {
  inquiries: Inquiry[];
  isLoading: boolean;
  isUpdatingId: number | null;
  notifyingId: number | null;
  onStatusChange: (id: number, status: string) => void;
  onMoveToTrash: (id: number) => void;
  onReNotifyEmail: (inquiry: Inquiry) => void;
}

export const InquiriesTable: React.FC<InquiriesTableProps> = ({
  inquiries,
  isLoading
}) => {
  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return 'Oct 05, 2026';
    try {
      const date = new Date(dateStr.replace(' ', 'T'));
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'Meeting Scheduled':
        return {
          backgroundColor: '#e0e7ff',
          color: '#4338ca'
        };
      case 'Replied via Email':
        return {
          backgroundColor: '#dcfce7',
          color: '#15803d'
        };
      case 'Pending Review':
      default:
        return {
          backgroundColor: '#fef3c7',
          color: '#b45309'
        };
    }
  };

  if (inquiries.length === 0 && isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
        Loading inquiries...
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table 
        style={{ 
          width: '100%', 
          borderCollapse: 'collapse', 
          textAlign: 'left',
          fontSize: '0.95rem'
        }}
      >
        <thead>
          <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#4a5568', fontSize: '0.9rem' }}>
            <th style={{ padding: '0.85rem 1rem 0.85rem 0', fontWeight: 700 }}>Date</th>
            <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Name / Email</th>
            <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>SPMC?</th>
            <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Service Interest</th>
            <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Meeting?</th>
            <th style={{ padding: '0.85rem 0 0.85rem 1rem', fontWeight: 700 }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {inquiries.map((inquiry) => {
            const isSPMC = inquiry.is_spmc === 'Yes';
            const hasMeeting = inquiry.schedule_meeting?.startsWith('Yes');
            const statusText = inquiry.status || 'Pending Review';

            return (
              <tr 
                key={inquiry.id} 
                style={{ 
                  borderBottom: '1px solid #f1f5f9',
                  transition: 'background-color 0.15s ease'
                }}
              >
                {/* Date */}
                <td style={{ padding: '1.15rem 1rem 1.15rem 0', color: '#334155', whiteSpace: 'nowrap' }}>
                  {formatDate(inquiry.created_at)}
                </td>

                {/* Name / Email */}
                <td style={{ padding: '1.15rem 1rem' }}>
                  <div style={{ fontWeight: 600, color: '#1e293b' }}>
                    {inquiry.name}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    {inquiry.email}
                  </div>
                </td>

                {/* SPMC? */}
                <td style={{ padding: '1.15rem 1rem' }}>
                  <span 
                    style={{ 
                      fontWeight: 600, 
                      color: isSPMC ? '#2A7B7E' : '#64748b' 
                    }}
                  >
                    {isSPMC ? 'Yes' : 'No'}
                  </span>
                </td>

                {/* Service Interest */}
                <td style={{ padding: '1.15rem 1rem', color: '#334155' }}>
                  {inquiry.service_interest || 'Desk Work only'}
                </td>

                {/* Meeting? */}
                <td style={{ padding: '1.15rem 1rem', color: '#334155' }}>
                  {hasMeeting ? 'Yes' : 'No'}
                </td>

                {/* Status */}
                <td style={{ padding: '1.15rem 0 1.15rem 1rem' }}>
                  <span 
                    style={{
                      ...getStatusBadgeStyle(statusText),
                      padding: '0.3rem 0.85rem',
                      borderRadius: '9999px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      display: 'inline-block',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {statusText}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default InquiriesTable;
