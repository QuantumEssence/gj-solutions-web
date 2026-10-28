import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Users, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  PhoneCall, 
  Award, 
  Activity, 
  Database,
  Lock,
  Workflow,
  Sparkles
} from 'lucide-react';
import { fetchSiteContent, DEFAULT_CONTENT, type SiteContent } from '../services/content';

const About = () => {
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

  const capabilities = [
    {
      icon: <Database size={22} />,
      title: "Practice Management Systems (PMS)",
      desc: "Certified, daily operational fluency in Cliniko, Nookal, and Coreplus. We optimize diary schedules, appointment types, and practitioner rooms seamlessly."
    },
    {
      icon: <ShieldCheck size={22} />,
      title: "Australian Privacy Principles (APPs)",
      desc: "All personnel are trained in Privacy Act 1988 compliance. We operate under zero-PHI local storage rules with multi-factor authentication on every account."
    },
    {
      icon: <FileText size={22} />,
      title: "Referral & Funding Streams",
      desc: "Experienced handling Medicare EPC/CDM management plans, WorkCover/WorkSafe claims, DVA referrals, and NDIS intake documentation."
    },
    {
      icon: <PhoneCall size={22} />,
      title: "Empathetic Patient Communication",
      desc: "Professional Australian telephone and email reception representing your clinic's voice, answering patient queries and managing intake smoothly."
    },
    {
      icon: <Lock size={22} />,
      title: "Strict Non-Clinical Safeguards",
      desc: "Clear operational boundaries ensuring our assistants never alter clinical SOAP notes or offer diagnostic advice, preserving practitioner compliance."
    },
    {
      icon: <Sparkles size={22} />,
      title: "Proactive Diary Optimization",
      desc: "Continuous waitlist monitoring and recall cycle follow-ups that turn late cancellations into filled appointment slots within minutes."
    }
  ];

  const workflowSteps = [
    {
      step: "01",
      title: "Patient Inquiry & Referral Triage",
      desc: "Inbound calls, web bookings, and GP referrals are reviewed, verified for completeness, and entered directly into your clinic PMS.",
      icon: <FileText size={20} />
    },
    {
      step: "02",
      title: "Diary Coordination & Booking",
      desc: "Appointments are scheduled into Cliniko or Nookal respecting clinician consult preferences, travel buffers, and room availability.",
      icon: <Calendar size={20} />
    },
    {
      step: "03",
      title: "Pre-Consult Intake & Reminders",
      desc: "Digital intake forms and customized SMS/email reminders are dispatched to minimize non-attendance and ensure full patient readiness.",
      icon: <CheckCircle2 size={20} />
    },
    {
      step: "04",
      title: "Recall & Waitlist Backfilling",
      desc: "Clinician recall recommendations are systematically monitored, and sudden diary gaps are filled from your active cancellation list.",
      icon: <Activity size={20} />
    }
  ];

  return (
    <div className="about-container fade-in" style={{ maxWidth: '1100px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Header */}
      <div className="section-header text-center mb-4">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
          <Users size={16} /> Dedicated Allied Practice Partners
        </div>
        <h1 className="section-title">About G&J Solutions</h1>
        <p className="section-subtitle" style={{ maxWidth: '720px', margin: '0 auto' }}>
          Dedicated administrative and virtual practice support designed specifically for independent physiotherapists and allied health clinics across Australia.
        </p>
      </div>

      {/* Purpose & Clinical Philosophy Card */}
      <section className="card mb-4" style={{ padding: '2.5rem', borderLeft: '5px solid var(--color-primary-dark)' }}>
        <h2 style={{ fontSize: '1.6rem', color: 'var(--color-primary-dark)', marginBottom: '1rem' }}>
          {content.mission_title}
        </h2>
        <p style={{ lineHeight: '1.7', color: 'var(--color-text-muted)', fontSize: '1.02rem', marginBottom: '1.25rem' }}>
          {content.mission_body_1}
        </p>
        <p style={{ lineHeight: '1.7', color: 'var(--color-text-muted)', fontSize: '1.02rem', margin: 0 }}>
          {content.mission_body_2}
        </p>
      </section>

      {/* Professional Team Capabilities */}
      <section className="section">
        <div className="text-center mb-4">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            <Award size={16} /> Certified Practice Operations
          </div>
          <h2 className="section-title">Team Capabilities & Governance</h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Every assistant is trained in Australian healthcare standards, practice software, and professional privacy protocols.
          </p>
        </div>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '1.5rem' }}>
          {capabilities.map((cap, index) => (
            <div 
              key={index} 
              className="card" 
              style={{ 
                padding: '1.75rem', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '0.75rem',
                border: '1px solid var(--color-border)',
                transition: 'all 0.25s ease'
              }}
            >
              <div style={{ 
                width: '42px', 
                height: '42px', 
                borderRadius: '8px', 
                backgroundColor: 'var(--color-primary-subtle)', 
                color: 'var(--color-primary-dark)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                border: '1px solid #ccfbf1'
              }}>
                {cap.icon}
              </div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary-dark)', fontWeight: 700, margin: 0 }}>
                {cap.title}
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)', lineHeight: '1.6', margin: 0 }}>
                {cap.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Practice Workflow Architecture Diagram */}
      <section className="section">
        <div className="text-center mb-4">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            <Workflow size={16} /> Standardized Clinical Operations
          </div>
          <h2 className="section-title">The G&J Practice Workflow Architecture</h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            How our practice assistants manage patient journeys from first contact to routine recall.
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
          gap: '1.25rem',
          backgroundColor: '#ffffff',
          padding: '2rem',
          borderRadius: '16px',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          {workflowSteps.map((item, idx) => (
            <div 
              key={idx}
              style={{
                backgroundColor: 'var(--color-background)',
                borderRadius: '12px',
                padding: '1.5rem',
                border: '1px solid #e2e8f0',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: 800, 
                    color: 'var(--color-primary)', 
                    backgroundColor: '#ffffff', 
                    padding: '0.2rem 0.6rem', 
                    borderRadius: '6px',
                    border: '1px solid #ccfbf1'
                  }}>
                    {item.step}
                  </span>
                  <div style={{ color: 'var(--color-primary-dark)' }}>
                    {item.icon}
                  </div>
                </div>
                <h4 style={{ fontSize: '1.05rem', color: 'var(--color-primary-dark)', fontWeight: 700, marginBottom: '0.5rem' }}>
                  {item.title}
                </h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: '1.55', margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Card */}
      <section className="card text-center" style={{ padding: '3rem 2rem', background: 'linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 100%)', border: '1px solid #99f6e4' }}>
        <h2 style={{ fontSize: '1.85rem', color: 'var(--color-primary-dark)', marginBottom: '0.75rem' }}>
          Ready to Streamline Your Practice Administration?
        </h2>
        <p style={{ maxWidth: '620px', margin: '0 auto 1.75rem auto', color: '#1e3a8a', fontSize: '1rem', lineHeight: '1.6' }}>
          Schedule a brief discovery discussion to review your clinic's software setup and see how our assistants can protect your clinical focus.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/contact" className="btn btn-primary">
            Schedule a Consultation <ArrowRight size={16} />
          </Link>
          <Link to="/services" className="btn btn-outline">
            Review Service Packages
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
