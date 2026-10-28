import React from 'react';
import { RotateCcw, Archive, Loader2, Calendar, AlertTriangle } from 'lucide-react';
import type { Inquiry } from './types';

interface TrashBinTableProps {
  trashedInquiries: Inquiry[];
  isUpdatingId: number | null;
  onRestore: (id: number) => void;
  onPermanentDelete: (id: number) => void;
}

export const TrashBinTable: React.FC<TrashBinTableProps> = ({
  trashedInquiries,
  isUpdatingId,
  onRestore,
  onPermanentDelete
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

  return (
    <div className="admin-trash-section">
      {/* Safeguard Notice */}
      <div className="admin-trash-safeguard">
        <RotateCcw size={18} className="flex-shrink-0 text-sky-600" />
        <div>
          <strong>Archive Safeguard:</strong> Inquiries moved here remain safely protected and can be restored to active status at any time without data loss.
        </div>
      </div>

      {trashedInquiries.length === 0 ? (
        <div className="admin-empty-table trash-empty">
          <Archive size={32} className="admin-empty-icon text-slate-400" />
          <div className="admin-empty-title">Archive is Empty</div>
          <p className="admin-empty-desc">
            No archived inquiries currently stored. Removed items will appear here for audit, triage, and 1-click restoration.
          </p>
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table admin-trash-table">
            <thead>
              <tr>
                <th>Ref # / Submitted</th>
                <th>Practitioner / Contact</th>
                <th>SPMC</th>
                <th>Service Interest</th>
                <th>Archived On</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trashedInquiries.map((inquiry) => {
                const isUpdating = isUpdatingId === inquiry.id;

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

                    {/* Name & Email */}
                    <td>
                      <div className="admin-contact-name">{inquiry.name}</div>
                      <div className="admin-contact-email">{inquiry.email}</div>
                    </td>

                    {/* SPMC */}
                    <td>
                      <span
                        className={`admin-spmc-tag ${inquiry.is_spmc === 'Yes' ? 'spmc-yes' : 'spmc-no'}`}
                      >
                        {inquiry.is_spmc === 'Yes' ? 'SPMC' : 'Non-SPMC'}
                      </span>
                    </td>

                    {/* Service */}
                    <td>
                      <span className="admin-service-badge">{inquiry.service_interest}</span>
                    </td>

                    {/* Archived timestamp */}
                    <td>
                      <span className="admin-archived-tag">
                        {formatDate(inquiry.deleted_at)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="text-center">
                      <div className="admin-row-actions">
                        <button
                          type="button"
                          onClick={() => onRestore(inquiry.id)}
                          disabled={isUpdating}
                          title="Restore back to active inquiries"
                          className="admin-action-btn restore-btn"
                        >
                          {isUpdating ? (
                            <Loader2 size={13} className="spin" />
                          ) : (
                            <RotateCcw size={13} />
                          )}
                          <span>Restore</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onPermanentDelete(inquiry.id)}
                          disabled={isUpdating}
                          title="Permanently remove inquiry record from database"
                          className="admin-action-btn permanent-delete-btn"
                        >
                          <AlertTriangle size={13} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TrashBinTable;
