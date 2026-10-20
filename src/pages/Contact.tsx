import { useState, useId, type ChangeEvent, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AlertTriangle, CheckCircle, Send, Loader2, Calendar, Clock, Globe } from 'lucide-react';

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

// Generate available weekdays (Mon-Fri) for Australian booking
const getAvailableWeekdays = (count = 5): Array<{ dateStr: string; label: string; weekday: string }> => {
  const dates: Array<{ dateStr: string; label: string; weekday: string }> = [];
  const curr = new Date();

  // Look forward starting from tomorrow (or next business day)
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
};

const TIME_SLOTS = [
  '3:00 PM – 4:00 PM AEST',
  '4:00 PM – 5:00 PM AEST',
  '5:00 PM – 6:00 PM AEST'
];

const Contact = () => {
  const [searchParams] = useSearchParams();
  const serviceFromQuery = searchParams.get('service');
  const normalizedParam = normalizeServiceParam(serviceFromQuery);

  const availableDays = getAvailableWeekdays(5);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    isSPMC: '',
    serviceInterest: normalizedParam,
    scheduleMeeting: ''
  });

  // Calendar slot selector states
  const [selectedDate, setSelectedDate] = useState<string>(availableDays[0]?.dateStr || '');
  const [selectedSlot, setSelectedSlot] = useState<string>(TIME_SLOTS[0]);

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedInquiry, setSubmittedInquiry] = useState<{ id?: number; name?: string; schedule_meeting?: string } | null>(null);

  const [prevQuery, setPrevQuery] = useState(serviceFromQuery);

  const nameInputId = useId();
  const emailInputId = useId();
  const serviceSelectId = useId();

  if (serviceFromQuery !== prevQuery) {
    setPrevQuery(serviceFromQuery);
    const matched = normalizeServiceParam(serviceFromQuery);
    if (matched) {
      setFormData(prev => ({ ...prev, serviceInterest: matched }));
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMeetingChoiceChange = (choice: 'Yes' | 'No') => {
    if (choice === 'Yes') {
      const formattedMeeting = `Yes (${selectedDate} ${selectedSlot})`;
      setFormData(prev => ({ ...prev, scheduleMeeting: formattedMeeting }));
    } else {
      setFormData(prev => ({ ...prev, scheduleMeeting: 'No' }));
    }
  };

  const handleDateSelect = (dateStr: string) => {
    setSelectedDate(dateStr);
    if (formData.scheduleMeeting.startsWith('Yes')) {
      setFormData(prev => ({ ...prev, scheduleMeeting: `Yes (${dateStr} ${selectedSlot})` }));
    }
  };

  const handleSlotSelect = (slot: string) => {
    setSelectedSlot(slot);
    if (formData.scheduleMeeting.startsWith('Yes')) {
      setFormData(prev => ({ ...prev, scheduleMeeting: `Yes (${selectedDate} ${slot})` }));
    }
  };

  const isMeetingSelected = formData.scheduleMeeting.startsWith('Yes');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    // Ensure scheduleMeeting captures the selected slot if 'Yes' was chosen
    const payload = {
      ...formData,
      scheduleMeeting: isMeetingSelected
        ? `Yes (${selectedDate} ${selectedSlot})`
        : (formData.scheduleMeeting || 'No')
    };

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit inquiry. Please try again.');
      }

      setSubmittedInquiry(data.inquiry);
      setStatus('success');
      setFormData({
        name: '',
        email: '',
        isSPMC: '',
        serviceInterest: '',
        scheduleMeeting: ''
      });
    } catch (err: unknown) {
      setStatus('error');
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setSubmittedInquiry(null);
    setErrorMessage('');
    setFormData({
      name: '',
      email: '',
      isSPMC: '',
      serviceInterest: normalizeServiceParam(serviceFromQuery),
      scheduleMeeting: ''
    });
  };

  // Pre-selection badge condition: only shows if current formData.serviceInterest exactly matches normalizedParam and query param is present
  const showPreselectBadge = Boolean(
    normalizedParam &&
    formData.serviceInterest === normalizedParam
  );

  return (
    <div className="contact-page fade-in">
      <div className="section-header text-center mb-4">
        <h1 className="section-title" style={{ fontSize: '2.25rem', marginBottom: '0.75rem' }}>Practice Consultation Request</h1>
        <p className="section-subtitle" style={{ maxWidth: '640px', margin: '0 auto', fontSize: '1.125rem', lineHeight: '1.6', color: '#f1f5f9' }}>
          Complete the practice assessment below to help us tailor an operational support structure for your clinic.
        </p>
      </div>

      <div
        className="compliance-banner mb-4"
        style={{
          backgroundColor: '#fef2f2',
          border: '1.5px solid #b91c1c',
          padding: '1.125rem 1.5rem',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '1rem',
          color: '#991b1b',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}
      >
        <AlertTriangle size={24} style={{ flexShrink: 0, marginTop: '2px', color: '#b91c1c' }} />
        <div>
          <strong style={{ display: 'block', marginBottom: '0.35rem', fontSize: '1.05rem', color: '#991b1b' }}>
            Confidentiality & Privacy Notice
          </strong>
          <p style={{ margin: 0, fontSize: '1rem', lineHeight: '1.5', color: '#7f1d1d' }}>
            Do not submit protected health information (PHI) or patient records through this form. This channel is reserved strictly for clinic business and operational inquiries.
          </p>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr', gap: '2rem', maxWidth: '720px', margin: '0 auto' }}>
        {status === 'success' ? (
          <div className="card text-center fade-in" style={{ padding: '3.5rem 2.5rem' }}>
            <div style={{ display: 'inline-flex', padding: '1.25rem', borderRadius: '50%', backgroundColor: '#dcfce7', color: '#166534', marginBottom: '1.5rem' }}>
              <CheckCircle size={52} />
            </div>
            <h2 style={{ color: 'var(--color-primary-dark)', marginBottom: '1rem', fontSize: '1.75rem' }}>Inquiry Registered</h2>
            <p style={{ color: 'var(--color-text-main)', maxWidth: '540px', margin: '0 auto 1.5rem auto', fontSize: '1.075rem', lineHeight: '1.6' }}>
              Thank you, <strong>{submittedInquiry?.name}</strong>. Your consultation request has been logged in our secure system (Reference #{submittedInquiry?.id}). 
              Our practice coordinator will review your requirements and follow up via email.
            </p>
            {submittedInquiry?.schedule_meeting && submittedInquiry.schedule_meeting !== 'No' && (
              <div style={{ padding: '1.25rem', backgroundColor: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '8px', marginBottom: '2rem', color: '#166534', fontSize: '1.05rem', lineHeight: '1.5', textAlign: 'left' }}>
                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Requested Consultation Time:</div>
                <div style={{ color: '#14532d' }}>{submittedInquiry.schedule_meeting}</div>
                <div style={{ fontSize: '0.95rem', color: '#15803d', marginTop: '0.5rem' }}>
                  A calendar invitation will be issued to your email address.
                </div>
              </div>
            )}
            <button onClick={handleReset} className="btn btn-primary" style={{ fontSize: '1.05rem', padding: '0.85rem 1.75rem' }}>
              Submit Another Inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card" style={{ padding: '2.5rem' }}>
            {status === 'error' && (
              <div
                className="mb-4"
                style={{
                  backgroundColor: '#fef2f2',
                  border: '1.5px solid #b91c1c',
                  padding: '1.125rem 1.25rem',
                  borderRadius: '8px',
                  color: '#991b1b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  fontSize: '1rem',
                  lineHeight: '1.5'
                }}
              >
                <AlertTriangle size={22} style={{ flexShrink: 0, color: '#b91c1c' }} />
                <span style={{ fontWeight: '500' }}>{errorMessage}</span>
              </div>
            )}

            {/* Name Field */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label
                htmlFor={nameInputId}
                style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '1.075rem', color: 'var(--color-primary-dark)' }}
              >
                Name <span style={{ color: '#b91c1c' }}>*</span>
              </label>
              <input 
                id={nameInputId}
                type="text" 
                name="name" 
                required
                value={formData.name} 
                onChange={handleChange} 
                placeholder="e.g. Dr. Jane Smith"
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  fontSize: '1.05rem',
                  borderRadius: '6px',
                  border: '1.5px solid #cbd5e1',
                  color: '#1e293b',
                  backgroundColor: '#ffffff'
                }}
              />
              <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.925rem', color: '#64748b' }}>
                Please enter your full name or title.
              </p>
            </div>

            {/* Email Field */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label
                htmlFor={emailInputId}
                style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '1.075rem', color: 'var(--color-primary-dark)' }}
              >
                Email <span style={{ color: '#b91c1c' }}>*</span>
              </label>
              <input 
                id={emailInputId}
                type="email" 
                name="email" 
                required
                value={formData.email} 
                onChange={handleChange} 
                placeholder="e.g. jane@sydneyphysio.com.au"
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  fontSize: '1.05rem',
                  borderRadius: '6px',
                  border: '1.5px solid #cbd5e1',
                  color: '#1e293b',
                  backgroundColor: '#ffffff'
                }}
              />
              <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.925rem', color: '#64748b' }}>
                We will send our response and meeting details to this address.
              </p>
            </div>

            {/* SPMC Affiliation */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label style={{ display: 'block', marginBottom: '0.6rem', fontWeight: '600', fontSize: '1.075rem', color: 'var(--color-primary-dark)' }}>
                Are you a part of SPMC? (Sydney Pain Management Centre) <span style={{ color: '#b91c1c' }}>*</span>
              </label>
              <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '1.05rem', cursor: 'pointer', color: '#334155' }}>
                  <input
                    type="radio" 
                    name="isSPMC" 
                    value="Yes" 
                    checked={formData.isSPMC === 'Yes'} 
                    onChange={handleChange} 
                    required 
                    style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--color-primary-dark)' }}
                  />
                  <span>Yes</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '1.05rem', cursor: 'pointer', color: '#334155' }}>
                  <input 
                    type="radio" 
                    name="isSPMC" 
                    value="No" 
                    checked={formData.isSPMC === 'No'} 
                    onChange={handleChange} 
                    style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--color-primary-dark)' }}
                  />
                  <span>No</span>
                </label>
              </div>
            </div>

            {/* Service Interest */}
            <div style={{ marginBottom: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <label
                  htmlFor={serviceSelectId}
                  style={{ fontWeight: '600', fontSize: '1.075rem', color: 'var(--color-primary-dark)', margin: 0 }}
                >
                  Which Services are you interested in? <span style={{ color: '#b91c1c' }}>*</span>
                </label>
                {showPreselectBadge && (
                  <span
                    style={{
                      fontSize: '0.85rem',
                      color: '#065f46',
                      backgroundColor: '#d1fae5',
                      border: '1px solid #a7f3d0',
                      padding: '0.25rem 0.65rem',
                      borderRadius: '4px',
                      fontWeight: '600',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    Pre-selected from Services
                  </span>
                )}
              </div>
              <select 
                id={serviceSelectId}
                name="serviceInterest" 
                required
                value={formData.serviceInterest} 
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  fontSize: '1.05rem',
                  borderRadius: '6px',
                  border: '1.5px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  color: '#1e293b'
                }}
              >
                <option value="" disabled>Select an option...</option>
                <option value="Desk Work only">Frontdesk & Diary Management (Patient calls, scheduling, email)</option>
                <option value="Desk Work + Data gathering">Frontdesk Management + Intake Documentation</option>
                <option value="Report preparation only">Intake Documentation & Reporting Only</option>
                <option value="Contract Review">Operational & Service Agreement Review</option>
                <option value="All Three">Comprehensive Practice Support (All Services)</option>
              </select>
            </div>

            {/* Meeting Question */}
            <div style={{ marginBottom: '1.75rem', paddingBottom: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
              <label style={{ display: 'block', marginBottom: '0.6rem', fontWeight: '600', fontSize: '1.075rem', color: 'var(--color-primary-dark)' }}>
                Would you like to schedule a meeting to further discuss your needs? <span style={{ color: '#b91c1c' }}>*</span>
              </label>
              <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '1.05rem', cursor: 'pointer', color: '#334155' }}>
                  <input 
                    type="radio" 
                    name="meetingRadio" 
                    value="Yes" 
                    checked={isMeetingSelected} 
                    onChange={() => handleMeetingChoiceChange('Yes')} 
                    required 
                    style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--color-primary-dark)' }}
                  />
                  <span>Yes</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '1.05rem', cursor: 'pointer', color: '#334155' }}>
                  <input 
                    type="radio" 
                    name="meetingRadio" 
                    value="No" 
                    checked={formData.scheduleMeeting === 'No'} 
                    onChange={() => handleMeetingChoiceChange('No')} 
                    style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--color-primary-dark)' }}
                  />
                  <span>No</span>
                </label>
              </div>
            </div>

            {/* Interactive AEST Timezone-Aware Calendar Slot Selector */}
            {isMeetingSelected && (
              <div
                className="calendar-selector-container fade-in"
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '10px',
                  padding: '1.5rem',
                  marginBottom: '2rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={20} style={{ color: 'var(--color-primary-dark)' }} />
                    <span style={{ fontWeight: '600', fontSize: '1.1rem', color: 'var(--color-primary-dark)' }}>
                      Select a Discovery Call Slot
                    </span>
                  </div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', color: '#475569', backgroundColor: '#e2e8f0', padding: '0.25rem 0.65rem', borderRadius: '4px' }}>
                    <Globe size={15} />
                    <span>Sydney Time (AEST / AEDT)</span>
                  </div>
                </div>

                {/* Step 1: Weekday Selector (Mon - Fri) */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <span style={{ display: 'block', fontSize: '0.975rem', fontWeight: '600', color: '#334155', marginBottom: '0.5rem' }}>
                    1. Choose an available weekday:
                  </span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(95px, 1fr))', gap: '0.5rem' }}>
                    {availableDays.map(d => {
                      const isSelected = selectedDate === d.dateStr;
                      return (
                        <button
                          key={d.dateStr}
                          type="button"
                          onClick={() => handleDateSelect(d.dateStr)}
                          style={{
                            padding: '0.65rem 0.5rem',
                            borderRadius: '6px',
                            border: isSelected ? '2px solid var(--color-primary-dark)' : '1px solid #cbd5e1',
                            backgroundColor: isSelected ? 'var(--color-primary-dark)' : '#ffffff',
                            color: isSelected ? '#ffffff' : '#1e293b',
                            cursor: 'pointer',
                            textAlign: 'center',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <div style={{ fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', opacity: isSelected ? 0.9 : 0.7 }}>
                            {d.weekday}
                          </div>
                          <div style={{ fontSize: '1rem', fontWeight: '700', marginTop: '0.15rem' }}>
                            {d.label}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 2: 1-hour time slots (3:00 PM - 6:00 PM AEST) */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <span style={{ display: 'block', fontSize: '0.975rem', fontWeight: '600', color: '#334155', marginBottom: '0.5rem' }}>
                    2. Choose a 1-hour time slot:
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {TIME_SLOTS.map(slot => {
                      const isSelected = selectedSlot === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => handleSlotSelect(slot)}
                          style={{
                            padding: '0.75rem 1rem',
                            borderRadius: '6px',
                            border: isSelected ? '2px solid var(--color-primary-dark)' : '1px solid #cbd5e1',
                            backgroundColor: isSelected ? '#f0fdfa' : '#ffffff',
                            color: isSelected ? 'var(--color-primary-dark)' : '#334155',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            fontWeight: isSelected ? '600' : '500',
                            fontSize: '1rem',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Clock size={16} style={{ color: isSelected ? 'var(--color-primary-dark)' : '#64748b' }} />
                            {slot}
                          </span>
                          {isSelected && (
                            <span style={{ fontSize: '0.85rem', backgroundColor: 'var(--color-accent)', color: 'var(--color-primary-dark)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: '600' }}>
                              Selected
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Slot Summary Callout */}
                <div style={{ padding: '0.75rem 1rem', backgroundColor: '#e6fffa', border: '1px solid #99f6e4', borderRadius: '6px', fontSize: '0.95rem', color: '#115e59', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle size={18} style={{ flexShrink: 0, color: '#0d9488' }} />
                  <span>
                    Selected: <strong>{selectedDate}</strong> at <strong>{selectedSlot}</strong>
                  </span>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={status === 'submitting'}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  fontSize: '1.1rem',
                  padding: '0.85rem 1.85rem'
                }}
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 size={20} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Submit Inquiry
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Contact;

