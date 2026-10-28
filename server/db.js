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
  const fallbackVisitors = process.env.ANALYTICS_FALLBACK_VISITORS ? Number(process.env.ANALYTICS_FALLBACK_VISITORS) : 0;
  const uniqueVisitors = uniqueIpSet.size > 0 ? uniqueIpSet.size : fallbackVisitors;

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

/**
 * Settings & Cleaning Modes for Admin Dashboard
 */
export async function trashAllActiveInquiries() {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('inquiries')
    .update({ is_deleted: true, deleted_at: now })
    .eq('is_deleted', false)
    .select();

  if (error) throw new Error(error.message);
  return data || [];
}

export async function purgeAllTrashedInquiries() {
  const { data, error } = await supabase
    .from('inquiries')
    .delete()
    .eq('is_deleted', true)
    .select();

  if (error) throw new Error(error.message);
  return (data || []).length;
}

export async function resetAllInquiries() {
  const { error } = await supabase
    .from('inquiries')
    .delete()
    .neq('id', 0);

  if (error) throw new Error(error.message);
  return true;
}

export async function resetPageViews() {
  const { error } = await supabase
    .from('page_views')
    .delete()
    .neq('id', 0);

  if (error) throw new Error(error.message);
  return true;
}

export async function seedBetaInquiries() {
  const now = new Date().toISOString();
  const betaItems = [
    {
      name: 'Dr. Lachlan Murphy',
      email: 'lachlan@melbournephysio.au',
      is_spmc: 'Yes',
      service_interest: 'Desk Work only',
      schedule_meeting: 'Yes (Mon 3:00 PM AEST)',
      status: 'Pending Review',
      is_deleted: false,
      created_at: now
    },
    {
      name: 'Sarah Jennings, APAM',
      email: 'sarah@brisbanerehab.com.au',
      is_spmc: 'No',
      service_interest: 'Desk Work + Data gathering',
      schedule_meeting: 'Yes (Tue 4:00 PM AEST)',
      status: 'Meeting Scheduled',
      is_deleted: false,
      created_at: now
    },
    {
      name: 'Mark Henderson',
      email: 'mark@sydneycoastal.com.au',
      is_spmc: 'Yes',
      service_interest: 'Contract Review',
      schedule_meeting: 'No',
      status: 'Replied via Email',
      is_deleted: false,
      created_at: now
    }
  ];

  const { data, error } = await supabase
    .from('inquiries')
    .insert(betaItems)
    .select();

  if (error) throw new Error(error.message);
  return data || [];
}

/**
 * Baseline default site content representing active Australian clinic support copy.
 */
export const DEFAULT_SITE_CONTENT = {
  hero_title: 'Specialized Administrative Support for Sports & Musculoskeletal Practitioners',
  hero_subtitle: 'Empowering Allied Health Clinicians Across Australia',
  hero_description: 'Dedicated practice management, document formatting, and desk workflows tailored for busy musculoskeletal and sports medicine clinics in Victoria, New South Wales, and Queensland.',
  mission_title: 'Our Clinical Support Mission',
  mission_body_1: 'We relieve healthcare practitioners from administrative burdens so they can focus on patient care and clinical excellence.',
  mission_body_2: 'In full compliance with Australian Privacy Principles (APPs), our team provides secure, reliable practice coordination without handling confidential medical records.',
  faqs: [
    {
      q: 'Do you handle direct patient health records (PHI)?',
      a: 'No. G&J Solutions operates in strict adherence with Australian Privacy Principles (APPs) and our Memorandum of Agreement (MOA). We never collect, store, or process confidential patient diagnoses, prescriptions, or clinical medical records.'
    },
    {
      q: 'What clinical workflows do you assist with?',
      a: 'We specialize in desk work, practitioner scheduling, report template formatting, meeting coordination, and administrative data preparation.'
    },
    {
      q: 'Are your services available across Australia?',
      a: 'Yes, our team supports clinics across Victoria, New South Wales, and Queensland operating on AEST/AEDT timezones.'
    }
  ],
  testimonials: [
    {
      quote: 'G&J Solutions streamlined our practitioner desk work and report formatting, saving our clinic over 15 hours each week.',
      name: 'Dr. Lachlan Murphy',
      role: 'Principal Physiotherapist, Melbourne'
    },
    {
      quote: 'Their compliance with Australian privacy standards and rapid turnaround gives our practice total peace of mind.',
      name: 'Sarah Jennings, APAM',
      role: 'Clinical Director, Brisbane'
    }
  ]
};

let runtimeSiteContent = null;

/**
 * Retrieves dynamic site content by key (defaults to 'homepage').
 * Returns the stored JSONB or static fallback object if not yet seeded.
 */
export async function getSiteContent(id = 'homepage') {
  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('content, updated_at')
      .eq('id', id)
      .maybeSingle();

    if (error || !data || !data.content) {
      return runtimeSiteContent || DEFAULT_SITE_CONTENT;
    }

    return data.content;
  } catch (err) {
    console.warn(`[getSiteContent] Warning: could not query site_content (${err.message}). Using fallback defaults.`);
    return runtimeSiteContent || DEFAULT_SITE_CONTENT;
  }
}

/**
 * Upserts dynamic site content by key (defaults to 'homepage').
 */
export async function updateSiteContent(id = 'homepage', content) {
  if (!content || typeof content !== 'object' || Array.isArray(content)) {
    throw new Error('Invalid content payload. Expected a valid JSON object.');
  }

  runtimeSiteContent = {
    ...(runtimeSiteContent || DEFAULT_SITE_CONTENT),
    ...content
  };

  const now = new Date().toISOString();
  try {
    const { data, error } = await supabase
      .from('site_content')
      .upsert({
        id,
        content: runtimeSiteContent,
        updated_at: now
      }, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.warn(`[updateSiteContent] Supabase persistence notice: ${error.message}. Active in runtime cache.`);
      return runtimeSiteContent;
    }

    return data?.content || runtimeSiteContent;
  } catch (err) {
    console.warn(`[updateSiteContent] Supabase persistence exception: ${err.message}. Active in runtime cache.`);
    return runtimeSiteContent;
  }
}


