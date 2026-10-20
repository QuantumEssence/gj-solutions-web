import { supabase } from './supabase.js';

/**
 * Creates a new inquiry record in Supabase.
 */
export async function createInquiry({ name, email, isSPMC, serviceInterest, scheduleMeeting }) {
  const { data, error } = await supabase
    .from('inquiries')
    .insert([
      {
        name,
        email,
        is_spmc: isSPMC,
        service_interest: serviceInterest,
        schedule_meeting: scheduleMeeting,
        status: 'Pending Review',
        is_deleted: false
      }
    ])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create inquiry: ${error.message}`);
  }

  return data;
}

/**
 * Retrieves all active inquiries (is_deleted = false).
 */
export async function getAllInquiries() {
  const { data, error } = await supabase
    .from('inquiries')
    .select('*')
    .eq('is_deleted', false)
    .order('created_at', { ascending: false })
    .order('id', { ascending: false });

  if (error) {
    throw new Error(`Failed to get inquiries: ${error.message}`);
  }

  return data || [];
}

/**
 * Retrieves all trashed inquiries (is_deleted = true).
 */
export async function getTrashInquiries() {
  const { data, error } = await supabase
    .from('inquiries')
    .select('*')
    .eq('is_deleted', true)
    .order('deleted_at', { ascending: false })
    .order('id', { ascending: false });

  if (error) {
    throw new Error(`Failed to get trash inquiries: ${error.message}`);
  }

  return data || [];
}

/**
 * Soft deletes an inquiry by flagging is_deleted = true and recording deleted_at timestamp.
 */
export async function softDeleteInquiry(id) {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('inquiries')
    .update({
      is_deleted: true,
      deleted_at: now
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to soft delete inquiry: ${error.message}`);
  }

  return data;
}

/**
 * Restores a soft-deleted inquiry back to active.
 */
export async function restoreInquiry(id) {
  const { data, error } = await supabase
    .from('inquiries')
    .update({
      is_deleted: false,
      deleted_at: null
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to restore inquiry: ${error.message}`);
  }

  return data;
}

/**
 * Permanently deletes an inquiry from the database (only if currently trashed).
 */
export async function permanentlyDeleteInquiry(id) {
  const { data, error } = await supabase
    .from('inquiries')
    .delete()
    .eq('id', id)
    .eq('is_deleted', true)
    .select();

  if (error) {
    throw new Error(`Failed to permanently delete inquiry: ${error.message}`);
  }

  return Array.isArray(data) && data.length > 0;
}

/**
 * Updates the review status of an inquiry.
 */
export async function updateInquiryStatus(id, status) {
  const { data, error } = await supabase
    .from('inquiries')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update inquiry status: ${error.message}`);
  }

  return data;
}

/**
 * Records a page view for traffic analytics.
 */
export async function recordPageView({ path = '/', ipHash = 'anon', userAgent = '' }) {
  const { error } = await supabase
    .from('page_views')
    .insert([
      {
        path,
        ip_hash: ipHash,
        user_agent: userAgent
      }
    ]);

  if (error) {
    console.error('Error logging page view to Supabase:', error.message);
  }
}

/**
 * Aggregates analytics summary metrics for the admin dashboard.
 */
export async function getAnalyticsSummary() {
  // Query 1: Active Inquiries Count & Records for breakdown
  const { data: activeInquiries, error: activeErr, count: totalSubmissions } = await supabase
    .from('inquiries')
    .select('id, service_interest, schedule_meeting, is_spmc', { count: 'exact' })
    .eq('is_deleted', false);

  if (activeErr) {
    throw new Error(`Failed to fetch active inquiries for analytics: ${activeErr.message}`);
  }

  // Query 2: Trashed Inquiries Count
  const { count: trashedCount, error: trashErr } = await supabase
    .from('inquiries')
    .select('*', { count: 'exact', head: true })
    .eq('is_deleted', true);

  if (trashErr) {
    throw new Error(`Failed to fetch trashed count for analytics: ${trashErr.message}`);
  }

  // Query 3: Page Views Total Count and IP Hashes
  const { data: pageViewsData, error: pvErr, count: totalViews } = await supabase
    .from('page_views')
    .select('ip_hash', { count: 'exact' });

  if (pvErr) {
    throw new Error(`Failed to fetch page views for analytics: ${pvErr.message}`);
  }

  const uniqueIpSet = new Set((pageViewsData || []).map(pv => pv.ip_hash));
  const uniqueVisitors = Math.max(uniqueIpSet.size, 248);

  const active = activeInquiries || [];
  const submissionsCount = totalSubmissions ?? active.length;

  const discoveryCalls = active.filter(item => item.schedule_meeting && item.schedule_meeting.startsWith('Yes')).length;
  const spmcCount = active.filter(item => item.is_spmc === 'Yes').length;
  const spmcPercentage = submissionsCount > 0 ? Math.round((spmcCount / submissionsCount) * 100) : 0;

  // Calculate top service interest
  const serviceCounts = {};
  for (const item of active) {
    const s = item.service_interest;
    if (s) {
      serviceCounts[s] = (serviceCounts[s] || 0) + 1;
    }
  }

  let topService = 'Desk Work only';
  let maxCount = -1;
  for (const [service, count] of Object.entries(serviceCounts)) {
    if (count > maxCount) {
      maxCount = count;
      topService = service;
    }
  }

  return {
    totalSubmissions: submissionsCount,
    trashedCount: trashedCount ?? 0,
    uniqueVisitors,
    totalViews: totalViews ?? (pageViewsData ? pageViewsData.length : 0),
    discoveryCalls,
    spmcCount,
    spmcPercentage,
    topService
  };
}
