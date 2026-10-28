import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Users, 
  Settings, 
  Bell, 
  RefreshCw, 
  Database, 
  AlertCircle, 
  LogOut, 
  Trash2, 
  CheckCircle2, 
  ShieldCheck,
  Globe,
  KeyRound
} from 'lucide-react';
import './Admin.css';
import {
  AdminLogin,
  AnalyticsOverview,
  InquiriesTable,
  TrashBinTable,
  MaintenanceModal,
  NotificationCenter,
  LeadFilters,
  ExportTools,
  useAdminIdleTimeout,
  ContentManager,
  ChangePasswordModal,
  type Inquiry,
  type AnalyticsSummary,
  type NotificationLog,
  type FilterState
} from '../components/admin';

const Admin = () => {
  // Authentication & Session State
  const [token, setToken] = useState<string | null>(() => {
    return sessionStorage.getItem('gj_admin_token');
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('gj_admin_authenticated') === 'true' && !!sessionStorage.getItem('gj_admin_token');
  });
  const [passcode, setPasscode] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [sessionTimeoutNotice, setSessionTimeoutNotice] = useState<string | null>(null);

  // Inquiries and Analytics State
  const [activeTab, setActiveTab] = useState<'active' | 'trash'>('active');
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [trashedInquiries, setTrashedInquiries] = useState<Inquiry[]>([]);
  const [summary, setSummary] = useState<AnalyticsSummary>({
    totalSubmissions: 0,
    trashedCount: 0,
    uniqueVisitors: 0,
    totalViews: 0,
    discoveryCalls: 0,
    spmcCount: 0,
    spmcPercentage: 0,
    topService: 'None'
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingId, setIsUpdatingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Filter & Search State
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: 'All',
    spmc: 'All',
    dateRange: 'all',
    referenceTimestamp: 0
  });

  // Modal and Notification State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isContentManagerOpen, setIsContentManagerOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);
  const [notifyingId, setNotifyingId] = useState<number | null>(null);
  const [notificationLogs, setNotificationLogs] = useState<NotificationLog[]>([
    { 
      id: 1, 
      timestamp: new Date().toLocaleTimeString(), 
      recipient: 'clinic-admin@gjsolutions.com.au', 
      status: 'Ready', 
      subject: 'System standby for Beta Test launches' 
    }
  ]);

  const showFeedback = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ text, type });
    window.setTimeout(() => {
      setFeedback(null);
    }, 4500);
  };

  const getAuthHeaders = useCallback((extraHeaders: Record<string, string> = {}) => {
    const currentToken = token || sessionStorage.getItem('gj_admin_token');
    return {
      ...(currentToken ? { 'Authorization': `Bearer ${currentToken}` } : {}),
      ...extraHeaders
    };
  }, [token]);

  const handleLogout = useCallback((reason?: string) => {
    sessionStorage.removeItem('gj_admin_authenticated');
    sessionStorage.removeItem('gj_admin_token');
    setToken(null);
    setIsAuthenticated(false);
    setPasscode('');
    if (reason) {
      setSessionTimeoutNotice(reason);
    }
  }, []);

  // 30-minute idle session timeout
  useAdminIdleTimeout({
    timeoutMs: 30 * 60 * 1000,
    isAuthenticated,
    onTimeout: useCallback(() => {
      handleLogout('Session auto-closed after 30 minutes of inactivity. Please re-enter passcode to continue.');
    }, [handleLogout])
  });

  // Data Fetching
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const headers = getAuthHeaders();
      const [inquiriesRes, trashRes, analyticsRes] = await Promise.all([
        fetch('/api/inquiries', { headers }),
        fetch('/api/inquiries?trash=true', { headers }),
        fetch('/api/analytics/summary', { headers })
      ]);

      if (!inquiriesRes.ok || !analyticsRes.ok) {
        throw new Error('Failed to fetch data from API');
      }

      const inquiriesData = await inquiriesRes.json();
      const trashData = trashRes.ok ? await trashRes.json() : { inquiries: [] };
      const analyticsData = await analyticsRes.json();

      setInquiries(inquiriesData.inquiries || []);
      setTrashedInquiries(trashData.inquiries || []);
      if (analyticsData.summary) {
        setSummary(analyticsData.summary);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error connecting to backend database.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    if (!isAuthenticated) return;
    let ignore = false;

    async function loadInitial() {
      try {
        const headers = getAuthHeaders();
        const [inquiriesRes, trashRes, analyticsRes] = await Promise.all([
          fetch('/api/inquiries', { headers }),
          fetch('/api/inquiries?trash=true', { headers }),
          fetch('/api/analytics/summary', { headers })
        ]);

        if (!inquiriesRes.ok || !analyticsRes.ok) {
          throw new Error('Failed to fetch data from API');
        }

        const inquiriesData = await inquiriesRes.json();
        const trashData = trashRes.ok ? await trashRes.json() : { inquiries: [] };
        const analyticsData = await analyticsRes.json();

        if (!ignore) {
          setInquiries(inquiriesData.inquiries || []);
          setTrashedInquiries(trashData.inquiries || []);
          if (analyticsData.summary) {
            setSummary(analyticsData.summary);
          }
          setIsLoading(false);
        }
      } catch (err: unknown) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Error connecting to backend database.');
          setIsLoading(false);
        }
      }
    }

    loadInitial();
    return () => {
      ignore = true;
    };
  }, [isAuthenticated, getAuthHeaders]);

  // Authentication Handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setLoginError('Please enter the administrative passcode.');
      return;
    }

    setIsLoggingIn(true);
    setLoginError(null);
    setSessionTimeoutNotice(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: passcode.trim() })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid passcode.');
      }

      const authToken = data.token || 'gj-admin-session-token';
      sessionStorage.setItem('gj_admin_authenticated', 'true');
      sessionStorage.setItem('gj_admin_token', authToken);
      setToken(authToken);
      setIsAuthenticated(true);
      setPasscode('');
    } catch (err: unknown) {
      setLoginError(err instanceof Error ? err.message : 'Authentication failed.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Status Change Handler
  const handleStatusChange = async (id: number, newStatus: string) => {
    setIsUpdatingId(id);
    try {
      const res = await fetch(`/api/inquiries/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) {
        throw new Error('Failed to update status');
      }

      const data = await res.json();
      setInquiries((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: data.inquiry.status } : item))
      );
      showFeedback(`Status for Inquiry #${id} updated to "${newStatus}".`);
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Could not update status. Please check backend connection.');
    } finally {
      setIsUpdatingId(null);
    }
  };

  // Move to Trash Bin Handler
  const handleMoveToTrash = async (id: number) => {
    if (!window.confirm(`Move Inquiry #${id} to the Trash Bin? You can restore it anytime.`)) {
      return;
    }

    setIsUpdatingId(id);
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!res.ok) {
        throw new Error('Failed to move inquiry to Trash Bin.');
      }

      const data = await res.json();
      const movedItem = inquiries.find((item) => item.id === id);

      setInquiries((prev) => prev.filter((item) => item.id !== id));
      if (movedItem) {
        setTrashedInquiries((prev) => [data.inquiry || { ...movedItem, is_deleted: 1 }, ...prev]);
      }
      showFeedback(`Inquiry #${id} moved to Trash Bin. It can be restored at any time.`);
      fetchData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error moving inquiry to trash.');
    } finally {
      setIsUpdatingId(null);
    }
  };

  // Restore from Trash Handler
  const handleRestore = async (id: number) => {
    setIsUpdatingId(id);
    try {
      const res = await fetch(`/api/inquiries/${id}/restore`, {
        method: 'POST',
        headers: getAuthHeaders()
      });

      if (!res.ok) {
        throw new Error('Failed to restore inquiry.');
      }

      const data = await res.json();
      const restoredItem = trashedInquiries.find((item) => item.id === id);

      setTrashedInquiries((prev) => prev.filter((item) => item.id !== id));
      if (restoredItem) {
        setInquiries((prev) => [data.inquiry || { ...restoredItem, is_deleted: 0 }, ...prev]);
      }
      showFeedback(`Inquiry #${id} successfully restored to Active Requests!`);
      fetchData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error restoring inquiry.');
    } finally {
      setIsUpdatingId(null);
    }
  };

  // Permanent Delete Handler
  const handlePermanentDelete = async (id: number) => {
    if (!window.confirm(`Permanently delete Inquiry #${id}? This action cannot be undone.`)) {
      return;
    }

    setIsUpdatingId(id);
    try {
      const res = await fetch(`/api/inquiries/${id}/permanent`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!res.ok) {
        throw new Error('Failed to permanently delete inquiry.');
      }

      setTrashedInquiries((prev) => prev.filter((item) => item.id !== id));
      showFeedback(`Inquiry #${id} permanently deleted.`, 'error');
      fetchData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error deleting inquiry.');
    } finally {
      setIsUpdatingId(null);
    }
  };

  // Maintenance Clean Mode Handler
  const handleCleanMode = async (mode: 'trash_all' | 'purge_trash' | 'reset_all' | 'reset_analytics' | 'seed_beta') => {
    let confirmMsg = '';
    if (mode === 'trash_all') {
      confirmMsg = 'Move ALL active inquiries to the Trash Bin? (Cleaning Mode: Soft wipe, fully recoverable from Trash)';
    } else if (mode === 'purge_trash') {
      confirmMsg = 'Permanently purge all items in Trash? (Deleting Mode: irreversible)';
    } else if (mode === 'reset_all') {
      confirmMsg = 'RESET ALL INQUIRIES DATABASE? This deletes every single active & trashed inquiry for a fresh beta test.';
    } else if (mode === 'reset_analytics') {
      confirmMsg = 'Reset page views and traffic counters back to zero for the beta launch?';
    } else if (mode === 'seed_beta') {
      confirmMsg = 'Load 3 realistic Australian Physiotherapy test inquiries for beta demonstration?';
    }

    if (confirmMsg && !window.confirm(confirmMsg)) return;

    setIsCleaning(true);
    try {
      const res = await fetch('/api/admin/clean', {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ mode })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Clean action failed.');
      }

      showFeedback(data.message || `Action ${mode} executed successfully.`);
      await fetchData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Clean action failed.');
    } finally {
      setIsCleaning(false);
    }
  };

  // Re-notify Email Handler
  const handleReNotifyEmail = async (inquiry: Inquiry) => {
    setNotifyingId(inquiry.id);
    try {
      const res = await fetch('/api/admin/notify', {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          inquiryId: inquiry.id,
          recipientEmail: inquiry.email,
          channel: 'email'
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to dispatch notification.');
      }

      showFeedback(`📧 Re-notification email dispatched to ${inquiry.email} for Inquiry #${inquiry.id}!`);
      setNotificationLogs((prev) => [
        {
          id: Date.now(),
          timestamp: new Date().toLocaleTimeString(),
          recipient: inquiry.email,
          status: 'Delivered',
          subject: `Re-notification dispatched for Inquiry #${inquiry.id} (${inquiry.name})`
        },
        ...prev
      ]);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to re-notify via email.');
    } finally {
      setNotifyingId(null);
    }
  };

  // Filtered Active Inquiries (Real-time search, status dropdown, SPMC affiliation, Date range)
  const filteredInquiries = useMemo(() => {
    return inquiries.filter((item) => {
      // 1. Text Search across name, email, clinic domain, service interest
      if (filters.search.trim()) {
        const query = filters.search.trim().toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesEmail = item.email.toLowerCase().includes(query);
        const matchesService = item.service_interest.toLowerCase().includes(query);
        const matchesSchedule = item.schedule_meeting.toLowerCase().includes(query);
        if (!matchesName && !matchesEmail && !matchesService && !matchesSchedule) {
          return false;
        }
      }

      // 2. Status Filter
      if (filters.status !== 'All' && item.status !== filters.status) {
        return false;
      }

      // 3. SPMC Filter
      if (filters.spmc === 'SPMC Only' && item.is_spmc !== 'Yes') {
        return false;
      }
      if (filters.spmc === 'Non-SPMC' && item.is_spmc === 'Yes') {
        return false;
      }

      // 4. Date Range Filter
      const refTime = filters.referenceTimestamp || 0;
      if (filters.dateRange !== 'all' && refTime > 0) {
        if (!item.created_at) return false;
        const itemDate = new Date(item.created_at.replace(' ', 'T'));
        if (isNaN(itemDate.getTime())) return false;

        if (filters.dateRange === 'today') {
          const todayDate = new Date(refTime);
          if (itemDate.toDateString() !== todayDate.toDateString()) return false;
        } else if (filters.dateRange === '7d') {
          const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
          if (refTime - itemDate.getTime() > sevenDaysMs) return false;
        } else if (filters.dateRange === '30d') {
          const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
          if (refTime - itemDate.getTime() > thirtyDaysMs) return false;
        }
      }

      return true;
    });
  }, [inquiries, filters]);

  // Auth Gate: Render Login Screen if not authenticated
  if (!isAuthenticated) {
    return (
      <AdminLogin
        passcode={passcode}
        setPasscode={setPasscode}
        onSubmit={handleLogin}
        isLoggingIn={isLoggingIn}
        loginError={loginError}
        sessionTimeoutNotice={sessionTimeoutNotice}
      />
    );
  }

  return (
    <div className="admin-page fade-in">
      {/* Top Header & Quick Action Buttons */}
      <div className="admin-header-row">
        <div>
          <div className="admin-header-title-wrap">
            <h1 className="admin-header-title">Practice Management Dashboard</h1>
            <span className="admin-db-pill">
              <Database size={12} /> Database Connected
            </span>
            <span className="admin-session-pill" title="Auto-lock triggers after 30 minutes of inactivity">
              <ShieldCheck size={12} /> 30m Auto-Lock
            </span>
          </div>
          <p className="admin-header-subtitle">
            Centralized management for consultation inquiries, clinic triage status, and practice traffic metrics.
          </p>
        </div>

        <div className="admin-header-actions">
          <button 
            type="button"
            className="admin-btn btn-light" 
            onClick={fetchData} 
            disabled={isLoading}
            title="Refresh Data"
          >
            <RefreshCw size={15} className={isLoading ? 'spin' : ''} />
            <span>Refresh</span>
          </button>

          <button 
            type="button"
            className={`admin-btn btn-light ${isContentManagerOpen ? 'active' : ''}`}
            onClick={() => {
              setIsContentManagerOpen(!isContentManagerOpen);
              if (isSettingsOpen) setIsSettingsOpen(false);
              if (isNotificationsOpen) setIsNotificationsOpen(false);
              if (isPasswordModalOpen) setIsPasswordModalOpen(false);
            }}
            title="Website Content Management (Hero, Mission, FAQs, Testimonials)"
          >
            <Globe size={15} />
            <span>Website CMS</span>
          </button>

          <button 
            type="button"
            className={`admin-btn btn-light ${isPasswordModalOpen ? 'active' : ''}`}
            onClick={() => {
              setIsPasswordModalOpen(!isPasswordModalOpen);
              if (isSettingsOpen) setIsSettingsOpen(false);
              if (isNotificationsOpen) setIsNotificationsOpen(false);
              if (isContentManagerOpen) setIsContentManagerOpen(false);
            }}
            title="Change Staff Passcode & Security Settings"
          >
            <KeyRound size={15} />
            <span>Security</span>
          </button>

          <button 
            type="button"
            className={`admin-btn btn-light admin-notif-trigger-btn ${isNotificationsOpen ? 'active' : ''}`}
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              if (isSettingsOpen) setIsSettingsOpen(false);
              if (isContentManagerOpen) setIsContentManagerOpen(false);
              if (isPasswordModalOpen) setIsPasswordModalOpen(false);
            }}
            title="Notifications & Email Dispatch"
          >
            <Bell size={17} />
            <span className="admin-notif-dot" />
          </button>

          <button 
            type="button"
            className={`admin-btn btn-light ${isSettingsOpen ? 'active' : ''}`}
            onClick={() => {
              setIsSettingsOpen(!isSettingsOpen);
              if (isNotificationsOpen) setIsNotificationsOpen(false);
              if (isContentManagerOpen) setIsContentManagerOpen(false);
              if (isPasswordModalOpen) setIsPasswordModalOpen(false);
            }}
            title="Database Maintenance & Cleaning Mode"
          >
            <Settings size={17} />
          </button>

          <button 
            type="button"
            className="admin-btn btn-signout"
            onClick={() => handleLogout()}
            title="Log out of Admin Portal"
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Dynamic Feedback Banner */}
      {feedback && (
        <div className={`admin-feedback-bar ${feedback.type}`}>
          {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Backend Connection Error */}
      {error && (
        <div className="admin-feedback-bar error mb-4">
          <AlertCircle size={20} className="flex-shrink-0" />
          <div>
            <strong>Backend Connection Error:</strong> {error}
            <span style={{ display: 'block', fontSize: '0.85rem', marginTop: '0.2rem' }}>
              Ensure the backend server is running (`npm run dev:all`).
            </span>
          </div>
        </div>
      )}

      {/* Modular Analytics Overview */}
      <AnalyticsOverview
        summary={summary}
        activeCount={inquiries.length}
        trashedCount={trashedInquiries.length}
        inquiries={inquiries}
      />

      {/* Main Operations Card */}
      <div className="card admin-main-card">
        <div className="admin-card-header-bar">
          <h3 className="admin-card-title">
            <Users size={20} className="text-primary-light" />
            <span>Client Requests & Practice Leads</span>
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* Export To CSV Tool */}
            {activeTab === 'active' && (
              <ExportTools
                inquiries={filteredInquiries}
                disabled={filteredInquiries.length === 0}
                filterLabel={filteredInquiries.length !== inquiries.length ? 'Filtered' : undefined}
              />
            )}

            {/* Tab Navigation */}
            <div className="admin-nav-tabs">
              <button
                type="button"
                onClick={() => setActiveTab('active')}
                className={`admin-tab-btn ${activeTab === 'active' ? 'active' : ''}`}
              >
                <span>Active Requests</span>
                <span className={`admin-tab-badge ${activeTab === 'active' ? 'active-badge' : 'inactive-badge'}`}>
                  {inquiries.length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('trash')}
                className={`admin-tab-btn ${activeTab === 'trash' ? 'trash-active' : ''}`}
              >
                <Trash2 size={14} />
                <span>Trash Bin</span>
                <span className="admin-tab-badge trash-badge">
                  {trashedInquiries.length}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab 1: Active Inquiries View */}
        {activeTab === 'active' && (
          <div>
            {/* Real-time Filters & Search Bar */}
            <LeadFilters
              filters={filters}
              onFilterChange={setFilters}
              totalCount={inquiries.length}
              filteredCount={filteredInquiries.length}
            />

            {/* Decomposed Inquiries Table */}
            <InquiriesTable
              inquiries={filteredInquiries}
              isLoading={isLoading}
              isUpdatingId={isUpdatingId}
              notifyingId={notifyingId}
              onStatusChange={handleStatusChange}
              onMoveToTrash={handleMoveToTrash}
              onReNotifyEmail={handleReNotifyEmail}
            />
          </div>
        )}

        {/* Tab 2: Archived Inquiries View */}
        {activeTab === 'trash' && (
          <TrashBinTable
            trashedInquiries={trashedInquiries}
            isUpdatingId={isUpdatingId}
            onRestore={handleRestore}
            onPermanentDelete={handlePermanentDelete}
          />
        )}

        {/* Practice Compliance Notice */}
        <div className="admin-compliance-notice">
          Compliance Notice: System maintains strict separation between practice administration records and protected clinical health data.
        </div>
      </div>

      {/* Settings Modal: Practice Data Management & Archive Controls */}
      <MaintenanceModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onCleanMode={handleCleanMode}
        isCleaning={isCleaning}
      />

      {/* Notifications Modal: Re-notification Dispatch & Log Viewer */}
      <NotificationCenter
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        logs={notificationLogs}
      />

      {/* Website CMS Content Management Modal */}
      <ContentManager
        isOpen={isContentManagerOpen}
        onClose={() => setIsContentManagerOpen(false)}
        getAuthHeaders={getAuthHeaders}
        onNotifySuccess={(msg) => showFeedback(msg, 'success')}
      />

      {/* Change Staff Passcode Modal */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        getAuthHeaders={getAuthHeaders}
        onSuccess={() => {
          showFeedback('Administrative staff passcode updated successfully in active session.', 'success');
        }}
      />
    </div>
  );
};

export default Admin;
