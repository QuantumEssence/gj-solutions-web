export interface Inquiry {
  id: number;
  name: string;
  email: string;
  is_spmc: string;
  service_interest: string;
  schedule_meeting: string;
  status: string;
  is_deleted?: number | boolean;
  deleted_at?: string | null;
  created_at: string;
}

export const MOCK_INQUIRIES: Inquiry[] = [
  {
    id: 1,
    name: 'Dr. Sarah Jenkins',
    email: 'sarah@exampleclinic.com',
    is_spmc: 'Yes',
    service_interest: 'Report preparation only',
    schedule_meeting: 'Yes',
    status: 'Pending Review',
    is_deleted: false,
    created_at: '2026-10-05 10:30:00'
  },
  {
    id: 2,
    name: 'Mark Thompson',
    email: 'mark.t@physioworks.au',
    is_spmc: 'No',
    service_interest: 'Desk Work + Data gathering',
    schedule_meeting: 'Yes',
    status: 'Meeting Scheduled',
    is_deleted: false,
    created_at: '2026-10-04 14:15:00'
  },
  {
    id: 3,
    name: 'Emma Davis',
    email: 'emma@mindfulpsych.com',
    is_spmc: 'Yes',
    service_interest: 'Desk Work only',
    schedule_meeting: 'No',
    status: 'Replied via Email',
    is_deleted: false,
    created_at: '2026-10-02 09:00:00'
  }
];

export interface AnalyticsSummary {
  totalSubmissions: number;
  trashedCount?: number;
  uniqueVisitors: number;
  totalViews: number;
  discoveryCalls: number;
  spmcCount: number;
  spmcPercentage: number;
  topService: string;
}

export const MOCK_ANALYTICS_SUMMARY: AnalyticsSummary = {
  totalSubmissions: 12,
  trashedCount: 0,
  uniqueVisitors: 248,
  totalViews: 412,
  discoveryCalls: 3,
  spmcCount: 8,
  spmcPercentage: 66,
  topService: 'Report Preparation'
};

export interface NotificationLog {
  id: number;
  timestamp: string;
  recipient: string;
  status: string;
  subject: string;
}

export interface FilterState {
  search: string;
  status: string;
  spmc: string;
  dateRange: string;
  referenceTimestamp?: number;
}

export interface FAQItem {
  id?: string | number;
  q?: string;
  a?: string;
  question?: string;
  answer?: string;
}

export interface TestimonialItem {
  id?: string | number;
  quote: string;
  name?: string;
  author?: string;
  role: string;
  clinic?: string;
}

export interface SiteContent {
  hero_title: string;
  hero_subtitle: string;
  hero_description: string;
  mission_title: string;
  mission_body_1: string;
  mission_body_2: string;
  out_of_scope_title?: string;
  out_of_scope_description?: string;
  out_of_scope_items?: string[];
  faqs: FAQItem[];
  testimonials: TestimonialItem[];
}

export type WebsiteContent = SiteContent;
