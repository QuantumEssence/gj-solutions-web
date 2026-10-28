import React from 'react';
import { Mail, Trash2, Calendar, Loader2, User, Building2 } from 'lucide-react';
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
  isLoading,
  isUpdatingId,
  notifyingId,
  onStatusChange,
  onMoveToTrash,
  onReNotifyEmail
}) => {
  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr.replace(' ', 'T'));
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('en-AU', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Meeting Scheduled':
        return { backgroundColor: '#e0e7ff', color: '#4f46e5', border: '1px solid #c7d2fe' };
      case 'Replied via Email':
        return { backgroundColor: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0' };
      default:
        return { backgroundColor: '#fef3c7', color: '#d97706', border: '1px solid #fde68a' };
    }
  };

  // Helper to extract email domain as clinic name hint if domain isn't generic
  const extractClinicHint = (email: string) => {
    if (!email || !email.includes('@')) return null;
    const domain = email.split('@')[1].toLowerCase();
    const genericDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'];
    if (genericDomains.includes(domain)) return null;
    return domain;
  };

  if (inquiries.length === 0) {
    return (
      <div className="admin-empty-table">
        <User size={32} className="admin-empty-icon" />
        <div className="admin-empty-title">
          {isLoading ? 'Loading inquiries...' : 'No inquiries match your criteria'}
        </div>
        <p className="admin-empty-desc">
          {isLoading 
            ? 'Fetching latest practice inquiries from the secure database...' 
            : 'Try adjusting your search keywords, status filter, or SPMC toggle.'}
        </p>
      </div>
    );
  }

  return (
    <div className="admin-table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Ref # / Date</th>
            <th>Practitioner / Clinic Contact</th>
            <th>SPMC</th>
            <th>Service Scope</th>
            <th>Consultation Call</th>
            <th>Triage Status</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {inquiries.map((inquiry) => {
            const clinicHint = extractClinicHint(inquiry.email);
            const isUpdating = isUpdatingId === inquiry.id;
            const isNotifying = notifyingId === inquiry.id;

            return (
              <tr key={inquiry.id} className={isUpdating ? 'row-updating' : ''}>
                {/* Ref & Date */}
                <td>
                  <div className="admin-ref-id">#{inquiry.id}</div>
                  <div className="admin-date-sub">
                    <Calendar size={12} className="inline mr-1 opacity-70" />
                    {formatDate(inquiry.created_at)}
                  </div>
                </td>

                {/* Name, Email, Clinic */}
                <td>
                  <div className="admin-contact-name">{inquiry.name}</div>
                  <div className="admin-contact-email">{inquiry.email}</div>
                  {clinicHint && (
                    <div className="admin-clinic-tag">
                      <Building2 size={11} />
                      <span>{clinicHint}</span>
                    </div>
                  )}
                </td>

                {/* SPMC Pill */}
                <td>
                  <span
                    className={`admin-spmc-tag ${inquiry.is_spmc === 'Yes' ? 'spmc-yes' : 'spmc-no'}`}
                  >
                    {inquiry.is_spmc === 'Yes' ? 'SPMC' : 'Non-SPMC'}
                  </span>
                </td>

                {/* Service Interest */}
                <td>
                  <span className="admin-service-badge">{inquiry.service_interest}</span>
                </td>

                {/* Discovery Meeting */}
                <td>
                  <div className="admin-meeting-info">
                    <span
                      className={`admin-meeting-indicator ${
                        inquiry.schedule_meeting.toLowerCase().startsWith('yes')
                          ? 'meeting-requested'
                          : 'meeting-declined'
                      }`}
                    >
                      {inquiry.schedule_meeting}
                    </span>
                  </div>
                </td>

                {/* Status Dropdown Selector */}
                <td>
                  <div className="admin-status-select-wrap">
                    <select
                      value={inquiry.status}
                      disabled={isUpdating}
                      onChange={(e) => onStatusChange(inquiry.id, e.target.value)}
                      style={getStatusStyle(inquiry.status)}
                      className="admin-status-dropdown"
                      title="Update triage status"
                    >
                      <option value="Pending Review">Pending Review</option>
                      <option value="Meeting Scheduled">Meeting Scheduled</option>
                      <option value="Replied via Email">Replied via Email</option>
                    </select>
                    {isUpdating && <Loader2 size={12} className="spin admin-select-spinner" />}
                  </div>
                </td>

                {/* Actions */}
                <td className="text-center">
                  <div className="admin-row-actions">
                    <button
                      type="button"
                      onClick={() => onReNotifyEmail(inquiry)}
                      disabled={isNotifying || isUpdating}
                      title={`Dispatch follow-up re-notification to ${inquiry.email}`}
                      className="admin-action-btn notify-btn"
                    >
                      {isNotifying ? (
                        <Loader2 size={13} className="spin" />
                      ) : (
                        <Mail size={13} />
                      )}
                      <span>{isNotifying ? 'Sending...' : 'Re-notify'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onMoveToTrash(inquiry.id)}
                      disabled={isUpdating || isNotifying}
                      title="Move inquiry to Trash Bin"
                      className="admin-action-btn trash-btn"
                    >
                      <Trash2 size={13} />
                      <span>Trash</span>
                    </button>
                  </div>
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
