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
  faqs: FAQItem[];
  testimonials: TestimonialItem[];
}

export type WebsiteContent = SiteContent;
