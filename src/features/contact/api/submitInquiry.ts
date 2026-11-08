import type { InquiryFormData, InquiryResponse } from '../types';

/**
 * Submits an allied health clinic inquiry to the backend API.
 */
export async function submitInquiry(formData: InquiryFormData): Promise<InquiryResponse> {
  const response = await fetch('/api/inquiries', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to submit inquiry. Please try again.');
  }

  return data as InquiryResponse;
}
