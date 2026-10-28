import React from 'react';
import { Lock, ArrowRight, Loader2, ShieldCheck, AlertCircle, Clock } from 'lucide-react';

interface AdminLoginProps {
  passcode: string;
  setPasscode: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoggingIn: boolean;
  loginError: string | null;
  sessionTimeoutNotice?: string | null;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  passcode,
  setPasscode,
  onSubmit,
  isLoggingIn,
  loginError,
  sessionTimeoutNotice
}) => {
  return (
    <div className="admin-page fade-in admin-login-wrapper">
      <div className="card admin-login-card">
        <div className="admin-login-icon">
          <Lock size={28} />
        </div>

        <h2 className="admin-login-title">
          Practice Operations Portal
        </h2>
        <p className="admin-login-subtitle">
          Administrative gateway for practice inquiries, client consultation triage, and operational traffic metrics.
        </p>

        {sessionTimeoutNotice && (
          <div className="admin-login-alert warning">
            <Clock size={18} className="flex-shrink-0" />
            <span>{sessionTimeoutNotice}</span>
          </div>
        )}

        {loginError && (
          <div 
            className="admin-login-alert error"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderLeft: '5px solid #dc2626',
              color: '#1e293b',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
            }}
          >
            <AlertCircle size={18} className="flex-shrink-0" style={{ color: '#dc2626' }} />
            <span style={{ color: '#1e293b', fontWeight: 500 }}>{loginError}</span>
          </div>
        )}

        <form onSubmit={onSubmit} className="admin-login-form">
          <div className="admin-form-group">
            <label htmlFor="admin-passcode" className="admin-form-label">
              Staff Access Passcode
            </label>
            <div className="admin-input-relative">
              <input
                id="admin-passcode"
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter staff passcode..."
                autoFocus
                disabled={isLoggingIn}
                className="admin-input"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoggingIn || !passcode.trim()}
            className="btn btn-primary admin-submit-btn"
          >
            {isLoggingIn ? (
              <>
                <Loader2 size={18} className="spin" />
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <>
                <span>Authenticate Portal</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="admin-login-footer">
          <div className="admin-security-hint">
            <ShieldCheck size={16} className="text-emerald-600" />
            <span>Protected staff session • 30m idle auto-lock active</span>
          </div>
          <div className="admin-security-note">
            Authorized personnel only. All access attempts and administrative modifications are audited.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
