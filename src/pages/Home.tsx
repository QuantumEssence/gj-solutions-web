import './Home.css';

const Home = () => {
  return (
    <div className="home-container fade-in">
      <section className="hero-section section text-center">
        <h1 className="hero-title">🇦🇺 G&J Solutions</h1>
        <p className="hero-subtitle">
          Dedicated Virtual Assistants for Independent Australian Physiotherapists 🩺
        </p>
        <p className="mb-4" style={{ maxWidth: '680px', margin: '0 auto', lineHeight: '1.6' }}>
          We help independent allied health and physiotherapy practices streamline daily operations. From diary management and patient rescheduling to practitioner intake triage and AHPRA-aware administrative workflows, we give your clinicians their hours back.
        </p>
        <div className="cta-buttons" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
          <a href="/contact" className="btn btn-primary">📅 Book a Discovery Call</a>
          <a href="/services" className="btn btn-outline">📋 View Our Services</a>
        </div>
      </section>

      <section className="value-prop-section section mt-4">
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          <div className="card text-center">
            <h3 className="card-title">🩺 More Time for Patients</h3>
            <p className="card-body">Keep your treatment rooms fully booked and unhurried. Hand over appointment follow-ups, initial intake forms, and GP referral confirmations to your dedicated VA.</p>
          </div>
          <div className="card text-center">
            <h3 className="card-title">📅 Reduced Diary Burnout</h3>
            <p className="card-body">Eliminate the friction of missed calls, late cancellations, and diary gaps across Cliniko, Nookal, and SimpleClinic with proactive, friendly diary management.</p>
          </div>
          <div className="card text-center">
            <h3 className="card-title">🔒 Seamless AHPRA Compliance</h3>
            <p className="card-body">Enjoy prompt administrative assistance that respects patient privacy guidelines and strict boundary protocols, ensuring secure operational support without medical overreach.</p>
          </div>
        </div>
      </section>

      <section className="software-section section">
        <h2 className="section-title text-center">Practice Management & Tools Proficiency</h2>
        <p className="text-center mb-4">Experienced with the modern platforms Australian clinics rely on daily.</p>
        <div className="software-logos">
          <div className="software-badge">CLINIKO</div>
          <div className="software-badge">NOOKAL</div>
          <div className="software-badge">MS TEAMS</div>
          <div className="software-badge">JUSTCALL</div>
          <div className="software-badge">OUTLOOK</div>
          <div className="software-badge">MS OFFICE</div>
        </div>
      </section>

      <section className="testimonials-section section">
        <h2 className="section-title text-center mb-4">What Australian Clinic Directors Say</h2>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.75rem', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
            <p style={{ fontStyle: 'italic', fontSize: '0.95rem', color: '#334155', lineHeight: '1.6', marginBottom: '1.25rem' }}>
              "Partnering with G&J Solutions completely freed up our senior clinicians. Our diary gaps dropped by 28% in our first two months because cancellations were rebooked within minutes."
            </p>
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
              <div style={{ fontWeight: '700', color: 'var(--color-primary-dark)' }}>Dr. Lachlan Murphy, B.Physio</div>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Clinic Director • Melbourne Sports Physio 🇦🇺</div>
            </div>
          </div>
          
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.75rem', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
            <p style={{ fontStyle: 'italic', fontSize: '0.95rem', color: '#334155', lineHeight: '1.6', marginBottom: '1.25rem' }}>
              "Our reception was drowning in intake emails and GP correspondence. Having a calm, AHPRA-aware administrative assistant handling our inbox keeps our staff happy and focused on patient care."
            </p>
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
              <div style={{ fontWeight: '700', color: 'var(--color-primary-dark)' }}>Sarah Jennings, APAM</div>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Founder & Principal • Brisbane Rehab Care 🇦🇺</div>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.75rem', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
            <p style={{ fontStyle: 'italic', fontSize: '0.95rem', color: '#334155', lineHeight: '1.6', marginBottom: '1.25rem' }}>
              "As a solo clinic operator, I was answering patient inquiries at 9 PM every evening. G&J stepped in seamlessly and gave me back my weekends. Worth every single dollar."
            </p>
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
              <div style={{ fontWeight: '700', color: 'var(--color-primary-dark)' }}>Mark Henderson</div>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Director • Sydney Coastal Movement & Physio 🇦🇺</div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="faq-section section mt-4" style={{ padding: '3rem 1rem', borderRadius: '12px' }}>
        <h2 className="section-title text-center mb-4">Frequently Asked Questions</h2>
        <div className="grid" style={{ gap: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            <h4 style={{ color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>📅 How do you handle patient scheduling & diary management?</h4>
            <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: '1.5' }}>We integrate directly into your practice management software (such as Cliniko or Nookal). We triage new bookings, coordinate practitioner calendars, confirm follow-up slots, and fill short-notice cancellations.</p>
          </div>
          <div className="card" style={{ padding: '1.5rem' }}>
            <h4 style={{ color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>🔒 How is patient confidentiality and AHPRA compliance maintained?</h4>
            <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: '1.5' }}>Our administrative workflows operate strictly on operational frontdesk tasks. We never give clinical advice, diagnose conditions, or review protected medical treatment records, ensuring strict adherence to Privacy Act and AHPRA standards.</p>
          </div>
          <div className="card" style={{ padding: '1.5rem' }}>
            <h4 style={{ color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>📋 How quickly can our clinic onboard a VA?</h4>
            <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: '1.5' }}>Following our initial 20-minute discovery call and system access handover, your dedicated virtual assistant can be managing your inbox and diary within 48 to 72 business hours.</p>
          </div>
        </div>
      </section>

      <section className="lead-magnet-section section text-center mt-4" style={{ padding: '3rem 2rem', backgroundColor: '#e0f2fe', borderRadius: '12px', border: '1px solid #bae6fd' }}>
        <h2 className="section-title mb-2">🇦🇺 Practice Management Playbook</h2>
        <div className="placeholder-box">
          <h3 style={{ color: '#0284c7' }} className="mb-2">Free Clinic Operations Checklist</h3>
          <p style={{ color: '#0369a1', maxWidth: '600px', margin: '0 auto 1.5rem auto', lineHeight: '1.5' }}>
            Discover the 7 key administrative bottlenecks draining clinical revenue in Australian physiotherapy practices and how a dedicated VA solves them.
          </p>
          <a href="/contact" className="btn btn-primary" style={{ display: 'inline-block' }}>📋 Request Practice Checklist</a>
        </div>
      </section>
    </div>
  );
};

export default Home;
