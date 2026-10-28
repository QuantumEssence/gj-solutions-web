import React from 'react';
import { 
  Settings, 
  X, 
  RotateCcw, 
  Trash2, 
  BarChart3, 
  Sparkles, 
  Loader2,
  KeyRound,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

interface MaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCleanMode: (mode: 'trash_all' | 'purge_trash' | 'reset_all' | 'reset_analytics' | 'seed_beta') => void;
  isCleaning: boolean;
  onOpenPasswordModal?: () => void;
}

export const MaintenanceModal: React.FC<MaintenanceModalProps> = ({
  isOpen,
  onClose,
  onCleanMode,
  isCleaning,
  onOpenPasswordModal
}) => {
  if (!isOpen) return null;

  return (
    <div className="admin-modal-backdrop" role="dialog" aria-modal="true">
      <div className="admin-modal-content">
        {/* Modal Header */}
        <div className="admin-modal-header">
          <div className="admin-modal-title-group">
            <div className="admin-modal-icon settings-icon">
              <Settings size={20} />
            </div>
            <div>
              <h3 className="admin-modal-heading">System & Data Settings</h3>
              <p className="admin-modal-subheading">Data retention, workflow testing, and staff security controls</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="admin-modal-close-btn"
            title="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="admin-modal-body">
          {/* Section 1: Staff Passcode & Session Security */}
          <div className="mb-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Staff Security & Access</h4>
            <div className="admin-maint-card" style={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }}>
              <div className="admin-maint-card-row">
                <div className="admin-maint-card-content">
                  <div className="admin-maint-card-title text-slate-800">
                    <KeyRound size={16} className="text-teal-700" />
                    <span>Administrative Passcode</span>
                  </div>
                  <p className="admin-maint-card-desc text-slate-600">
                    Protected by timing-safe cryptographic verification. Sessions auto-terminate after 30 minutes of idle inactivity. Passcodes must contain at least 8 characters.
                  </p>
                </div>
                {onOpenPasswordModal && (
                  <button
                    type="button"
                    onClick={onOpenPasswordModal}
                    className="admin-maint-btn btn-sky"
                  >
                    <ShieldCheck size={14} />
                    <span>Change Passcode</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Data Retention & Archive */}
          <div className="mb-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Data Retention & Archiving</h4>
            <div className="flex flex-col gap-2.5">
              {/* Soft Archive */}
              <div className="admin-maint-card" style={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }}>
                <div className="admin-maint-card-row">
                  <div className="admin-maint-card-content">
                    <div className="admin-maint-card-title text-slate-800">
                      <RotateCcw size={16} className="text-sky-600" />
                      <span>Archive Active Inquiries</span>
                    </div>
                    <p className="admin-maint-card-desc text-slate-600">
                      Moves current inquiries to the Trash Bin archive. Records remain retrievable at any time.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onCleanMode('trash_all')}
                    disabled={isCleaning}
                    className="admin-maint-btn btn-slate"
                  >
                    {isCleaning ? <Loader2 size={14} className="spin" /> : null}
                    <span>Archive Active</span>
                  </button>
                </div>
              </div>

              {/* Purge Trash */}
              <div className="admin-maint-card" style={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }}>
                <div className="admin-maint-card-row">
                  <div className="admin-maint-card-content">
                    <div className="admin-maint-card-title text-slate-800">
                      <Trash2 size={16} className="text-red-600" />
                      <span>Purge Archived Inquiries</span>
                    </div>
                    <p className="admin-maint-card-desc text-slate-600">
                      Permanently deletes records currently residing in the Trash Bin. This action cannot be reversed.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onCleanMode('purge_trash')}
                    disabled={isCleaning}
                    className="admin-maint-btn btn-danger"
                  >
                    {isCleaning ? <Loader2 size={14} className="spin" /> : null}
                    <span>Purge Archive</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Testing & Metrics */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Practice Demonstrations & Metrics</h4>
            <div className="flex flex-col gap-2.5">
              {/* Seed Data */}
              <div className="admin-maint-card" style={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }}>
                <div className="admin-maint-card-row">
                  <div className="admin-maint-card-content">
                    <div className="admin-maint-card-title text-slate-800">
                      <Sparkles size={16} className="text-teal-600" />
                      <span>Load Practice Demonstration Inquiries</span>
                    </div>
                    <p className="admin-maint-card-desc text-slate-600">
                      Adds 3 sample Australian clinic consultation inquiries (Melbourne, Brisbane, Sydney) to test status updates and analytics charts.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onCleanMode('seed_beta')}
                    disabled={isCleaning}
                    className="admin-maint-btn btn-emerald"
                  >
                    {isCleaning ? <Loader2 size={14} className="spin" /> : null}
                    <span>Load Demo Data</span>
                  </button>
                </div>
              </div>

              {/* Reset Traffic Counter */}
              <div className="admin-maint-card" style={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }}>
                <div className="admin-maint-card-row">
                  <div className="admin-maint-card-content">
                    <div className="admin-maint-card-title text-slate-800">
                      <BarChart3 size={16} className="text-slate-500" />
                      <span>Reset Traffic Metrics Counter</span>
                    </div>
                    <p className="admin-maint-card-desc text-slate-600">
                      Resets page impression logs to zero for a fresh reporting cycle.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onCleanMode('reset_analytics')}
                    disabled={isCleaning}
                    className="admin-maint-btn btn-slate"
                  >
                    {isCleaning ? <Loader2 size={14} className="spin" /> : null}
                    <span>Reset Counter</span>
                  </button>
                </div>
              </div>

              {/* Reset Database (Compact warning card) */}
              <div className="admin-maint-card" style={{ backgroundColor: '#fef2f2', borderColor: '#fecaca' }}>
                <div className="admin-maint-card-row">
                  <div className="admin-maint-card-content">
                    <div className="admin-maint-card-title text-red-900">
                      <AlertTriangle size={16} className="text-red-600" />
                      <span>Reset Inquiries Database</span>
                    </div>
                    <p className="admin-maint-card-desc text-red-700">
                      Clears all active and archived inquiry records to start with an empty database.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onCleanMode('reset_all')}
                    disabled={isCleaning}
                    className="admin-maint-btn btn-danger"
                  >
                    {isCleaning ? <Loader2 size={14} className="spin" /> : null}
                    <span>Wipe Database</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="admin-modal-footer">
          <button
            type="button"
            onClick={onClose}
            className="btn admin-modal-dismiss-btn"
          >
            Close Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceModal;
