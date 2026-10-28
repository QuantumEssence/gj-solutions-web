import React from 'react';
import { 
  Settings, 
  X, 
  RotateCcw, 
  Trash2, 
  ShieldAlert, 
  BarChart3, 
  Sparkles, 
  Loader2 
} from 'lucide-react';

interface MaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCleanMode: (mode: 'trash_all' | 'purge_trash' | 'reset_all' | 'reset_analytics' | 'seed_beta') => void;
  isCleaning: boolean;
}

export const MaintenanceModal: React.FC<MaintenanceModalProps> = ({
  isOpen,
  onClose,
  onCleanMode,
  isCleaning
}) => {
  if (!isOpen) return null;

  return (
    <div className="admin-modal-backdrop" role="dialog" aria-modal="true">
      <div className="admin-modal-content">
        {/* Modal Header */}
        <div className="admin-modal-header">
          <div className="admin-modal-title-group">
            <div className="admin-modal-icon settings-icon">
              <Settings size={22} />
            </div>
            <div>
              <h3 className="admin-modal-heading">Database & Data Management Controls</h3>
              <p className="admin-modal-subheading">Configure live data retention, archiving, and system reset controls</p>
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
          {/* Option 1: Soft Archive Cleaning Mode */}
          <div className="admin-maint-card soft-clean">
            <div className="admin-maint-card-row">
              <div className="admin-maint-card-content">
                <div className="admin-maint-card-title text-sky-900">
                  <RotateCcw size={16} className="text-sky-600" />
                  <span>Archive Active Inquiries (Soft Clean)</span>
                </div>
                <p className="admin-maint-card-desc text-slate-600">
                  Moves all active inquiries into the Archive without permanently removing records. Keeps the active inbox clear while preserving recovery options.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onCleanMode('trash_all')}
                disabled={isCleaning}
                className="admin-maint-btn btn-sky"
              >
                {isCleaning ? <Loader2 size={14} className="spin" /> : null}
                <span>Archive Active</span>
              </button>
            </div>
          </div>

          {/* Option 2: Empty Trash (Deleting Mode) */}
          <div className="admin-maint-card purge-trash">
            <div className="admin-maint-card-row">
              <div className="admin-maint-card-content">
                <div className="admin-maint-card-title text-red-900">
                  <Trash2 size={16} className="text-red-600" />
                  <span>Purge Archived Inquiries (Permanent)</span>
                </div>
                <p className="admin-maint-card-desc text-red-700">
                  Permanently removes all items stored in the Archive. This action cannot be reversed.
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

          {/* Option 3: Full Reset */}
          <div className="admin-maint-card reset-all">
            <div className="admin-maint-card-row">
              <div className="admin-maint-card-content">
                <div className="admin-maint-card-title text-pink-900">
                  <ShieldAlert size={16} className="text-pink-600" />
                  <span>Reset Inquiries Database</span>
                </div>
                <p className="admin-maint-card-desc text-pink-700">
                  Clears all active and archived inquiry records to start with an empty database for fresh operational testing.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onCleanMode('reset_all')}
                disabled={isCleaning}
                className="admin-maint-btn btn-pink"
              >
                {isCleaning ? <Loader2 size={14} className="spin" /> : null}
                <span>Clear Database</span>
              </button>
            </div>
          </div>

          {/* Option 4: Reset Traffic Analytics */}
          <div className="admin-maint-card reset-views">
            <div className="admin-maint-card-row">
              <div className="admin-maint-card-content">
                <div className="admin-maint-card-title text-slate-800">
                  <BarChart3 size={16} className="text-slate-600" />
                  <span>Reset Traffic Metrics Counter</span>
                </div>
                <p className="admin-maint-card-desc text-slate-600">
                  Resets recorded traffic page views to zero for new reporting cycles.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onCleanMode('reset_analytics')}
                disabled={isCleaning}
                className="admin-maint-btn btn-slate"
              >
                {isCleaning ? <Loader2 size={14} className="spin" /> : null}
                <span>Reset Views</span>
              </button>
            </div>
          </div>

          {/* Option 5: Seed Practice Demonstrations */}
          <div className="admin-maint-card seed-beta">
            <div className="admin-maint-card-row">
              <div className="admin-maint-card-content">
                <div className="admin-maint-card-title text-emerald-900">
                  <Sparkles size={16} className="text-emerald-600" />
                  <span>Load Sample Practice Inquiries</span>
                </div>
                <p className="admin-maint-card-desc text-emerald-700">
                  Inserts 3 sample Australian clinic consultation inquiries (Melbourne, Brisbane, Sydney) to preview status workflows and analytics charts.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onCleanMode('seed_beta')}
                disabled={isCleaning}
                className="admin-maint-btn btn-emerald"
              >
                {isCleaning ? <Loader2 size={14} className="spin" /> : null}
                <span>Load Sample Data</span>
              </button>
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
