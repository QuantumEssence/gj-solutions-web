import { useState, useId, type ChangeEvent, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { useSubmitInquiry } from '../api';
import type { InquiryRecord } from '../types';
import './ContactForm.css';

const normalizeServiceParam = (param: string | null): string => {
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

  const validOptions = [
    'Desk Work only',
    'Desk Work + Data gathering',
    'Report preparation only',
    'Contract Review',
    'All Three'
  ];
  const found = validOptions.find(opt => opt.toLowerCase() === clean);
  return found || '';
};

export interface ContactFormProps {
  onSuccess?: (inquiry: InquiryRecord) => void;
}

export const ContactForm = ({ onSuccess }: ContactFormProps) => {
  const [searchParams] = useSearchParams();
  const serviceFromQuery = searchParams.get('service');
  const normalizedParam = normalizeServiceParam(serviceFromQuery);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    isSPMC: '',
    serviceInterest: normalizedParam,
    scheduleMeeting: ''
  });

  const {
    submitInquiry,
    reset: resetInquiry,
    isLoading,
    isSuccess,
    isError,
    error: submitError,
    submittedInquiry
  } = useSubmitInquiry();

  const nameInputId = useId();
  const emailInputId = useId();
  const serviceSelectId = useId();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      isSPMC: formData.isSPMC as 'Yes' | 'No',
      serviceInterest: formData.serviceInterest as
        | 'Desk Work only'
        | 'Desk Work + Data gathering'
        | 'Report preparation only'
        | 'Contract Review'
        | 'All Three',
      scheduleMeeting: formData.scheduleMeeting || 'No'
    };

    const result = await submitInquiry(payload);
    if (result) {
      if (onSuccess) {
        onSuccess(result);
      }
      setFormData({
        name: '',
        email: '',
        isSPMC: '',
        serviceInterest: '',
        scheduleMeeting: ''
      });
    }
  };

  const handleReset = () => {
    resetInquiry();
    setFormData({
      name: '',
      email: '',
      isSPMC: '',
      serviceInterest: normalizeServiceParam(serviceFromQuery),
      scheduleMeeting: ''
    });
  };

  if (isSuccess) {
    return (
      <div className="contact-form-container card text-center fade-in" style={{ padding: '3.5rem 2.5rem' }}>
        <div style={{ display: 'inline-flex', padding: '1.25rem', borderRadius: '50%', backgroundColor: '#dcfce7', color: '#166534', marginBottom: '1.5rem' }}>
          <CheckCircle size={52} />
        </div>
        <h2 style={{ color: '#2A7B7E', marginBottom: '1rem', fontSize: '1.75rem', fontWeight: 700 }}>
          Inquiry Submitted Successfully
        </h2>
        <p style={{ color: '#334155', maxWidth: '540px', margin: '0 auto 1.5rem auto', fontSize: '1.05rem', lineHeight: '1.6' }}>
          Thank you, <strong>{submittedInquiry?.name}</strong>. Your inquiry has been received. Our team will review your requirements and be in touch promptly.
        </p>
        <button onClick={handleReset} className="contact-submit-btn" style={{ margin: '0 auto' }}>
          Submit Another Inquiry
        </button>
      </div>
    );
  }

  return (
    <div className="contact-form-container">
      {isError && (
        <div className="contact-error-banner mb-4">
          <AlertTriangle size={20} style={{ flexShrink: 0, color: '#dc2626' }} />
          <span>{submitError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="contact-form-card">
        {/* 1. Name */}
        <div className="form-group">
          <label htmlFor={nameInputId} className="form-label">
            Name
          </label>
          <input
            id={nameInputId}
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        {/* 2. Email */}
        <div className="form-group">
          <label htmlFor={emailInputId} className="form-label">
            Email
          </label>
          <input
            id={emailInputId}
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        {/* 3. Are you a part of SPMC? */}
        <div className="form-group">
          <label className="form-label">
            Are you a part of SPMC? (Sydney Pain Management Centre)
          </label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="isSPMC"
                value="Yes"
                checked={formData.isSPMC === 'Yes'}
                onChange={handleChange}
                required
                className="radio-input"
              />
              <span>Yes</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="isSPMC"
                value="No"
                checked={formData.isSPMC === 'No'}
                onChange={handleChange}
                className="radio-input"
              />
              <span>No</span>
            </label>
          </div>
        </div>

        {/* 4. Which Services are you interested in? */}
        <div className="form-group">
          <label htmlFor={serviceSelectId} className="form-label">
            Which Services are you interested in?
          </label>
          <select
            id={serviceSelectId}
            name="serviceInterest"
            required
            value={formData.serviceInterest}
            onChange={handleChange}
            className="form-select"
          >
            <option value="" disabled>Select an option...</option>
            <option value="Desk Work only">Desk Work only</option>
            <option value="Desk Work + Data gathering">Desk Work + Data gathering</option>
            <option value="Report preparation only">Report preparation only</option>
            <option value="Contract Review">Contract Review (Plain-Language Risk Read)</option>
            <option value="All Three">All Three</option>
          </select>
        </div>

        {/* 5. Would you like to schedule a meeting? */}
        <div className="form-group">
          <label className="form-label">
            Would you like to schedule a meeting to further discuss your needs?
          </label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="scheduleMeeting"
                value="Yes"
                checked={formData.scheduleMeeting === 'Yes'}
                onChange={handleChange}
                required
                className="radio-input"
              />
              <span>Yes</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="scheduleMeeting"
                value="No"
                checked={formData.scheduleMeeting === 'No'}
                onChange={handleChange}
                className="radio-input"
              />
              <span>No</span>
            </label>
          </div>
        </div>

        {/* 6. Submit Button */}
        <div className="form-actions">
          <button
            type="submit"
            className="contact-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
                Submitting...
              </>
            ) : (
              'Submit Inquiry'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
