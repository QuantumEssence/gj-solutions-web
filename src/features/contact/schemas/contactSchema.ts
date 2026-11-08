import type { InquiryFormData, ContactFormErrors, WeekdayOption } from '../types';

export const VALID_SERVICE_OPTIONS = [
  'Desk Work only',
  'Desk Work + Data gathering',
  'Report preparation only',
  'Contract Review',
  'All Three'
] as const;

export const TIME_SLOTS: readonly string[] = [
  '3:00 PM – 4:00 PM AEST',
  '4:00 PM – 5:00 PM AEST',
  '5:00 PM – 6:00 PM AEST'
];

/**
 * Normalizes query string parameter into a valid service option.
 */
export function normalizeServiceParam(param: string | null): string {
  if (!param) return '';
  const clean = decodeURIComponent(param).trim().toLowerCase();

  if (clean.includes('all') || clean.includes('three')) {
    return 'All Three';
  }
  if (clean.includes('contract')) {
    return 'Contract Review';
  }
  if (clean.includes('gather') || (clean.includes('desk') && clean.includes('report'))) {
    return 'Desk Work + Data gathering';
  }
  if (clean.includes('report')) {
    return 'Report preparation only';
  }
  if (clean.includes('frontdesk') || clean.includes('desk')) {
    return 'Desk Work only';
  }

  const found = VALID_SERVICE_OPTIONS.find(opt => opt.toLowerCase() === clean);
  return found || '';
}

/**
 * Generates available weekdays (Mon-Fri) for Australian booking.
 */
export function getAvailableWeekdays(count = 5): WeekdayOption[] {
  const dates: WeekdayOption[] = [];
  const curr = new Date();

  let offset = 1;
  while (dates.length < count) {
    const d = new Date(curr);
    d.setDate(curr.getDate() + offset);
    const dayOfWeek = d.getDay();
    // 0 = Sunday, 6 = Saturday
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      const weekday = d.toLocaleDateString('en-AU', { weekday: 'short' });
      const label = d.toLocaleDateString('en-AU', { month: 'short', day: 'numeric' });
      dates.push({ dateStr, label, weekday });
    }
    offset++;
  }

  return dates;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates inquiry form data.
 */
export function validateContactForm(formData: InquiryFormData): {
  isValid: boolean;
  errors: ContactFormErrors;
} {
  const errors: ContactFormErrors = {};

  if (!formData.name || formData.name.trim().length < 2) {
    errors.name = 'Please provide your full name (minimum 2 characters).';
  }

  if (!formData.email || !EMAIL_REGEX.test(formData.email.trim())) {
    errors.email = 'Please provide a valid clinic email address.';
  }

  if (formData.scheduleMeeting.startsWith('Yes') && !formData.scheduleMeeting.includes('AEST')) {
    errors.scheduleMeeting = 'Please select a valid consultation time slot.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
