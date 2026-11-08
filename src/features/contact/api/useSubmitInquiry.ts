import { useState, useCallback } from 'react';
import { type InquiryInput, validateInquiryPayload } from '../schemas/inquirySchema';
import type { InquiryRecord, InquiryResponse } from '../types';
import { getFirebaseInstance, isFirebaseProduction } from '../../../services/firebase';

export interface SubmitInquiryError {
  message: string;
  fieldErrors?: Record<string, string>;
  status?: number;
}

export interface UseSubmitInquiryReturn {
  submitInquiry: (payload: unknown) => Promise<InquiryRecord | null>;
  reset: () => void;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: string | null;
  errorDetails: SubmitInquiryError | null;
  submittedInquiry: InquiryRecord | null;
}

/**
 * Mutation hook for submitting consultation inquiries to POST /api/inquiries.
 * Enforces client-side Zod validation with Anti-PHI guards before dispatch,
 * manages loading state, captures typed error states, and stores the submittedInquiry record.
 */
export function useSubmitInquiry(): UseSubmitInquiryReturn {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<SubmitInquiryError | null>(null);
  const [submittedInquiry, setSubmittedInquiry] = useState<InquiryRecord | null>(null);

  const reset = useCallback(() => {
    setIsLoading(false);
    setIsSuccess(false);
    setIsError(false);
    setError(null);
    setErrorDetails(null);
    setSubmittedInquiry(null);
  }, []);

  const submitInquiry = useCallback(
    async (payload: unknown): Promise<InquiryRecord | null> => {
      setIsLoading(true);
      setIsSuccess(false);
      setIsError(false);
      setError(null);
      setErrorDetails(null);

      // 1. Client-Side Pre-flight Validation with InquirySchema (including anti-PHI)
      const validation = validateInquiryPayload(payload);
      if (!validation.success) {
        const errorMsg = validation.firstError || 'Please check your inputs and try again.';
        const details: SubmitInquiryError = {
          message: errorMsg,
          fieldErrors: validation.errors,
          status: 400
        };
        setIsLoading(false);
        setIsError(true);
        setError(errorMsg);
        setErrorDetails(details);
        return null;
      }

      const validData: InquiryInput = validation.data!;

      // 2. Production Mode: Write directly to Cloud Firestore collection 'inquiries' via dynamically loaded Firebase
      if (isFirebaseProduction) {
        try {
          const [firebaseInstance, { collection, addDoc, serverTimestamp }] = await Promise.all([
            getFirebaseInstance(),
            import('firebase/firestore')
          ]);

          if (firebaseInstance?.firestoreDb) {
            const docRef = await addDoc(collection(firebaseInstance.firestoreDb, 'inquiries'), {
              name: validData.name.trim(),
              email: validData.email.trim(),
              is_spmc: validData.isSPMC,
              service_interest: validData.serviceInterest,
              schedule_meeting: validData.scheduleMeeting,
              status: 'Pending Review',
              is_deleted: false,
              created_at: serverTimestamp(),
              created_at_iso: new Date().toISOString()
            });

            const inquiryResult: InquiryRecord = {
              id: docRef.id,
              name: validData.name.trim(),
              email: validData.email.trim(),
              is_spmc: validData.isSPMC,
              service_interest: validData.serviceInterest,
              schedule_meeting: validData.scheduleMeeting,
              status: 'Pending Review',
              created_at: new Date().toISOString()
            };

            setIsLoading(false);
            setIsSuccess(true);
            setIsError(false);
            setError(null);
            setErrorDetails(null);
            setSubmittedInquiry(inquiryResult);
            return inquiryResult;
          }
        } catch (firestoreErr: unknown) {
          console.warn('[Firestore] Direct write failed, attempting API fallback:', firestoreErr);
        }
      }

      // 3. Demo / Vercel Mode: Dispatch to Backend POST /api/inquiries
      try {
        const response = await fetch('/api/inquiries', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify(validData)
        });

        let data: InquiryResponse;
        try {
          data = await response.json();
        } catch {
          data = {
            success: false,
            error: `Server responded with status ${response.status} (${response.statusText})`
          };
        }

        if (!response.ok || !data.success) {
          const serverError = data.error || 'Failed to submit consultation inquiry.';
          const details: SubmitInquiryError = {
            message: serverError,
            status: response.status
          };
          setIsLoading(false);
          setIsError(true);
          setError(serverError);
          setErrorDetails(details);
          return null;
        }

        const inquiryResult = data.inquiry || (validData as unknown as InquiryRecord);
        setIsLoading(false);
        setIsSuccess(true);
        setIsError(false);
        setError(null);
        setErrorDetails(null);
        setSubmittedInquiry(inquiryResult);
        return inquiryResult;
      } catch (networkErr: unknown) {
        const networkMessage =
          networkErr instanceof Error
            ? networkErr.message
            : 'Unable to connect to practice API server. Please check your network connection.';
        const details: SubmitInquiryError = {
          message: networkMessage,
          status: 0
        };
        setIsLoading(false);
        setIsError(true);
        setError(networkMessage);
        setErrorDetails(details);
        return null;
      }
    },
    []
  );

  return {
    submitInquiry,
    reset,
    isLoading,
    isSuccess,
    isError,
    error,
    errorDetails,
    submittedInquiry
  };
}
