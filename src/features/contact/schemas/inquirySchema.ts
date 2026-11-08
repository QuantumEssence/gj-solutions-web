import { z } from 'zod';

export const SPMC_OPTIONS = ['Yes', 'No'] as const;
export type SPMCOption = (typeof SPMC_OPTIONS)[number];

export const SERVICE_INTEREST_OPTIONS = [
  'Desk Work only',
  'Desk Work + Data gathering',
  'Report preparation only',
  'Contract Review',
  'All Three'
] as const;
export type { ServiceInterestOption } from '../types';


/**
 * Strict Data Privacy Restriction (Anti-PHI Filter):
 * Enforces zero-tolerance for Australian Medicare numbers, ICD-10 diagnostic codes,
 * Medical Record Numbers (MRN/URN), and prohibited clinical health records.
 */
export function detectPHI(text: string): { hasPHI: boolean; reason?: string } {
  if (!text || typeof text !== 'string') return { hasPHI: false };
  const clean = text.trim();
  if (!clean) return { hasPHI: false };

  // 1. Prohibited clinical health records and terminology keywords
  const PHI_KEYWORDS = [
    'patient',
    'diagnosis',
    'medical record',
    'prescription',
    'medication',
    'phi',
    'pathology',
    'radiology',
    'treatment note',
    'clinical note',
    'soap note',
    'prognosis',
    'pbs script',
    'blood pressure'
  ];
  const lower = clean.toLowerCase();
  for (const kw of PHI_KEYWORDS) {
    const kwRegex = new RegExp(`\\b${kw}s?\\b`, 'i');
    if (kwRegex.test(lower)) {
      return { hasPHI: true, reason: `Contains prohibited clinical term: "${kw}"` };
    }
  }

  // 2. Australian Medicare number patterns (10 digits starting with 2-6, with or without spaces)
  const MEDICARE_NUMBER_REGEX = /\b[2-6]\d{3}\s?\d{5}\s?\d\b/;
  const MEDICARE_EXPLICIT_REGEX = /\bmedicare\s*(?:no|num|number|card|#)?\s*[:#]?\s*\d+/i;
  if (MEDICARE_NUMBER_REGEX.test(clean) || MEDICARE_EXPLICIT_REGEX.test(clean)) {
    return { hasPHI: true, reason: 'Detected potential Medicare number pattern' };
  }

  // 3. Medical Record Numbers (MRN / URN / Chart #)
  const MRN_REGEX = /\b(?:mrn|urn|patient\s*id|chart\s*(?:no|num|number)|record\s*(?:no|num|number))\s*[:#]?\s*[a-z0-9-]+\b/i;
  if (MRN_REGEX.test(clean)) {
    return { hasPHI: true, reason: 'Detected Medical Record Number (MRN/URN) pattern' };
  }

  // 4. Explicit ICD-10 references
  const ICD10_EXPLICIT_REGEX = /\bicd-?10(?:-?cm)?\s*[:#]?\s*[a-tv-z0-9.]+/i;
  if (ICD10_EXPLICIT_REGEX.test(clean)) {
    return { hasPHI: true, reason: 'Detected explicit ICD-10 code reference' };
  }

  // 5. Standard ICD-10 diagnostic codes: Letter (A-T, V-Z) followed by 2 digits, optionally '.' and 1-4 chars (e.g. M54.5, E11.9, I10)
  const ICD10_CODE_REGEX = /\b[A-TV-Z][0-9]{2}(\.[0-9A-Z]{1,4})?\b/;
  if (ICD10_CODE_REGEX.test(clean)) {
    return { hasPHI: true, reason: 'Detected ICD-10 diagnostic code format' };
  }

  return { hasPHI: false };
}

export const PHI_REJECTION_MESSAGE =
  'Strict Data Privacy Restriction: Inquiries must not contain patient health information (PHI), Medicare numbers, ICD-10 codes, or medical records.';

/**
 * Zod validation schema for Contact Questionnaire submissions.
 * Meets all deliverable specifications:
 * - name: string, min 2 chars, max 100 chars
 * - email: valid email string
 * - isSPMC: enum ['Yes', 'No']
 * - serviceInterest: enum ['Desk Work only', 'Desk Work + Data gathering', 'Report preparation only', 'Contract Review', 'All Three']
 * - scheduleMeeting: string or enum ['Yes', 'No'] (or appointment slot string)
 * - Anti-PHI superRefine guard across all input fields
 */
export const SCHEDULE_MEETING_OPTIONS = ['Yes', 'No'] as const;
export type ScheduleMeetingOption = (typeof SCHEDULE_MEETING_OPTIONS)[number];

export const InquirySchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name cannot exceed 100 characters'),
    email: z
      .string()
      .trim()
      .email('Please provide a valid clinic email address'),
    isSPMC: z.enum(SPMC_OPTIONS),
    serviceInterest: z.enum(SERVICE_INTEREST_OPTIONS),
    scheduleMeeting: z.union([
      z.enum(SCHEDULE_MEETING_OPTIONS),
      z.string().trim().min(1, 'Meeting preference or consultation slot is required')
    ])
  })
  .superRefine((data, ctx) => {
    const fieldsToCheck: Array<{ key: keyof typeof data; value: string }> = [
      { key: 'name', value: data.name },
      { key: 'email', value: data.email },
      { key: 'serviceInterest', value: data.serviceInterest },
      { key: 'scheduleMeeting', value: data.scheduleMeeting }
    ];

    for (const { key, value } of fieldsToCheck) {
      const phiResult = detectPHI(value);
      if (phiResult.hasPHI) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [key],
          message: PHI_REJECTION_MESSAGE
        });
      }
    }
  });

export type InquiryInput = z.infer<typeof InquirySchema>;

/**
 * Helper to validate inquiry data with Zod and return structured field errors.
 */
export function validateInquiryPayload(payload: unknown): {
  success: boolean;
  data?: InquiryInput;
  errors?: Record<string, string>;
  firstError?: string;
} {
  const result = InquirySchema.safeParse(payload);
  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] ? String(issue.path[0]) : 'general';
    if (!errors[field]) {
      errors[field] = issue.message;
    }
  }

  return {
    success: false,
    errors,
    firstError: result.error.issues[0]?.message || 'Validation failed.'
  };
}
