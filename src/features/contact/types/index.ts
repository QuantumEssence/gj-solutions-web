export type ServiceInterestOption =
  | 'Desk Work only'
  | 'Desk Work + Data gathering'
  | 'Report preparation only'
  | 'Contract Review'
  | 'All Three'
  | string;

export interface InquiryFormData {
  name: string;
  email: string;
  isSPMC: string;
  serviceInterest: ServiceInterestOption;
  scheduleMeeting: string;
}

export interface InquirySubmissionPayload extends InquiryFormData {
  timestamp?: number;
}

export interface InquiryRecord {
  id?: string | number;
  name: string;
  email: string;
  is_spmc?: string;
  service_interest?: string;
  schedule_meeting?: string;
  created_at?: string;
  status?: string;
}

export interface InquiryResponse {
  success: boolean;
  message?: string;
  inquiry?: InquiryRecord;
  error?: string;
}

export interface WeekdayOption {
  dateStr: string;
  label: string;
  weekday: string;
}

export interface ContactFormErrors {
  name?: string;
  email?: string;
  serviceInterest?: string;
  isSPMC?: string;
  scheduleMeeting?: string;
}
