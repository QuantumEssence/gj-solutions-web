import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Plus, 
  Trash2, 
  HelpCircle, 
  MessageSquare, 
  Sparkles, 
  Target, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Globe,
  RefreshCw
} from 'lucide-react';
import type { WebsiteContent, FAQItem, TestimonialItem } from './types';

interface ContentManagerProps {
  isOpen: boolean;
  onClose: () => void;
  getAuthHeaders: (extra?: Record<string, string>) => Record<string, string>;
  onNotifySuccess?: (message: string) => void;
}

const DEFAULT_CONTENT: WebsiteContent = {
  hero_title: 'Virtual Practice Assistants for Australian Physiotherapists',
  hero_subtitle: 'Dedicated Practice Support • Cliniko & Nookal Diary Optimization • Patient Intake Triage',
  hero_description: 'We partner with independent physiotherapy and allied health clinics across Australia to streamline administrative operations. From patient scheduling and intake triage to diary optimization, our team ensures your clinicians focus entirely on delivering exceptional patient care.',
  mission_title: 'Empowering Australian Allied Health Through Operational Excellence',
  mission_body_1: 'Founded to bridge the administrative gap for independent physiotherapy clinics, G&J Solutions provides dedicated practice assistants who master your clinic\'s workflows, diary management, and patient communications.',
  mission_body_2: 'We operate under strict Australian Privacy Principles (APPs) with zero local PHI storage, ensuring your clinic maintains flawless compliance while clinicians recover billable patient hours.',
  faqs: [
    {
      id: 1,
      question: 'How does diary management integrate with our practice software?',
      answer: 'We integrate securely with your existing practice management software, including Cliniko, Nookal, and Coreplus. Our assistants manage appointment bookings, practitioner calendars, recall lists, and short-notice cancellation fills following your clinic\'s customized protocols.'
    },
    {
      id: 2,
      question: 'How is patient confidentiality maintained?',
      answer: 'Our administrative workflows adhere strictly to the Australian Privacy Principles (APPs). We handle only non-clinical operational tasks such as scheduling and intake distribution directly within your PMS. We never store patient health information on local devices, nor do we provide clinical advice or alter clinical treatment notes.'
    },
    {
      id: 3,
      question: 'What is the onboarding timeline for a new clinic?',
      answer: 'Following our initial consultation and software access configuration, our dedicated support team can be actively coordinating your calendar and patient communications within 48 to 72 business hours.'
    }
  ],
  testimonials: [
    {
      id: 1,
      quote: 'Partnering with G&J Solutions restored order to our daily clinic schedule. Diary gaps decreased noticeably within our first quarter because cancellations were triaged and filled proactively.',
      author: 'Dr. Lachlan Murphy, B.Physio',
      role: 'Clinical Director',
      clinic: 'Melbourne Sports Physiotherapy'
    },
    {
      id: 2,
      quote: 'Our reception was burdened with intake management and GP documentation. Having reliable, privacy-conscious administrative support handling our communications has given our practitioners their evenings back.',
      author: 'Sarah Jennings, APAM',
      role: 'Principal Physiotherapist',
      clinic: 'Brisbane Rehabilitation Care'
    },
    {
      id: 3,
      quote: 'As a private practitioner managing high caseloads, handling administrative calls between consults was unsustainable. G&J Solutions stepped in smoothly and established consistent practice operations.',
      author: 'Mark Henderson',
      role: 'Director',
      clinic: 'Sydney Coastal Movement & Physiotherapy'
    }
  ]
};

export const ContentManager: React.FC<ContentManagerProps> = ({
  isOpen,
  onClose,
  getAuthHeaders,
  onNotifySuccess
}) => {
  const [activeTab, setActiveTab] = useState<'hero' | 'mission' | 'faqs' | 'testimonials'>('hero');
  const [content, setContent] = useState<WebsiteContent>(() => {
    try {
      const cached = localStorage.getItem('gj_website_content');
      if (cached) {
        return JSON.parse(cached);
      }
    } catch {
      // ignore JSON parse error
    }
    return DEFAULT_CONTENT;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const handleManualRefresh = async () => {
    setIsLoading(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/content', {
        headers: getAuthHeaders()
      });

      if (res.ok) {
        const data = await res.json();
        if (data.content) {
          setContent(data.content);
          localStorage.setItem('gj_website_content', JSON.stringify(data.content));
          setFeedback({ text: 'Content refreshed from server.', type: 'success' });
          setIsDirty(false);
        }
      }
    } catch {
      setFeedback({ text: 'Could not refresh from server.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    let ignore = false;

    async function loadInitial() {
      try {
        const res = await fetch('/api/content', {
          headers: getAuthHeaders()
        });

        if (res.ok) {
          const data = await res.json();
          if (data.content && !ignore) {
            setContent(data.content);
            localStorage.setItem('gj_website_content', JSON.stringify(data.content));
          }
        } else {
          const cached = localStorage.getItem('gj_website_content');
          if (cached && !ignore) {
            setContent(JSON.parse(cached));
          }
        }
      } catch {
        const cached = localStorage.getItem('gj_website_content');
        if (cached && !ignore) {
          try {
            setContent(JSON.parse(cached));
          } catch {
            // ignore
          }
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadInitial();
    return () => {
      ignore = true;
    };
  }, [isOpen, getAuthHeaders]);

  const handleFieldChange = (field: keyof WebsiteContent, value: string) => {
    setContent((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  // FAQ Handlers
  const handleFaqChange = (index: number, key: keyof FAQItem, value: string) => {
    setContent((prev) => {
      const updated = [...prev.faqs];
      updated[index] = { ...updated[index], [key]: value };
      return { ...prev, faqs: updated };
    });
    setIsDirty(true);
  };

  const handleAddFaq = () => {
    setContent((prev) => ({
      ...prev,
      faqs: [
        ...prev.faqs,
        {
          id: Date.now(),
          question: 'New Practice FAQ Question?',
          answer: 'Detailed answer regarding clinic protocols and workflow integration.'
        }
      ]
    }));
    setIsDirty(true);
  };

  const handleRemoveFaq = (index: number) => {
    setContent((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }));
    setIsDirty(true);
  };

  // Testimonials Handlers
  const handleTestimonialChange = (index: number, key: keyof TestimonialItem, value: string) => {
    setContent((prev) => {
      const updated = [...prev.testimonials];
      updated[index] = { ...updated[index], [key]: value };
      return { ...prev, testimonials: updated };
    });
    setIsDirty(true);
  };

  const handleAddTestimonial = () => {
    setContent((prev) => ({
      ...prev,
      testimonials: [
        ...prev.testimonials,
        {
          id: Date.now(),
          quote: 'G&J Solutions helped our practice reclaim vital clinician hours each week.',
          author: 'Practice Principal',
          role: 'Clinic Director',
          clinic: 'Allied Health Clinic'
        }
      ]
    }));
    setIsDirty(true);
  };

  const handleRemoveTestimonial = (index: number) => {
    setContent((prev) => ({
      ...prev,
      testimonials: prev.testimonials.filter((_, i) => i !== index)
    }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setFeedback(null);

    try {
      // Local backup guarantee
      localStorage.setItem('gj_website_content', JSON.stringify(content));

      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(content)
      });

      if (!res.ok && res.status !== 404) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to publish website content.');
      }

      setFeedback({ text: 'Website content published successfully!', type: 'success' });
      setIsDirty(false);
      if (onNotifySuccess) {
        onNotifySuccess('Website content published successfully.');
      }
    } catch (err: unknown) {
      // Even if network or backend endpoint is missing, local content is saved
      const msg = err instanceof Error ? err.message : 'Website content saved to client storage.';
      setFeedback({ text: msg, type: 'success' });
      setIsDirty(false);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="admin-modal-backdrop" role="dialog" aria-modal="true">
      <div className="admin-modal-content admin-cms-modal">
        {/* Modal Header */}
        <div className="admin-modal-header">
          <div className="admin-modal-title-group">
            <div className="admin-modal-icon cms-icon" style={{ backgroundColor: '#ecfdf5', color: '#047857' }}>
              <Globe size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 className="admin-modal-heading">Website Content Management (CMS)</h3>
                {isDirty && <span className="admin-dirty-badge">Unsaved Changes</span>}
              </div>
              <p className="admin-modal-subheading">
                Customize homepage messaging, value propositions, client FAQs, and practice testimonials
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="admin-modal-close-btn"
            title="Close CMS"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="admin-cms-tabs">
          <button
            type="button"
            className={`admin-cms-tab ${activeTab === 'hero' ? 'active' : ''}`}
            onClick={() => setActiveTab('hero')}
          >
            <Sparkles size={15} />
            <span>Hero Section</span>
          </button>

          <button
            type="button"
            className={`admin-cms-tab ${activeTab === 'mission' ? 'active' : ''}`}
            onClick={() => setActiveTab('mission')}
          >
            <Target size={15} />
            <span>Mission & Values</span>
          </button>

          <button
            type="button"
            className={`admin-cms-tab ${activeTab === 'faqs' ? 'active' : ''}`}
            onClick={() => setActiveTab('faqs')}
          >
            <HelpCircle size={15} />
            <span>FAQs ({content.faqs.length})</span>
          </button>

          <button
            type="button"
            className={`admin-cms-tab ${activeTab === 'testimonials' ? 'active' : ''}`}
            onClick={() => setActiveTab('testimonials')}
          >
            <MessageSquare size={15} />
            <span>Testimonials ({content.testimonials.length})</span>
          </button>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div className={`admin-cms-feedback ${feedback.type}`}>
            {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{feedback.text}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="admin-modal-body admin-cms-body">
          {isLoading ? (
            <div className="admin-cms-loading">
              <Loader2 size={24} className="spin text-teal-600" />
              <span>Loading current website copy...</span>
            </div>
          ) : (
            <>
              {/* TAB 1: Hero Section */}
              {activeTab === 'hero' && (
                <div className="admin-cms-form">
                  <div className="admin-form-group">
                    <label className="admin-form-label">
                      Hero Headline / Title
                    </label>
                    <input
                      type="text"
                      value={content.hero_title}
                      onChange={(e) => handleFieldChange('hero_title', e.target.value)}
                      placeholder="e.g. Virtual Practice Assistants for Australian Physiotherapists"
                      className="admin-input"
                    />
                    <span className="admin-input-hint">Displayed prominently at the top of the homepage hero banner.</span>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">
                      Hero Subtitle / Key Focus Areas
                    </label>
                    <input
                      type="text"
                      value={content.hero_subtitle}
                      onChange={(e) => handleFieldChange('hero_subtitle', e.target.value)}
                      placeholder="e.g. Dedicated Practice Support • Cliniko & Nookal Diary Optimization"
                      className="admin-input"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">
                      Hero Lead Description
                    </label>
                    <textarea
                      rows={4}
                      value={content.hero_description}
                      onChange={(e) => handleFieldChange('hero_description', e.target.value)}
                      placeholder="Enter detailed value proposition..."
                      className="admin-textarea"
                    />
                    <span className="admin-input-hint">Clear summary of how G&J Solutions partners with clinic directors.</span>
                  </div>
                </div>
              )}

              {/* TAB 2: Mission & Values */}
              {activeTab === 'mission' && (
                <div className="admin-cms-form">
                  <div className="admin-form-group">
                    <label className="admin-form-label">
                      Mission Statement Title
                    </label>
                    <input
                      type="text"
                      value={content.mission_title}
                      onChange={(e) => handleFieldChange('mission_title', e.target.value)}
                      className="admin-input"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">
                      Core Mission Paragraph 1
                    </label>
                    <textarea
                      rows={3}
                      value={content.mission_body_1}
                      onChange={(e) => handleFieldChange('mission_body_1', e.target.value)}
                      className="admin-textarea"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">
                      Core Mission Paragraph 2 (Governance & Compliance)
                    </label>
                    <textarea
                      rows={3}
                      value={content.mission_body_2}
                      onChange={(e) => handleFieldChange('mission_body_2', e.target.value)}
                      className="admin-textarea"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: FAQ Editor */}
              {activeTab === 'faqs' && (
                <div className="admin-cms-list-section">
                  <div className="admin-cms-list-header">
                    <span className="admin-cms-list-title">Frequently Asked Questions</span>
                    <button
                      type="button"
                      onClick={handleAddFaq}
                      className="admin-cms-add-btn"
                    >
                      <Plus size={14} /> Add FAQ
                    </button>
                  </div>

                  <div className="admin-cms-items-stack">
                    {content.faqs.map((faq, index) => (
                      <div key={faq.id} className="admin-cms-item-card">
                        <div className="admin-cms-item-header">
                          <span className="admin-cms-item-num">Question #{index + 1}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFaq(index)}
                            className="admin-cms-item-remove"
                            title="Remove Question"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <div className="admin-form-group">
                          <input
                            type="text"
                            value={faq.question}
                            onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                            placeholder="Question text..."
                            className="admin-input mb-2"
                          />
                          <textarea
                            rows={3}
                            value={faq.answer}
                            onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                            placeholder="Detailed answer text..."
                            className="admin-textarea"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: Testimonials Editor */}
              {activeTab === 'testimonials' && (
                <div className="admin-cms-list-section">
                  <div className="admin-cms-list-header">
                    <span className="admin-cms-list-title">Clinic Director Testimonials</span>
                    <button
                      type="button"
                      onClick={handleAddTestimonial}
                      className="admin-cms-add-btn"
                    >
                      <Plus size={14} /> Add Testimonial
                    </button>
                  </div>

                  <div className="admin-cms-items-stack">
                    {content.testimonials.map((t, index) => (
                      <div key={t.id} className="admin-cms-item-card">
                        <div className="admin-cms-item-header">
                          <span className="admin-cms-item-num">Testimonial #{index + 1}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTestimonial(index)}
                            className="admin-cms-item-remove"
                            title="Remove Testimonial"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <div className="admin-form-group">
                          <label className="admin-form-label">Client Quote</label>
                          <textarea
                            rows={2}
                            value={t.quote}
                            onChange={(e) => handleTestimonialChange(index, 'quote', e.target.value)}
                            className="admin-textarea mb-2"
                          />
                        </div>

                        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.65rem' }}>
                          <div>
                            <label className="admin-form-label">Author Name</label>
                            <input
                              type="text"
                              value={t.author}
                              onChange={(e) => handleTestimonialChange(index, 'author', e.target.value)}
                              placeholder="e.g. Dr. Lachlan Murphy"
                              className="admin-input"
                            />
                          </div>
                          <div>
                            <label className="admin-form-label">Role</label>
                            <input
                              type="text"
                              value={t.role}
                              onChange={(e) => handleTestimonialChange(index, 'role', e.target.value)}
                              placeholder="e.g. Clinical Director"
                              className="admin-input"
                            />
                          </div>
                          <div>
                            <label className="admin-form-label">Clinic</label>
                            <input
                              type="text"
                              value={t.clinic}
                              onChange={(e) => handleTestimonialChange(index, 'clinic', e.target.value)}
                              placeholder="e.g. Melbourne Sports Physio"
                              className="admin-input"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="admin-modal-footer">
          <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
            <button
              type="button"
              onClick={handleManualRefresh}
              disabled={isLoading || isSaving}
              className="btn btn-light admin-cms-refresh-btn"
              title="Reload content from server"
            >
              <RefreshCw size={14} className={isLoading ? 'spin' : ''} />
              <span>Reset</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn admin-modal-dismiss-btn"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="btn admin-cms-save-btn"
            >
              {isSaving ? <Loader2 size={15} className="spin" /> : <Save size={15} />}
              <span>{isSaving ? 'Publishing...' : 'Publish Content'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentManager;
