import React, { useState } from 'react';
import { Bell, X, Mail, Send, CheckCircle2, Eye, ListFilter } from 'lucide-react';
import type { NotificationLog } from './types';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  logs: NotificationLog[];
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  logs
}) => {
  const [activeTab, setActiveTab] = useState<'logs' | 'preview'>('logs');

  if (!isOpen) return null;

  return (
    <div className="admin-modal-backdrop" role="dialog" aria-modal="true">
      <div className="admin-modal-content notification-modal">
        {/* Header */}
        <div className="admin-modal-header">
          <div className="admin-modal-title-group">
            <div className="admin-modal-icon bell-icon">
              <Bell size={22} />
            </div>
            <div>
              <h3 className="admin-modal-heading">Email & Dispatch Management</h3>
              <p className="admin-modal-subheading">Trigger client re-notifications and inspect transmission logs</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="admin-modal-close-btn"
            title="Close notifications"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab switch between Logs & Email Preview */}
        <div className="admin-notif-tabs">
          <button
            type="button"
            className={`admin-notif-tab ${activeTab === 'logs' ? 'active' : ''}`}
            onClick={() => setActiveTab('logs')}
          >
            <ListFilter size={15} />
            <span>Transmission Logs ({logs.length})</span>
          </button>
          <button
            type="button"
            className={`admin-notif-tab ${activeTab === 'preview' ? 'active' : ''}`}
            onClick={() => setActiveTab('preview')}
          >
            <Eye size={15} />
            <span>Follow-Up Email Preview</span>
          </button>
        </div>

        {/* Body */}
        <div className="admin-modal-body">
          {activeTab === 'logs' ? (
            <div className="admin-notif-body-content">
              {/* Notification Banner */}
              <div className="admin-notif-banner">
                <div className="admin-notif-banner-title">
                  <Mail size={16} /> Automated Re-Notification Active
                </div>
                <p className="admin-notif-banner-desc">
                  Dispatch follow-up email notifications directly to client clinics using the <strong>Re-notify</strong> button in the Active Requests table.
                </p>
              </div>

              {/* Transmission Audit Log */}
              <div>
                <h4 className="admin-notif-section-title">Transmission Audit Log</h4>
                <div className="admin-notif-table-wrapper">
                  <table className="admin-notif-table">
                    <thead>
                      <tr>
                        <th>Time</th>
                        <th>Recipient</th>
                        <th>Subject / Event</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map((log) => (
                        <tr key={log.id}>
                          <td className="text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                          <td className="font-medium text-slate-800">{log.recipient}</td>
                          <td className="text-slate-600">{log.subject}</td>
                          <td>
                            <span className="admin-log-status-pill">
                              <CheckCircle2 size={11} className="inline mr-1" />
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Notification Strategy Recommendation Panel */}
              <div className="admin-notif-protocol-card">
                <h4 className="admin-notif-protocol-title">
                  <Send size={15} className="text-teal-700" />
                  <span>Recommended Practice Communication Protocols</span>
                </h4>
                <div className="admin-notif-protocol-body">
                  <div className="protocol-step">
                    <strong>1. Immediate Intake Alert:</strong> Automated email alert within minutes of form submission for rapid clinic triage.
                  </div>
                  <div className="protocol-step">
                    <strong>2. Scope Confirmation Summary:</strong> Sends the practice director a structured consultation breakdown with their selected service package.
                  </div>
                  <div className="protocol-step">
                    <strong>3. Re-Notification Dispatch:</strong> Re-sends inquiry details if follow-up meeting booking remains unconfirmed after 24 hours.
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Email Preview Tab */
            <div className="admin-email-preview-container">
              <div className="admin-email-mockup">
                <div className="admin-email-mockup-header">
                  <div className="mockup-row">
                    <span className="mockup-label">From:</span>
                    <span className="mockup-val">G&J Solutions Client Intake &lt;contact@gjsolutions.com.au&gt;</span>
                  </div>
                  <div className="mockup-row">
                    <span className="mockup-label">To:</span>
                    <span className="mockup-val font-mono">&lt;practitioner@clinic.com.au&gt;</span>
                  </div>
                  <div className="mockup-row">
                    <span className="mockup-label">Subject:</span>
                    <span className="mockup-val font-semibold">G&J Solutions Consultation Follow-up – Physiotherapy Practice Support</span>
                  </div>
                </div>

                <div className="admin-email-mockup-body">
                  <p>Dear Practice Director,</p>
                  <p>
                    Thank you for reaching out to G&J Solutions regarding tailored administrative, desk-work, and reporting support for your physiotherapy practice.
                  </p>
                  <div className="mockup-highlight-box">
                    <strong>Your Inquiry Status:</strong> In Review by Senior Practice Consultant<br />
                    <strong>Requested Service Scope:</strong> Desk Work + Data Gathering / Reporting<br />
                    <strong>Consultation Booking:</strong> Available weekdays 3:00 PM – 6:00 PM AEST
                  </div>
                  <p>
                    If you would like to finalize your discovery call or adjust your operational requirements, please reply directly to this message or schedule a 15-minute alignment session.
                  </p>
                  <p>
                    Warm regards,<br />
                    <strong>The G&J Solutions Operations Team</strong><br />
                    <span className="text-xs text-slate-500">Perth & Melbourne, Australia • Supporting Allied Health Practices</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="admin-modal-footer">
          <button
            type="button"
            onClick={onClose}
            className="btn admin-modal-dismiss-btn"
          >
            Close Notifications
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;
