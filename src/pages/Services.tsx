
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Services = () => {
  const servicesList = [
    {
      id: 1,
      title: "Frontdesk & Diary Management",
      description: "Patient communication, appointment scheduling, and practitioner diary coordination in Cliniko and Nookal. We actively manage cancellations and waitlists to maintain full clinician appointment books.",
      serviceParam: "Desk Work only"
    },
    {
      id: 2,
      title: "Patient Intake Triage & Documentation",
      description: "Systematic intake questionnaire collection, medical practitioner referral tracking, and non-clinical document preparation formatted to your clinic's precise standards.",
      serviceParam: "Desk Work + Data gathering"
    },
    {
      id: 3,
      title: "Operational & Service Agreement Review",
      description: "Structured plain-language review of operational agreements, equipment leases, and practice contracts. Note: G&J Solutions provides operational risk assessment and does not provide formal legal counsel.",
      serviceParam: "Contract Review"
    }
  ];

  return (
    <div className="services-container fade-in">
      <div className="section-header text-center mb-4">
        <h1 className="section-title">Practice Support Services</h1>
        <p className="section-subtitle" style={{ maxWidth: '650px', margin: '0 auto', color: '#e6f4f5' }}>
          Dedicated operational and administrative support tailored for independent Australian physiotherapy and allied health clinics
        </p>
      </div>

      <div className="grid services-grid mb-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {servicesList.map(service => (
          <div key={service.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'var(--color-primary-dark)' }}>{service.title}</h3>
              <p className="card-body" style={{ lineHeight: '1.6', color: '#475569' }}>{service.description}</p>
            </div>
            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
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

      <section className="tiered-packages-section section mt-4" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.2)', paddingTop: '4rem' }}>
        <h2 className="section-title text-center mb-4">Practice Engagement Models</h2>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div className="card" style={{ border: '1px solid #cbd5e1', textAlign: 'center', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '2rem' }}>
            <div>
              <h3 className="mb-2" style={{ color: 'var(--color-primary-dark)' }}>Frontdesk Operations</h3>
              <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: '1.5' }}>Designed for solo and boutique clinics: Comprehensive inbox triage, appointment scheduling, and Cliniko/Nookal diary optimization.</p>
            </div>
            <div style={{ marginTop: '1.5rem' }}>
              <Link 
                to={`/contact?service=${encodeURIComponent('Desk Work only')}`}
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', width: '100%', justifyContent: 'center' }}
              >
                Select Frontdesk Operations <ArrowRight size={16} />
              </Link>
            </div>
          </div>
          <div className="card" style={{ border: '2px solid var(--color-primary-light)', textAlign: 'center', backgroundColor: '#f0f9ff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '2rem' }}>
            <div>
              <h3 className="mb-2" style={{ color: 'var(--color-primary-dark)' }}>Full Practice Coordination</h3>
              <p style={{ color: '#0369a1', fontSize: '0.9rem', lineHeight: '1.5' }}>Complete calendar oversight, patient intake management, GP referral tracking, recall workflows, and non-clinical reporting.</p>
            </div>
            <div style={{ marginTop: '1.5rem' }}>
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

      <section className="out-of-scope-section section text-center" style={{ padding: '3rem', border: '1px solid #fee2e2', backgroundColor: '#fef2f2', borderRadius: '12px', marginTop: '2rem' }}>
        <h2 className="section-title" style={{ color: '#b91c1c' }}>Operational Scope & Boundaries</h2>
        <p style={{ color: '#991b1b', maxWidth: '600px', margin: '0 auto 1.5rem auto', lineHeight: '1.5' }}>
          G&J Solutions provides administrative and operational support only. To protect our clients and maintain strict compliance with Australian healthcare and financial standards, we explicitly <strong>do not handle</strong>:
        </p>
        <ul style={{ textAlign: 'left', display: 'inline-block', listStyleType: 'disc', color: '#7f1d1d', lineHeight: '1.8', fontSize: '0.95rem' }}>
          <li>Clinical diagnosis, treatment notes, or medical advice</li>
          <li>Tax accounting, BAS preparation, or corporate tax filing</li>
          <li>Direct access to or storage of client banking credentials</li>
          <li>Reconciliation of merchant merchant/bank accounts</li>
        </ul>
      </section>
    </div>
  );
};

export default Services;
