import React from 'react';
import { Download, FileSpreadsheet } from 'lucide-react';
import type { Inquiry } from './types';

interface ExportToolsProps {
  inquiries: Inquiry[];
  disabled?: boolean;
  filterLabel?: string;
}

export const ExportTools: React.FC<ExportToolsProps> = ({
  inquiries,
  disabled = false,
  filterLabel
}) => {
  const exportToCSV = () => {
    if (inquiries.length === 0) {
      alert('No inquiries available to export.');
      return;
    }

    // CSV Headers tailored for practice management systems (Cliniko, Nookal, Excel)
    const headers = [
      'Reference ID',
      'Date Submitted (UTC/AEST)',
      'Practitioner / Contact Name',
      'Email Address',
      'Clinic / Email Domain',
      'SPMC Affiliation',
      'Service Interest Scope',
      'Consultation Meeting Request',
      'Triage Status'
    ];

    const escapeCSV = (value: unknown): string => {
      if (value === null || value === undefined) return '""';
      const str = String(value);
      if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return `"${str}"`;
    };

    const rows = inquiries.map((item) => {
      // Extract clinic domain from email if available
      let clinicDomain = 'N/A';
      if (item.email && item.email.includes('@')) {
        clinicDomain = item.email.split('@')[1];
      }

      return [
        escapeCSV(`#${item.id}`),
        escapeCSV(item.created_at || 'N/A'),
        escapeCSV(item.name),
        escapeCSV(item.email),
        escapeCSV(clinicDomain),
        escapeCSV(item.is_spmc || 'No'),
        escapeCSV(item.service_interest),
        escapeCSV(item.schedule_meeting),
        escapeCSV(item.status)
      ].join(',');
    });

    // Add UTF-8 Byte Order Mark (BOM) for compatibility with Microsoft Excel
    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const today = new Date().toISOString().split('T')[0];
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `gj-solutions-practice-inquiries-${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      type="button"
      onClick={exportToCSV}
      disabled={disabled || inquiries.length === 0}
      className="btn admin-export-btn"
      title={`Export ${inquiries.length} inquiries to CSV (Cliniko / Nookal compatible)`}
    >
      <FileSpreadsheet size={16} />
      <span>Export to CSV ({inquiries.length})</span>
      <Download size={14} className="opacity-70" />
      {filterLabel && <span className="admin-export-tag">{filterLabel}</span>}
    </button>
  );
};

export default ExportTools;
