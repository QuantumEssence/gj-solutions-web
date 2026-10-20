
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Services = () => {
  const servicesList = [
    {
      id: 1,
      title: "Frontdesk & Diary Management",
      description: "Emails, patient phone inquiries, and calendar booking. Seamless diary management in Cliniko/Nookal to minimize no-shows, fill short-notice cancellations, and ensure a calm clinical day.",
      icon: "📅",
      serviceParam: "Desk Work only"
    },
    {
      id: 2,
      title: "Report Preparation & Intake Triage",
      description: "Gathering new patient intake questionnaires, organizing initial consult notes, tracking GP medical referrals, and formatting non-clinical administrative summaries with meticulous care.",
      icon: "📋",
      serviceParam: "Desk Work + Data gathering"
    },
    {
      id: 3,
      title: "Contract Review (Plain-Language Risk Read)",
      description: "A second pair of eyes to highlight ambiguous clauses, equipment rental terms, and service agreements. Note: G&J is not a law firm and does not provide formal legal advice, but offers practical risk-checking you can rely on.",
      icon: "📑",
      serviceParam: "Contract Review"
    }
  ];

  return (
    <div className="services-container fade-in">
      <div className="section-header text-center mb-4">
        <h1 className="section-title">🇦🇺 Virtual Assistant Services</h1>
        <p className="section-subtitle" style={{ maxWidth: '650px', margin: '0 auto', color: '#e6f4f5' }}>
          Tailored operational and practice management support designed exclusively for independent Australian physiotherapists and allied health clinics 🩺
        </p>
      </div>

      <div className="grid services-grid mb-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {servicesList.map(service => (
          <div key={service.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ color: 'var(--color-primary-dark)', fontSize: '2rem', marginBottom: '1rem' }}>{service.icon}</div>
              <h3 className="card-title">{service.title}</h3>
              <p className="card-body" style={{ lineHeight: '1.6' }}>{service.description}</p>
            </div>
            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
              <Link 
                to={`/contact?service=${encodeURIComponent(service.serviceParam)}`}
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%' }}
              >
                Inquire About This Service <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ))}
      </div>

      <section className="tiered-packages-section section mt-4" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.2)', paddingTop: '4rem' }}>
        <h2 className="section-title text-center mb-4">Practice Support Packages 🇦🇺</h2>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div className="card" style={{ border: '1px solid #cbd5e1', textAlign: 'center', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '2rem' }}>
            <div>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📅</div>
              <h3 className="mb-2" style={{ color: 'var(--color-primary-dark)' }}>Essential Frontdesk Tier</h3>
              <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: '1.5' }}>Ideal for solo clinicians wanting calm days: Daily inbox triage, phone booking support, and Cliniko/Nookal diary optimization.</p>
            </div>
            <div style={{ marginTop: '1.5rem' }}>
              <Link 
                to={`/contact?service=${encodeURIComponent('Desk Work only')}`}
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', width: '100%', justifyContent: 'center' }}
              >
                Select Frontdesk Tier <ArrowRight size={16} />
              </Link>
            </div>
          </div>
          <div className="card" style={{ border: '2px solid var(--color-primary-light)', textAlign: 'center', backgroundColor: '#f0f9ff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '2rem' }}>
            <div>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📋</div>
              <h3 className="mb-2" style={{ color: 'var(--color-primary-dark)' }}>Comprehensive Operations Tier</h3>
              <p style={{ color: '#0369a1', fontSize: '0.9rem', lineHeight: '1.5' }}>Full diary handling plus intake document gathering, referral tracking, patient reactivation campaigns, and non-clinical practice reporting.</p>
            </div>
            <div style={{ marginTop: '1.5rem' }}>
              <Link 
                to={`/contact?service=${encodeURIComponent('Desk Work + Data gathering')}`}
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', width: '100%', justifyContent: 'center' }}
              >
                Select Comprehensive Tier <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="out-of-scope-section section text-center" style={{ padding: '3rem', border: '1px solid #fee2e2', backgroundColor: '#fef2f2', borderRadius: '12px', marginTop: '2rem' }}>
        <h2 className="section-title" style={{ color: '#b91c1c' }}>Out of Scope Services</h2>
        <p style={{ color: '#991b1b', maxWidth: '600px', margin: '0 auto' }}>
          To ensure we provide the highest quality service in our areas of expertise, we explicitly <strong>do not handle</strong>:
          <br/><br/>
          <ul style={{ textAlign: 'left', display: 'inline-block', listStyleType: 'disc' }}>
            <li>Accounting and tax filing</li>
            <li>Accessing clients' bank details</li>
            <li>Tracking receipts of payments from clients</li>
          </ul>
        </p>
      </section>
    </div>
  );
};

export default Services;
