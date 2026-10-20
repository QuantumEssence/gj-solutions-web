import { useState, useEffect, useCallback } from 'react';
import { 
  BarChart3, 
  Users, 
  Settings, 
  Bell, 
  RefreshCw, 
  Database, 
  AlertCircle,
  Lock,
  LogOut,
  Trash2,
  RotateCcw,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

interface Inquiry {
  id: number;
  name: string;
  email: string;
  is_spmc: string;
  service_interest: string;
  schedule_meeting: string;
  status: string;
  is_deleted?: number;
  deleted_at?: string | null;
  created_at: string;
}

interface AnalyticsSummary {
  totalSubmissions: number;
  trashedCount?: number;
  uniqueVisitors: number;
  totalViews: number;
  discoveryCalls: number;
  spmcCount: number;
  spmcPercentage: number;
  topService: string;
}

const Admin = () => {
  // Authentication state (Session Storage gate)
  const [token, setToken] = useState<string | null>(() => {
    return sessionStorage.getItem('gj_admin_token');
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('gj_admin_authenticated') === 'true' && !!sessionStorage.getItem('gj_admin_token');
  });
  const [passcode, setPasscode] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Inquiries and Trash Bin state
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

  const getAuthHeaders = useCallback((extraHeaders: Record<string, string> = {}) => {
    const currentToken = token || sessionStorage.getItem('gj_admin_token');
    return {
      ...(currentToken ? { 'Authorization': `Bearer ${currentToken}` } : {}),
      ...extraHeaders
    };
  }, [token]);

  const showFeedback = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ text, type });
    setTimeout(() => {
      setFeedback(null);
    }, 4500);
  };

  const fetchData = async () => {
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
  };

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setLoginError('Please enter the administrative passcode.');
      return;
    }

    setIsLoggingIn(true);
    setLoginError(null);

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

  const handleLogout = () => {
    sessionStorage.removeItem('gj_admin_authenticated');
    sessionStorage.removeItem('gj_admin_token');
    setToken(null);
    setIsAuthenticated(false);
    setPasscode('');
  };

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
      // Auto-refresh live analytics counters immediately to keep SPMC badges and totals in sync
      fetchData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error moving inquiry to trash.');
    } finally {
      setIsUpdatingId(null);
    }
  };

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
      // Auto-refresh live analytics counters immediately to keep SPMC badges and totals in sync
      fetchData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error restoring inquiry.');
    } finally {
      setIsUpdatingId(null);
    }
  };

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
        return { backgroundColor: '#e0e7ff', color: '#4f46e5' };
      case 'Replied via Email':
        return { backgroundColor: '#dcfce7', color: '#166534' };
      default:
        return { backgroundColor: '#fef3c7', color: '#d97706' };
    }
  };

  // Auth Gate: Render Login Screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="admin-page fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '65vh' }}>
        <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '2.5rem', textAlign: 'center', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#f0fdf4', border: '2px solid #86efac', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#166534' }}>
            <Lock size={28} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>
            🔒 Admin Portal Access
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.75rem', lineHeight: '1.5' }}>
            Protected administrative area. Enter your staff passcode to view leads, client requests, and traffic analytics.
          </p>

          {loginError && (
            <div style={{ backgroundColor: '#fef2f2', border: '1px solid #f87171', color: '#b91c1c', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1.25rem', textAlign: 'left' }}>
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1.25rem', textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '0.4rem' }}>
                Admin Passcode
              </label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter admin passcode..."
                autoFocus
                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none' }}
              />
            </div>
            <button
              type="submit"
              disabled={isLoggingIn}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', fontWeight: '600', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
            >
              {isLoggingIn ? 'Authenticating...' : <><span>Sign In to Admin Portal</span> <ArrowRight size={16} /></>}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page fade-in">
      <div className="section-header mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1 className="section-title mb-1" style={{ margin: 0 }}>Admin Dashboard</h1>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', backgroundColor: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', fontSize: '0.75rem', fontWeight: 'bold', padding: '0.2rem 0.6rem', borderRadius: '999px' }}>
              <Database size={12} /> Live Supabase DB Connected
            </span>
          </div>
          <p style={{ color: '#e6f4f5', marginTop: '0.25rem' }}>Internal portal for live traffic, questionnaire submissions, and request management.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button 
            className="btn" 
            onClick={fetchData} 
            disabled={isLoading}
            title="Refresh Data"
            style={{ background: '#f1f5f9', color: '#475569', padding: '0.5rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
          >
            <RefreshCw size={16} className={isLoading ? 'spin' : ''} style={isLoading ? { animation: 'spin 1s linear infinite' } : {}} /> Refresh
          </button>
          <button className="btn" style={{ background: '#f1f5f9', color: '#475569', padding: '0.5rem' }} title="Notifications"><Bell size={20} /></button>
          <button className="btn" style={{ background: '#f1f5f9', color: '#475569', padding: '0.5rem' }} title="Settings"><Settings size={20} /></button>
          <button 
            className="btn"
            onClick={handleLogout}
            title="Log out of Admin Portal"
            style={{ background: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5', padding: '0.5rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: '600' }}
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>

      {feedback && (
        <div className="mb-4" style={{ 
          backgroundColor: feedback.type === 'success' ? '#ecfdf5' : '#fef2f2', 
          border: `1px solid ${feedback.type === 'success' ? '#86efac' : '#f87171'}`, 
          color: feedback.type === 'success' ? '#166534' : '#b91c1c',
          padding: '0.85rem 1.25rem', 
          borderRadius: '8px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          fontWeight: '500'
        }}>
          {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{feedback.text}</span>
        </div>
      )}

      {error && (
        <div className="mb-4" style={{ backgroundColor: '#fee2e2', border: '1px solid #f87171', padding: '1rem', borderRadius: '8px', color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <AlertCircle size={20} />
          <div>
            <strong>Backend Connection Error:</strong> {error}
            <span style={{ display: 'block', fontSize: '0.85rem', marginTop: '0.25rem' }}>Ensure the backend server is running (`npm run dev:all`).</span>
          </div>
        </div>
      )}

      {/* Analytics Overview */}
      <div className="card mb-4" style={{ padding: '1.5rem' }}>
        <h3 className="mb-3" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BarChart3 size={20} className="text-primary-light" /> Traffic & Analytics Overview
        </h3>
        <div style={{ height: '140px', backgroundColor: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#64748b', padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontWeight: '500', color: 'var(--color-primary-dark)', marginBottom: '0.25rem' }}>Site Traffic Activity Feed</div>
          <div style={{ fontSize: '0.85rem' }}>
            Logging live page views to SQLite database • Total page impressions logged: <strong>{summary.totalViews}</strong>
          </div>
        </div>
        <div className="grid mt-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: '#f1f5f9', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Unique Visitors</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-primary-dark)' }}>{summary.uniqueVisitors}</div>
          </div>
          <div style={{ padding: '1rem', backgroundColor: '#f1f5f9', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active Inquiries</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-primary-dark)' }}>{summary.totalSubmissions}</div>
          </div>
          <div style={{ padding: '1rem', backgroundColor: '#f1f5f9', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Discovery Calls</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-primary-dark)' }}>{summary.discoveryCalls}</div>
          </div>
          <div style={{ padding: '1rem', backgroundColor: '#f1f5f9', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Trash Bin Items</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: (summary.trashedCount || 0) > 0 ? '#b45309' : '#64748b' }}>
              {summary.trashedCount ?? trashedInquiries.length}
            </div>
          </div>
        </div>
      </div>

      {/* Requests Management & Trash Bin */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={20} className="text-primary-light" /> Client Requests & Leads
          </h3>

          {/* Tab Navigation */}
          <div style={{ display: 'inline-flex', backgroundColor: '#f1f5f9', padding: '0.25rem', borderRadius: '8px', gap: '0.25rem' }}>
            <button
              onClick={() => setActiveTab('active')}
              style={{
                border: 'none',
                padding: '0.45rem 1rem',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer',
                backgroundColor: activeTab === 'active' ? '#ffffff' : 'transparent',
                color: activeTab === 'active' ? 'var(--color-primary-dark)' : '#64748b',
                boxShadow: activeTab === 'active' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <span>Active Requests</span>
              <span style={{ 
                fontSize: '0.75rem', 
                backgroundColor: activeTab === 'active' ? '#e6f4f5' : '#e2e8f0', 
                padding: '0.1rem 0.5rem', 
                borderRadius: '999px',
                color: activeTab === 'active' ? 'var(--color-primary-dark)' : '#475569'
              }}>
                {inquiries.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('trash')}
              style={{
                border: 'none',
                padding: '0.45rem 1rem',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer',
                backgroundColor: activeTab === 'trash' ? '#ffffff' : 'transparent',
                color: activeTab === 'trash' ? '#b91c1c' : '#64748b',
                boxShadow: activeTab === 'trash' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <Trash2 size={14} />
              <span>Trash Bin</span>
              <span style={{ 
                fontSize: '0.75rem', 
                backgroundColor: activeTab === 'trash' ? '#fee2e2' : '#e2e8f0', 
                padding: '0.1rem 0.5rem', 
                borderRadius: '999px',
                color: activeTab === 'trash' ? '#b91c1c' : '#475569'
              }}>
                {trashedInquiries.length}
              </span>
            </button>
          </div>
        </div>

        {/* Lead Statistics Banner */}
        <div className="grid mb-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', backgroundColor: '#f0fdf4', padding: '1rem', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
          <div>
            <span style={{ display: 'block', fontSize: '0.85rem', color: '#166534', fontWeight: 'bold' }}>Leads from SPMC</span>
            <span style={{ fontSize: '1.5rem', color: '#14532d', fontWeight: 'bold' }}>
              {summary.spmcCount} ({summary.spmcPercentage}%)
            </span>
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '0.85rem', color: '#166534', fontWeight: 'bold' }}>Most Requested Service</span>
            <span style={{ fontSize: '1.1rem', color: '#14532d', fontWeight: 'bold' }}>{summary.topService}</span>
          </div>
        </div>

        {/* Tab 1: Active Inquiries View */}
        {activeTab === 'active' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '840px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
                  <th style={{ padding: '1rem 0.5rem' }}>Ref # / Date</th>
                  <th style={{ padding: '1rem 0.5rem' }}>Name / Email</th>
                  <th style={{ padding: '1rem 0.5rem' }}>SPMC?</th>
                  <th style={{ padding: '1rem 0.5rem' }}>Service Interest</th>
                  <th style={{ padding: '1rem 0.5rem' }}>Meeting?</th>
                  <th style={{ padding: '1rem 0.5rem' }}>Status</th>
                  <th style={{ padding: '1rem 0.5rem', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                      {isLoading ? 'Loading inquiries...' : 'No active inquiries recorded.'}
                    </td>
                  </tr>
                ) : (
                  inquiries.map((inquiry) => (
                    <tr key={inquiry.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        <div style={{ fontWeight: '600', color: '#334155' }}>#{inquiry.id}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{formatDate(inquiry.created_at)}</div>
                      </td>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        <div style={{ fontWeight: '500' }}>{inquiry.name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{inquiry.email}</div>
                      </td>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        <span style={{ color: inquiry.is_spmc === 'Yes' ? 'var(--color-primary-dark)' : '#94a3b8', fontWeight: 'bold' }}>
                          {inquiry.is_spmc}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 0.5rem' }}>{inquiry.service_interest}</td>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        <span style={{ fontWeight: inquiry.schedule_meeting === 'Yes' ? '600' : 'normal', color: inquiry.schedule_meeting === 'Yes' ? '#1e293b' : '#64748b' }}>
                          {inquiry.schedule_meeting}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        <select
                          value={inquiry.status}
                          disabled={isUpdatingId === inquiry.id}
                          onChange={(e) => handleStatusChange(inquiry.id, e.target.value)}
                          style={{
                            ...getStatusStyle(inquiry.status),
                            padding: '0.35rem 0.75rem',
                            borderRadius: '999px',
                            fontSize: '0.8rem',
                            fontWeight: 'bold',
                            border: 'none',
                            cursor: 'pointer',
                            outline: 'none'
                          }}
                        >
                          <option value="Pending Review">Pending Review</option>
                          <option value="Meeting Scheduled">Meeting Scheduled</option>
                          <option value="Replied via Email">Replied via Email</option>
                        </select>
                      </td>
                      <td style={{ padding: '1rem 0.5rem', textAlign: 'center' }}>
                        <button
                          onClick={() => handleMoveToTrash(inquiry.id)}
                          disabled={isUpdatingId === inquiry.id}
                          title="Move inquiry to Trash Bin"
                          style={{
                            backgroundColor: '#f8fafc',
                            border: '1px solid #cbd5e1',
                            color: '#64748b',
                            padding: '0.35rem 0.65rem',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            fontSize: '0.8rem',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#fee2e2';
                            e.currentTarget.style.color = '#dc2626';
                            e.currentTarget.style.borderColor = '#fca5a5';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#f8fafc';
                            e.currentTarget.style.color = '#64748b';
                            e.currentTarget.style.borderColor = '#cbd5e1';
                          }}
                        >
                          <Trash2 size={13} />
                          <span>Trash</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Trash Bin View (Per Oct 5 Meeting Requirement) */}
        {activeTab === 'trash' && (
          <div>
            <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fcd34d', color: '#92400e', padding: '0.85rem 1.25rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <RotateCcw size={18} style={{ flexShrink: 0 }} />
              <div>
                <strong>Trash Bin Protection (Oct 5 Meeting Requirement):</strong> Inquiries deleted here are safeguarded against accidental loss and can be restored back to the live list at any time.
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '840px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
                    <th style={{ padding: '1rem 0.5rem' }}>Ref # / Submitted</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Name / Email</th>
                    <th style={{ padding: '1rem 0.5rem' }}>SPMC?</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Service Interest</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Deleted On</th>
                    <th style={{ padding: '1rem 0.5rem', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {trashedInquiries.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🗑️</div>
                        <div style={{ fontWeight: '600', color: '#334155' }}>Trash Bin is Empty</div>
                        <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                          No deleted inquiries currently stored. Accidental deletions will appear here for easy restoration.
                        </div>
                      </td>
                    </tr>
                  ) : (
                    trashedInquiries.map((inquiry) => (
                      <tr key={inquiry.id} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#fffdfa' }}>
                        <td style={{ padding: '1rem 0.5rem' }}>
                          <div style={{ fontWeight: '600', color: '#334155' }}>#{inquiry.id}</div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{formatDate(inquiry.created_at)}</div>
                        </td>
                        <td style={{ padding: '1rem 0.5rem' }}>
                          <div style={{ fontWeight: '500' }}>{inquiry.name}</div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{inquiry.email}</div>
                        </td>
                        <td style={{ padding: '1rem 0.5rem' }}>
                          <span style={{ color: inquiry.is_spmc === 'Yes' ? 'var(--color-primary-dark)' : '#94a3b8', fontWeight: 'bold' }}>
                            {inquiry.is_spmc}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 0.5rem' }}>{inquiry.service_interest}</td>
                        <td style={{ padding: '1rem 0.5rem' }}>
                          <span style={{ fontSize: '0.85rem', color: '#92400e', backgroundColor: '#fef3c7', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                            {formatDate(inquiry.deleted_at)}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 0.5rem', textAlign: 'center' }}>
                          <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                            <button
                              onClick={() => handleRestore(inquiry.id)}
                              disabled={isUpdatingId === inquiry.id}
                              title="Restore back to Active Inquiries"
                              style={{
                                backgroundColor: '#ecfdf5',
                                border: '1px solid #a7f3d0',
                                color: '#047857',
                                padding: '0.35rem 0.75rem',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                fontSize: '0.8rem',
                                fontWeight: 'bold'
                              }}
                            >
                              <RotateCcw size={13} />
                              <span>Restore</span>
                            </button>
                            <button
                              onClick={() => handlePermanentDelete(inquiry.id)}
                              disabled={isUpdatingId === inquiry.id}
                              title="Delete permanently from SQLite database"
                              style={{
                                backgroundColor: '#fef2f2',
                                border: '1px solid #fecaca',
                                color: '#dc2626',
                                padding: '0.35rem 0.6rem',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                fontSize: '0.8rem'
                              }}
                            >
                              <Trash2 size={13} />
                              <span>Delete Forever</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-4 text-center" style={{ color: '#64748b', fontSize: '0.9rem', fontStyle: 'italic', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
          * Compliance Reminder: During this beta testing phase, this dashboard evaluates layout and database structure. No live patient health info should be processed here.
        </div>
      </div>
    </div>
  );
};

export default Admin;
