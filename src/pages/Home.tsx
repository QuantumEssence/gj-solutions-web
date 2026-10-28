import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CalendarCheck, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Star, 
  HelpCircle, 
  Sparkles,
  Layers,
  PhoneCall
} from 'lucide-react';
import { fetchSiteContent, DEFAULT_CONTENT, type SiteContent } from '../services/content';
import './Home.css';

const Home = () => {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);

  useEffect(() => {
    let isMounted = true;
    fetchSiteContent().then((data) => {
      if (isMounted) {
        setContent(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="home-container fade-in">
      {/* Hero Section */}
      <section className="hero-section text-center mb-4">
        <div className="hero-badge">
          <span>🇦🇺</span>
          <span>Australian Allied Health Support • APPs Compliant</span>
        </div>
        
        <h1 className="hero-title">
          {content.hero_title}
        </h1>
        
        <p className="hero-subtitle">
          {content.hero_subtitle}
        </p>
        
        <p className="hero-description">
          {content.hero_description}
        </p>
        
        <div className="hero-actions">
          <Link to="/contact" className="btn btn-primary">
            <CalendarCheck size={18} /> Schedule a Consultation
          </Link>
          <Link to="/services" className="btn btn-outline">
            Explore Services <ArrowRight size={16} />
          </Link>
        </div>

        <div className="hero-trust-indicators">
          <div className="trust-item">
            <ShieldCheck size={18} />
            <span>Strict Non-Clinical & Zero PHI Local Storage</span>
          </div>
          <div className="trust-item">
            <Layers size={18} />
            <span>Allied Health Systems Proficient</span>
          </div>
          <div className="trust-item">
            <CheckCircle2 size={18} />
            <span>48–72h Clinic Onboarding</span>
          </div>
        </div>
      </section>

      {/* Value Proposition Cards */}
      <section className="section">
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.75rem' }}>
          <div className="value-card">
            <div className="value-icon-box">
              <CalendarCheck size={24} />
            </div>
            <h3 className="value-title">Maximized Clinical Capacity</h3>
            <p className="value-description">
              Keep treatment schedules full and minimize gaps. Delegate intake processing, recall confirmations, and general GP correspondence to your dedicated practice assistant.
            </p>
          </div>

          <div className="value-card">
            <div className="value-icon-box">
              <Clock size={24} />
            </div>
            <h3 className="value-title">Proactive Diary Coordination</h3>
            <p className="value-description">
              Eliminate the cost of missed calls and unfilled cancellations across practice diaries through responsive waitlist triage and patient communication.
            </p>
          </div>

          <div className="value-card">
            <div className="value-icon-box">
              <ShieldCheck size={24} />
            </div>
            <h3 className="value-title">Rigorous Privacy & Governance</h3>
            <p className="value-description">
              Our team operates under strict Australian Privacy Principles (APPs) and operational protocols, providing reliable administrative support without clinical overreach.
            </p>
          </div>
        </div>
      </section>

      {/* Software & Systems Proficiency */}
      <section className="software-section section">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
          <Layers size={16} /> Practice Management Ecosystem
        </div>
        <h2 className="section-title">Clinical Systems & Software Proficiency</h2>
        <p className="section-subtitle" style={{ margin: '0 auto', maxWidth: '650px' }}>
          Seamless administrative coordination across Australian allied health, telephony, and communication platforms.
        </p>
        <div className="software-logos">
          <div className="software-badge">
            <PhoneCall size={18} /> JUSTCALL
          </div>
          <div className="software-badge">
            <Sparkles size={18} /> MEDICARE & EPC / CDM
          </div>
          <div className="software-badge">
            <CheckCircle2 size={18} /> MICROSOFT 365
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section">
        <div className="text-center mb-4">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            <Star size={16} fill="currentColor" color="#f59e0b" /> Verified Practice Outcomes
          </div>
          <h2 className="section-title">Client Feedback & Clinical Outcomes</h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Hear how Australian practice owners reclaimed clinician focus and streamlined daily reception.
          </p>
        </div>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '1.5rem' }}>
          {content.testimonials.map((t, idx) => (
            <div key={idx} className="testimonial-card">
              <div>
                <div className="stars-row">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
                <p className="testimonial-quote">
                  "{t.quote}"
                </p>
              </div>
              <div className="testimonial-author">
                <div className="author-name">{t.name || t.author}</div>
                <div className="author-role">{[t.role, t.clinic].filter(Boolean).join(' • ')}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="section">
        <div className="text-center mb-4">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            <HelpCircle size={16} /> Operational Guidance
          </div>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Answers to common questions regarding practice management integration and regulatory boundaries.
          </p>
        </div>

        <div className="grid" style={{ gap: '1.25rem', maxWidth: '840px', margin: '0 auto' }}>
          {content.faqs.map((faq, idx) => (
            <div key={idx} className="faq-card">
              <h4 className="faq-question">
                <HelpCircle size={18} style={{ color: 'var(--color-primary)' }} />
                {faq.q || faq.question}
              </h4>
              <p className="faq-answer">
                {faq.a || faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Practice Operations Assessment / Lead Magnet */}
      <section className="audit-banner section">
        <h2 className="audit-banner-title">Practice Operations Assessment</h2>
        <p className="audit-banner-desc">
          Identify administrative bottlenecks impacting your clinic's capacity and learn how dedicated practice support can recover billable clinician hours.
        </p>
        <Link to="/contact" className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}>
          <CalendarCheck size={18} /> Request Practice Assessment
        </Link>
      </section>
    </div>
  );
};

export default Home;
