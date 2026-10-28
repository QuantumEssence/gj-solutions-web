import React, { useState } from 'react';
import { Bell, X, Mail, CheckCircle2, Eye, ListFilter, Inbox } from 'lucide-react';
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
              <Bell size={20} />
            </div>
            <div>
              <h3 className="admin-modal-heading">Notification & Dispatch Center</h3>
              <p className="admin-modal-subheading">Inquiry alerts and client follow-up transmission history</p>
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

        {/* Tab switch */}
        <div className="admin-notif-tabs">
          <button
            type="button"
            className={`admin-notif-tab ${activeTab === 'logs' ? 'active' : ''}`}
            onClick={() => setActiveTab('logs')}
          >
            <ListFilter size={15} />
            <span>Activity Logs ({logs.length})</span>
          </button>
          <button
            type="button"
            className={`admin-notif-tab ${activeTab === 'preview' ? 'active' : ''}`}
            onClick={() => setActiveTab('preview')}
          >
            <Eye size={15} />
            <span>Email Follow-Up Template</span>
          </button>
        </div>

        {/* Body */}
        <div className="admin-modal-body">
          {activeTab === 'logs' ? (
            <div className="admin-notif-body-content">
              {/* Streamlined Status Bar */}
              <div className="admin-notif-banner">
                <div className="admin-notif-banner-title">
                  <Mail size={16} /> Automated Inquiry Alerts Active
                </div>
                <p className="admin-notif-banner-desc">
                  Incoming consultation submissions automatically alert the clinic coordinator. You can trigger manual follow-up emails anytime using the Re-notify action on active requests.
                </p>
              </div>

              {/* Transmission Audit Log */}
              <div>
                <h4 className="admin-notif-section-title">Transmission Log</h4>
                <div className="admin-notif-table-wrapper">
                  <table className="admin-notif-table">
                    <thead>
                      <tr>
                        <th>Time</th>
                        <th>Recipient</th>
                        <th>Event / Subject</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="text-center py-6 text-slate-500">
                            <div className="flex flex-col items-center justify-center gap-2 py-4">
                              <Inbox size={24} className="text-slate-400" />
                              <span className="text-sm">No notifications recorded yet.</span>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        logs.map((log) => (
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
                        ))
                      )}
                    </tbody>
                  </table>
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
                    <span className="mockup-val">G&J Solutions Intake &lt;contact@gjsolutions.com.au&gt;</span>
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
                    Thank you for contacting G&J Solutions regarding tailored administrative, desk-work, and reporting support for your physiotherapy practice.
                  </p>
                  <div className="mockup-highlight-box">
                    <strong>Inquiry Status:</strong> In Review by Senior Practice Coordinator<br />
                    <strong>Requested Service:</strong> Desk Work + Data Gathering / Reporting<br />
                    <strong>Discovery Call Availability:</strong> Weekdays 3:00 PM – 6:00 PM AEST
                  </div>
                  <p>
                    If you would like to confirm your consultation schedule or adjust your operational requirements, please reply to this email or request a 15-minute alignment call.
                  </p>
                  <p>
                    Warm regards,<br />
                    <strong>The G&J Solutions Operations Team</strong><br />
                    <span className="text-xs text-slate-500">Melbourne & Sydney, Australia • Allied Health Practice Support</span>
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
