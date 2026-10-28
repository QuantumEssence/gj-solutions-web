import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  CalendarCheck, 
  ClipboardList, 
  FileSearch, 
  ShieldAlert, 
  Sparkles,
  Layers,
  Check
} from 'lucide-react';

const Services = () => {
  const servicesList = [
    {
      id: 1,
      icon: <CalendarCheck size={24} />,
      title: "Frontdesk & Diary Management",
      description: "Patient communication, appointment scheduling, and practitioner diary coordination in Cliniko and Nookal. We actively manage cancellations and waitlists to maintain full clinician appointment books.",
      serviceParam: "Desk Work only",
      highlights: [
        "Inbound telephone & email patient inquiry triage",
        "Cliniko / Nookal / Coreplus calendar scheduling",
        "Rapid cancellation fill & waitlist outreach",
        "Practitioner buffer time & room optimization"
      ]
    },
    {
      id: 2,
      icon: <ClipboardList size={24} />,
      title: "Patient Intake Triage & Documentation",
      description: "Systematic intake questionnaire collection, medical practitioner referral tracking, and non-clinical document preparation formatted to your clinic's precise standards.",
      serviceParam: "Desk Work + Data gathering",
      highlights: [
        "Medicare EPC / CDM referral document validation",
        "DVA, WorkCover & NDIS intake registration",
        "Digital health questionnaire follow-ups",
        "Pre-consult reminder SMS & email dispatch"
      ]
    },
    {
      id: 3,
      icon: <FileSearch size={24} />,
      title: "Operational & Service Agreement Review",
      description: "Structured plain-language review of operational agreements, equipment leases, and practice contracts. Note: G&J Solutions provides operational risk assessment and does not provide formal legal counsel.",
      serviceParam: "Contract Review",
      highlights: [
        "Operational vendor contract risk summaries",
        "Allied health room lease checklist review",
        "Plain-language term comparison",
        "Administrative compliance cross-checks"
      ]
    }
  ];

  return (
    <div className="services-container fade-in" style={{ maxWidth: '1100px', margin: '0 auto', paddingBottom: '3rem' }}>
      <div className="section-header text-center mb-4">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
          <Layers size={16} /> Allied Health Support Solutions
        </div>
        <h1 className="section-title">Practice Support Services</h1>
        <p className="section-subtitle" style={{ maxWidth: '700px', margin: '0 auto' }}>
          Dedicated operational and administrative support tailored for independent Australian physiotherapy and allied health clinics.
        </p>
      </div>

      {/* Main Services Grid */}
      <div className="grid services-grid mb-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '2rem' }}>
        {servicesList.map(service => (
          <div 
            key={service.id} 
            className="card" 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              padding: '2.25rem',
              border: '1px solid var(--color-border)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div>
              <div style={{ 
                width: '46px', 
                height: '46px', 
                borderRadius: '10px', 
                backgroundColor: 'var(--color-primary-subtle)', 
                color: 'var(--color-primary-dark)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginBottom: '1.25rem',
                border: '1px solid #ccfbf1'
              }}>
                {service.icon}
              </div>
              <h3 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'var(--color-primary-dark)' }}>
                {service.title}
              </h3>
              <p className="card-body" style={{ lineHeight: '1.6', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                {service.description}
              </p>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-light)', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                  Key Capabilities:
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {service.highlights.map((h, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
                      <Check size={16} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '3px' }} />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div style={{ paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
              <Link 
                to={`/contact?service=${encodeURIComponent(service.serviceParam)}`}
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%' }}
              >
                Inquire About Service <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Practice Engagement Models */}
      <section className="tiered-packages-section section mt-4" style={{ borderTop: '1px solid var(--color-border)', paddingTop: '3.5rem' }}>
        <div className="text-center mb-4">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            <Sparkles size={16} /> Flexible Clinic Partnership
          </div>
          <h2 className="section-title">Practice Engagement Models</h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Choose the operational coverage level that fits your clinic's clinician caseload and growth targets.
          </p>
        </div>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.75rem' }}>
          <div className="card" style={{ border: '1px solid var(--color-border)', textAlign: 'center', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '2.5rem' }}>
            <div>
              <div style={{ display: 'inline-block', padding: '0.3rem 0.8rem', backgroundColor: '#f1f5f9', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '1rem' }}>
                Solo & Boutique Clinics
              </div>
              <h3 className="mb-2" style={{ color: 'var(--color-primary-dark)', fontSize: '1.4rem' }}>Frontdesk Operations</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                Comprehensive inbox triage, appointment scheduling, and Cliniko/Nookal diary optimization to ensure no patient call or inquiry goes unanswered.
              </p>
            </div>
            <div>
              <Link 
                to={`/contact?service=${encodeURIComponent('Desk Work only')}`}
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', width: '100%', justifyContent: 'center' }}
              >
                Select Frontdesk Operations <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="card" style={{ border: '2px solid var(--color-primary)', textAlign: 'center', backgroundColor: 'var(--color-primary-subtle)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '2.5rem', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'var(--color-primary-dark)', color: '#ffffff', padding: '0.2rem 1rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Most Popular
            </div>
            <div>
              <div style={{ display: 'inline-block', padding: '0.3rem 0.8rem', backgroundColor: '#ccfbf1', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-primary-dark)', marginBottom: '1rem' }}>
                Multi-Practitioner Clinics
              </div>
              <h3 className="mb-2" style={{ color: 'var(--color-primary-dark)', fontSize: '1.4rem' }}>Full Practice Coordination</h3>
              <p style={{ color: '#134e4a', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                Complete calendar oversight, patient intake management, GP referral tracking, recall workflows, cancellation backfilling, and administrative reporting.
              </p>
            </div>
            <div>
              <Link 
                to={`/contact?service=${encodeURIComponent('Desk Work + Data gathering')}`}
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', width: '100%', justifyContent: 'center' }}
              >
                Select Full Practice Coordination <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Out of Scope / Regulatory Governance Section */}
      <section className="section" style={{ marginTop: '3.5rem' }}>
        <div style={{ 
          padding: '2.5rem', 
          border: '1px solid #fecaca', 
          backgroundColor: '#fff5f5', 
          borderRadius: '14px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.5rem', borderRadius: '8px' }}>
              <ShieldAlert size={24} />
            </div>
            <h2 style={{ fontSize: '1.45rem', color: '#991b1b', margin: 0 }}>
              Operational Scope & Clinical Governance Boundaries
            </h2>
          </div>
          
          <p style={{ color: '#7f1d1d', maxWidth: '750px', lineHeight: '1.6', fontSize: '0.95rem', marginBottom: '1.25rem' }}>
            G&J Solutions provides administrative and operational support only. To protect our client clinics and maintain strict compliance with Australian healthcare and financial legislation, we explicitly <strong>do not handle</strong>:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div style={{ backgroundColor: '#ffffff', padding: '1rem', borderRadius: '8px', border: '1px solid #fecaca' }}>
              <strong style={{ color: '#991b1b', fontSize: '0.9rem', display: 'block', marginBottom: '0.25rem' }}>
                • Clinical Diagnosis & Advice
              </strong>
              <span style={{ fontSize: '0.85rem', color: '#7f1d1d' }}>
                No clinical diagnosis, medical triage, or alteration of treating clinician treatment/SOAP notes.
              </span>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '1rem', borderRadius: '8px', border: '1px solid #fecaca' }}>
              <strong style={{ color: '#991b1b', fontSize: '0.9rem', display: 'block', marginBottom: '0.25rem' }}>
                • Tax & BAS Accounting
              </strong>
              <span style={{ fontSize: '0.85rem', color: '#7f1d1d' }}>
                No tax accounting, BAS preparation, corporate tax filing, or formal financial advisory services.
              </span>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '1rem', borderRadius: '8px', border: '1px solid #fecaca' }}>
              <strong style={{ color: '#991b1b', fontSize: '0.9rem', display: 'block', marginBottom: '0.25rem' }}>
                • Primary Banking Credentials
              </strong>
              <span style={{ fontSize: '0.85rem', color: '#7f1d1d' }}>
                No access to or storage of client direct banking passwords or primary banking authority.
              </span>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '1rem', borderRadius: '8px', border: '1px solid #fecaca' }}>
              <strong style={{ color: '#991b1b', fontSize: '0.9rem', display: 'block', marginBottom: '0.25rem' }}>
                • Bank Reconciliation
              </strong>
              <span style={{ fontSize: '0.85rem', color: '#7f1d1d' }}>
                No primary reconciliation of bank accounts or statutory merchant financial compliance.
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
