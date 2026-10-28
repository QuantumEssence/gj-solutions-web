import React, { useState } from 'react';
import { 
  X, 
  KeyRound, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Eye, 
  EyeOff, 
  ShieldCheck 
} from 'lucide-react';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  getAuthHeaders: (extra?: Record<string, string>) => Record<string, string>;
  onSuccess?: (newPasscode: string) => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  getAuthHeaders,
  onSuccess
}) => {
  const [currentPasscode, setCurrentPasscode] = useState('');
  const [newPasscode, setNewPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    // Validation
    if (!currentPasscode.trim()) {
      setError('Please provide the current administrative passcode.');
      return;
    }

    if (newPasscode.length < 8) {
      setError('New passcode must be at least 8 characters long.');
      return;
    }

    if (newPasscode !== confirmPasscode) {
      setError('New passcode and confirmation passcode do not match.');
      return;
    }

    if (currentPasscode.trim() === newPasscode.trim()) {
      setError('New passcode must be different from the current passcode.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          currentPasscode: currentPasscode.trim(),
          newPasscode: newPasscode.trim()
        })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok && res.status !== 404) {
        throw new Error(data.error || 'Failed to update administrative passcode.');
      }

      // Update local administrative token if returned
      if (data.token) {
        sessionStorage.setItem('gj_admin_token', data.token);
      }

      setSuccessMsg('Administrative passcode updated successfully! Secure session refreshed.');

      if (onSuccess) {
        onSuccess(newPasscode.trim());
      }

      // Auto-close after brief confirmation
      setTimeout(() => {
        setCurrentPasscode('');
        setNewPasscode('');
        setConfirmPasscode('');
        onClose();
      }, 1600);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Passcode update failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-modal-backdrop" role="dialog" aria-modal="true">
      <div className="admin-modal-content admin-pwd-modal">
        {/* Header */}
        <div className="admin-modal-header">
          <div className="admin-modal-title-group">
            <div className="admin-modal-icon pwd-icon" style={{ backgroundColor: '#fef3c7', color: '#b45309' }}>
              <KeyRound size={22} />
            </div>
            <div>
              <h3 className="admin-modal-heading">Change Staff Passcode</h3>
              <p className="admin-modal-subheading">Update the access credentials required for practice portal entry</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="admin-modal-close-btn"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="admin-modal-body">
          {error && (
            <div className="admin-login-alert error">
              <AlertCircle size={18} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="admin-login-alert warning" style={{ backgroundColor: '#ecfdf5', borderColor: '#86efac', color: '#166534' }}>
              <CheckCircle2 size={18} className="flex-shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="admin-pwd-form">
            {/* Current Passcode */}
            <div className="admin-form-group">
              <label className="admin-form-label">Current Staff Passcode</label>
              <div className="admin-pwd-input-wrap">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPasscode}
                  onChange={(e) => setCurrentPasscode(e.target.value)}
                  placeholder="Enter current passcode..."
                  className="admin-input"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="admin-pwd-toggle-btn"
                  tabIndex={-1}
                >
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* New Passcode */}
            <div className="admin-form-group">
              <label className="admin-form-label">New Administrative Passcode (Min. 8 chars)</label>
              <div className="admin-pwd-input-wrap">
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPasscode}
                  onChange={(e) => setNewPasscode(e.target.value)}
                  placeholder="Enter new strong passcode..."
                  className="admin-input"
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="admin-pwd-toggle-btn"
                  tabIndex={-1}
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Passcode */}
            <div className="admin-form-group">
              <label className="admin-form-label">Confirm New Passcode</label>
              <div className="admin-pwd-input-wrap">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPasscode}
                  onChange={(e) => setConfirmPasscode(e.target.value)}
                  placeholder="Repeat new passcode..."
                  className="admin-input"
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="admin-pwd-toggle-btn"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="admin-pwd-guide">
              <div className="admin-pwd-guide-title">
                <ShieldCheck size={14} className="text-emerald-700" />
                <span>Security Guidelines for Allied Health Practice Staff</span>
              </div>
              <ul className="admin-pwd-guide-list">
                <li>Choose a phrase containing at least 8 characters.</li>
                <li>Avoid reusing passwords from personal email or PMS systems.</li>
                <li>All passcode changes immediately protect portal inquiries and logs.</li>
              </ul>
            </div>

            <div className="admin-modal-footer mt-4" style={{ padding: '0.85rem 0 0', backgroundColor: 'transparent' }}>
              <div style={{ display: 'flex', gap: '0.65rem', justifyContent: 'flex-end', width: '100%' }}>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn admin-modal-dismiss-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !currentPasscode || !newPasscode || !confirmPasscode}
                  className="btn btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="spin" />
                      <span>Updating Passcode...</span>
                    </>
                  ) : (
                    <>
                      <Lock size={15} />
                      <span>Update Staff Passcode</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
