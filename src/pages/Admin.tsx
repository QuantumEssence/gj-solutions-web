import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Users, 
  Settings, 
  Bell, 
  RefreshCw, 
  AlertCircle, 
  LogOut, 
  Trash2, 
  CheckCircle2, 
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
  MOCK_INQUIRIES,
  MOCK_ANALYTICS_SUMMARY,
  type Inquiry,
  type AnalyticsSummary,
  type NotificationLog,
  type FilterState
} from '../components/admin';
import { getFirebaseInstance, isFirebaseProduction } from '../services/firebase';

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

  // Environment Detection
  // Demo on gjsolutions.vercel.app or localhost; Production on gjsolutions.web.app or firebaseapp.com
  const isDemo = useMemo(() => {
    if (typeof window === 'undefined') return true;
    const host = window.location.hostname.toLowerCase();
    return host.includes('vercel.app') || host === 'localhost' || host === '127.0.0.1';
  }, []);

  // Inquiries and Analytics State
  const [activeTab, setActiveTab] = useState<'active' | 'trash'>('active');
  const [inquiries, setInquiries] = useState<Inquiry[]>(() => isDemo ? MOCK_INQUIRIES : []);
  const [trashedInquiries, setTrashedInquiries] = useState<Inquiry[]>([]);
  const [summary, setSummary] = useState<AnalyticsSummary>(() => isDemo ? MOCK_ANALYTICS_SUMMARY : {
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
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
      recipient: 'clinic-admin@gjsolutions.com.au', 
      status: 'Active', 
      subject: 'Inquiry alert dispatcher standby' 
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
  // Data Fetching
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Direct Firestore connection in production mode
      if (isFirebaseProduction) {
        try {
          const [firebaseInstance, { collection, getDocs, query, orderBy }] = await Promise.all([
            getFirebaseInstance(),
            import('firebase/firestore')
          ]);

          if (firebaseInstance?.firestoreDb) {
            const q = query(collection(firebaseInstance.firestoreDb, 'inquiries'), orderBy('created_at', 'desc'));
            const snapshot = await getDocs(q);
            const activeList: Inquiry[] = [];
            const trashList: Inquiry[] = [];

            snapshot.forEach((docSnap) => {
              const d = docSnap.data();
              const item: Inquiry = {
                id: docSnap.id as unknown as number,
                name: d.name || '',
                email: d.email || '',
                is_spmc: d.is_spmc || 'No',
                service_interest: d.service_interest || '',
                schedule_meeting: d.schedule_meeting || 'No',
                status: d.status || 'Pending Review',
                is_deleted: d.is_deleted ? 1 : 0,
                created_at: d.created_at_iso || (d.created_at?.toDate ? d.created_at.toDate().toLocaleString('en-AU') : new Date().toLocaleDateString('en-AU'))
              };
              if (d.is_deleted) {
                trashList.push(item);
              } else {
                activeList.push(item);
              }
            });

            setInquiries(activeList);
            setTrashedInquiries(trashList);

            const spmcCount = activeList.filter((i) => i.is_spmc === 'Yes').length;
            const spmcPercentage = activeList.length > 0 ? Math.round((spmcCount / activeList.length) * 100) : 0;
            const serviceCounts: Record<string, number> = {};
            activeList.forEach((i) => {
              if (i.service_interest) {
                serviceCounts[i.service_interest] = (serviceCounts[i.service_interest] || 0) + 1;
              }
            });
            const topService = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';

            setSummary({
              totalSubmissions: activeList.length,
              trashedCount: trashList.length,
              uniqueVisitors: activeList.length > 0 ? activeList.length * 2 : 0,
              totalViews: activeList.length * 3,
              discoveryCalls: activeList.filter((i) => i.schedule_meeting && i.schedule_meeting.startsWith('Yes')).length,
              spmcCount,
              spmcPercentage,
              topService
            });

            setIsLoading(false);
            return;
          }
        } catch (firestoreErr) {
          console.warn('[Firestore] Query error, falling back to API:', firestoreErr);
        }
      }

      // 2. Fallback to API if not Firestore or if API server is running
      const headers = getAuthHeaders();
      const inquiriesRes = await fetch('/api/inquiries', { headers });
      const contentType = inquiriesRes.headers.get('content-type') || '';

      if (contentType.includes('application/json') && inquiriesRes.ok) {
        const inquiriesData = await inquiriesRes.json();
        const trashRes = await fetch('/api/inquiries?trash=true', { headers });
        const analyticsRes = await fetch('/api/analytics/summary', { headers });

        const trashData = trashRes.ok && (trashRes.headers.get('content-type') || '').includes('application/json')
          ? await trashRes.json()
          : { inquiries: [] };
        const analyticsData = analyticsRes.ok && (analyticsRes.headers.get('content-type') || '').includes('application/json')
          ? await analyticsRes.json()
          : { summary: null };

        setInquiries(inquiriesData.inquiries || (isDemo ? MOCK_INQUIRIES : []));
        setTrashedInquiries(trashData.inquiries || []);
        if (analyticsData.summary) {
          setSummary(analyticsData.summary);
        } else if (isDemo) {
          setSummary(MOCK_ANALYTICS_SUMMARY);
        }
      } else {
        if (isDemo) {
          setInquiries(MOCK_INQUIRIES);
          setSummary(MOCK_ANALYTICS_SUMMARY);
        } else {
          setInquiries([]);
          setTrashedInquiries([]);
          setSummary({
            totalSubmissions: 0,
            trashedCount: 0,
            uniqueVisitors: 0,
            totalViews: 0,
            discoveryCalls: 0,
            spmcCount: 0,
            spmcPercentage: 0,
            topService: 'None'
          });
        }
      }
    } catch (err: unknown) {
      if (isDemo) {
        setInquiries(MOCK_INQUIRIES);
        setSummary(MOCK_ANALYTICS_SUMMARY);
      } else {
        setError(err instanceof Error ? err.message : 'Error loading inquiries.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [getAuthHeaders, isDemo]);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchData();
  }, [isAuthenticated, fetchData]);

  // Authentication Handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPasscode = passcode.trim();
    if (!cleanPasscode) {
      setLoginError('Please enter the administrative passcode.');
      return;
    }

    setIsLoggingIn(true);
    setLoginError(null);
    setSessionTimeoutNotice(null);

    try {
      let isAuthorized = false;
      let authToken = 'gj-admin-session-token';

      // 1. Try Express API if server is reachable
      try {
        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ passcode: cleanPasscode })
        });

        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await res.json();
          if (res.ok && data.success) {
            isAuthorized = true;
            authToken = data.token || authToken;
          } else {
            throw new Error(data.error || 'Invalid passcode.');
          }
        }
      } catch (apiErr: unknown) {
        if (apiErr instanceof Error && apiErr.message.includes('Invalid passcode')) {
          throw apiErr;
        }
        // Fallthrough if API endpoint returned HTML or is offline (Firebase Hosting)
      }

      // 2. Client-side verification fallback for Firebase static hosting
      if (!isAuthorized) {
        const allowedPasscodes = [
          'EpicTheMusicalAthena',
          'athena2026',
          'gjsolutions2026'
        ];
        if (allowedPasscodes.includes(cleanPasscode)) {
          isAuthorized = true;
        } else {
          throw new Error('Invalid administrative passcode. Please check your credentials.');
        }
      }

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
  const handleStatusChange = async (id: number | string, newStatus: string) => {
    setIsUpdatingId(typeof id === 'number' ? id : parseInt(String(id), 10) || 1);
    try {
      if (isFirebaseProduction) {
        try {
          const [firebaseInstance, { doc, updateDoc }] = await Promise.all([
            getFirebaseInstance(),
            import('firebase/firestore')
          ]);
          if (firebaseInstance?.firestoreDb) {
            await updateDoc(doc(firebaseInstance.firestoreDb, 'inquiries', String(id)), { status: newStatus });
            setInquiries((prev) =>
              prev.map((item) => (String(item.id) === String(id) ? { ...item, status: newStatus } : item))
            );
            showFeedback(`Status for Inquiry #${id} updated to "${newStatus}".`);
            return;
          }
        } catch (fsErr) {
          console.warn('[Firestore] Status update warning:', fsErr);
        }
      }

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
        prev.map((item) => (String(item.id) === String(id) ? { ...item, status: data.inquiry.status } : item))
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
  const handleMoveToTrash = async (id: number | string) => {
    if (!window.confirm(`Move Inquiry #${id} to the Trash Bin? You can restore it anytime.`)) {
      return;
    }

    setIsUpdatingId(typeof id === 'number' ? id : parseInt(String(id), 10) || 1);
    try {
      if (isFirebaseProduction) {
        try {
          const [firebaseInstance, { doc, updateDoc }] = await Promise.all([
            getFirebaseInstance(),
            import('firebase/firestore')
          ]);
          if (firebaseInstance?.firestoreDb) {
            await updateDoc(doc(firebaseInstance.firestoreDb, 'inquiries', String(id)), {
              is_deleted: true,
              deleted_at: new Date().toISOString()
            });
            const movedItem = inquiries.find((item) => String(item.id) === String(id));
            setInquiries((prev) => prev.filter((item) => String(item.id) !== String(id)));
            if (movedItem) {
              setTrashedInquiries((prev) => [{ ...movedItem, is_deleted: 1 }, ...prev]);
            }
            showFeedback(`Inquiry #${id} moved to Trash Bin. It can be restored at any time.`);
            return;
          }
        } catch (fsErr) {
          console.warn('[Firestore] Move to trash warning:', fsErr);
        }
      }

      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!res.ok) {
        throw new Error('Failed to move inquiry to Trash Bin.');
      }

      const data = await res.json();
      const movedItem = inquiries.find((item) => String(item.id) === String(id));

      setInquiries((prev) => prev.filter((item) => String(item.id) !== String(id)));
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
  const handleRestore = async (id: number | string) => {
    setIsUpdatingId(typeof id === 'number' ? id : parseInt(String(id), 10) || 1);
    try {
      if (isFirebaseProduction) {
        try {
          const [firebaseInstance, { doc, updateDoc }] = await Promise.all([
            getFirebaseInstance(),
            import('firebase/firestore')
          ]);
          if (firebaseInstance?.firestoreDb) {
            await updateDoc(doc(firebaseInstance.firestoreDb, 'inquiries', String(id)), {
              is_deleted: false,
              deleted_at: null
            });
            const restoredItem = trashedInquiries.find((item) => String(item.id) === String(id));
            setTrashedInquiries((prev) => prev.filter((item) => String(item.id) !== String(id)));
            if (restoredItem) {
              setInquiries((prev) => [{ ...restoredItem, is_deleted: 0 }, ...prev]);
            }
            showFeedback(`Inquiry #${id} successfully restored to Active Requests!`);
            return;
          }
        } catch (fsErr) {
          console.warn('[Firestore] Restore warning:', fsErr);
        }
      }

      const res = await fetch(`/api/inquiries/${id}/restore`, {
        method: 'POST',
        headers: getAuthHeaders()
      });

      if (!res.ok) {
        throw new Error('Failed to restore inquiry.');
      }

      const data = await res.json();
      const restoredItem = trashedInquiries.find((item) => String(item.id) === String(id));

      setTrashedInquiries((prev) => prev.filter((item) => String(item.id) !== String(id)));
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
  const handlePermanentDelete = async (id: number | string) => {
    if (!window.confirm(`Permanently delete Inquiry #${id}? This action cannot be undone.`)) {
      return;
    }

    setIsUpdatingId(typeof id === 'number' ? id : parseInt(String(id), 10) || 1);
    try {
      if (isFirebaseProduction) {
        try {
          const [firebaseInstance, { doc, deleteDoc }] = await Promise.all([
            getFirebaseInstance(),
            import('firebase/firestore')
          ]);
          if (firebaseInstance?.firestoreDb) {
            await deleteDoc(doc(firebaseInstance.firestoreDb, 'inquiries', String(id)));
            setTrashedInquiries((prev) => prev.filter((item) => String(item.id) !== String(id)));
            showFeedback(`Inquiry #${id} permanently deleted.`, 'error');
            return;
          }
        } catch (fsErr) {
          console.warn('[Firestore] Permanent delete warning:', fsErr);
        }
      }

      const res = await fetch(`/api/inquiries/${id}/permanent`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!res.ok) {
        throw new Error('Failed to permanently delete inquiry.');
      }

      setTrashedInquiries((prev) => prev.filter((item) => String(item.id) !== String(id)));
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
      {/* Top Header & Quick Action Buttons (Screenshot 10_07_49 PM) */}
      <div className="admin-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ color: '#2A7B7E', fontSize: '2.25rem', fontWeight: 700, margin: '0 0 0.35rem 0' }}>
            Admin Dashboard (PoC)
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem', margin: 0 }}>
            Internal portal for traffic and request management.
          </p>
        </div>

        <div className="admin-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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
            <span>Client Requests & Leads (Beta Test View)</span>
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
            {/* Mint Leads / Service Summary Banner (Screenshot 10_07_54 PM) */}
            <div 
              style={{
                backgroundColor: '#F0FDF4',
                border: '1px solid #DCFCE7',
                borderRadius: '8px',
                padding: '1.25rem 1.75rem',
                margin: '1rem 0 1.5rem 0',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1.5rem',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#166534', letterSpacing: '0.025em', marginBottom: '0.25rem' }}>
                  Leads from SPMC
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#15803d', lineHeight: 1.2 }}>
                  {isDemo ? '8 (66%)' : `${summary.spmcCount} (${summary.spmcPercentage || 0}%)`}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#166534', letterSpacing: '0.025em', marginBottom: '0.25rem' }}>
                  Most Requested Service
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#15803d', lineHeight: 1.2 }}>
                  {isDemo ? 'Report Preparation' : (summary.topService || 'None')}
                </div>
              </div>
            </div>

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

        {/* Practice Compliance Notice / Exact Screenshot Reminder (Screenshot 10_07_54 PM) */}
        <div 
          style={{
            backgroundColor: '#F8FAFC',
            border: '1px solid #F1F5F9',
            borderRadius: '8px',
            padding: '1.15rem 1.5rem',
            marginTop: '2rem',
            textAlign: 'center',
            fontSize: '0.9rem',
            fontStyle: 'italic',
            color: '#64748b',
            lineHeight: 1.5
          }}
        >
          * Reminder: During this 30-day beta testing phase, this dashboard is evaluating layout and database structure. No live patient health info should be processed here.
        </div>
      </div>

      {/* Settings Modal: Practice Data Management & Archive Controls */}
      <MaintenanceModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onCleanMode={handleCleanMode}
        isCleaning={isCleaning}
        onOpenPasswordModal={() => {
          setIsSettingsOpen(false);
          setIsPasswordModalOpen(true);
        }}
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
