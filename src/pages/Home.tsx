import './Home.css';

const Home = () => {
  return (
    <div className="home-container fade-in">
      <section className="hero-section section text-center">
        <h1 className="hero-title">G&J Solutions</h1>
        <p className="hero-subtitle">
          Dedicated Practice Support & Virtual Assistants for Australian Physiotherapists
        </p>
        <p className="mb-4" style={{ maxWidth: '680px', margin: '0 auto', lineHeight: '1.6' }}>
          We partner with independent physiotherapy and allied health clinics across Australia to streamline administrative operations. From patient scheduling and intake triage to diary optimization in Cliniko and Nookal, our team ensures your clinicians focus entirely on delivering exceptional patient care.
        </p>
        <div className="cta-buttons" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
          <a href="/contact" className="btn btn-primary">Schedule a Consultation</a>
          <a href="/services" className="btn btn-outline">Explore Services</a>
        </div>
      </section>

      <section className="value-prop-section section mt-4">
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          <div className="card text-center">
            <h3 className="card-title">Maximized Clinical Capacity</h3>
            <p className="card-body">Keep treatment schedules full and minimize gaps. Delegate intake processing, recall confirmations, and general GP correspondence to your dedicated assistant.</p>
          </div>
          <div className="card text-center">
            <h3 className="card-title">Proactive Diary Coordination</h3>
            <p className="card-body">Eliminate the cost of missed calls and unfilled cancellations across Cliniko, Nookal, and Coreplus through responsive waitlist triage and patient communication.</p>
          </div>
          <div className="card text-center">
            <h3 className="card-title">Rigorous Privacy & Governance</h3>
            <p className="card-body">Our team operates under strict Australian Privacy Principles (APPs) and operational protocols, providing reliable administrative support without clinical overreach.</p>
          </div>
        </div>
      </section>

      <section className="software-section section">
        <h2 className="section-title text-center">Clinical Systems & Software Proficiency</h2>
        <p className="text-center mb-4">Experienced with the practice management platforms Australian clinics rely on every day.</p>
        <div className="software-logos">
          <div className="software-badge">CLINIKO</div>
          <div className="software-badge">NOOKAL</div>
          <div className="software-badge">COREPLUS</div>
          <div className="software-badge">JUSTCALL</div>
          <div className="software-badge">MICROSOFT 365</div>
          <div className="software-badge">GOOGLE WORKSPACE</div>
        </div>
      </section>

      <section className="testimonials-section section">
        <h2 className="section-title text-center mb-4">Client Feedback & Clinical Outcomes</h2>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.75rem', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
            <p style={{ fontStyle: 'italic', fontSize: '0.95rem', color: '#334155', lineHeight: '1.6', marginBottom: '1.25rem' }}>
              "Partnering with G&J Solutions restored order to our daily clinic schedule. Diary gaps decreased noticeably within our first quarter because cancellations were triaged and filled proactively."
            </p>
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
              <div style={{ fontWeight: '700', color: 'var(--color-primary-dark)' }}>Dr. Lachlan Murphy, B.Physio</div>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Clinical Director • Melbourne Sports Physiotherapy</div>
            </div>
          </div>
          
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.75rem', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
            <p style={{ fontStyle: 'italic', fontSize: '0.95rem', color: '#334155', lineHeight: '1.6', marginBottom: '1.25rem' }}>
              "Our reception was burdened with intake management and GP documentation. Having reliable, privacy-conscious administrative support handling our communications has given our practitioners their evenings back."
            </p>
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
              <div style={{ fontWeight: '700', color: 'var(--color-primary-dark)' }}>Sarah Jennings, APAM</div>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Principal Physiotherapist • Brisbane Rehabilitation Care</div>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.75rem', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
            <p style={{ fontStyle: 'italic', fontSize: '0.95rem', color: '#334155', lineHeight: '1.6', marginBottom: '1.25rem' }}>
              "As a private practitioner managing high caseloads, handling administrative calls between consults was unsustainable. G&J Solutions stepped in smoothly and established consistent practice operations."
            </p>
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
              <div style={{ fontWeight: '700', color: 'var(--color-primary-dark)' }}>Mark Henderson</div>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Director • Sydney Coastal Movement & Physiotherapy</div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="faq-section section mt-4" style={{ padding: '3rem 1rem', borderRadius: '12px' }}>
        <h2 className="section-title text-center mb-4">Frequently Asked Questions</h2>
        <div className="grid" style={{ gap: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            <h4 style={{ color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>How does diary management integrate with our practice software?</h4>
            <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: '1.5' }}>We integrate securely with your existing practice management software, including Cliniko, Nookal, and Coreplus. Our assistants manage appointment bookings, practitioner calendars, recall lists, and short-notice cancellation fills following your clinic protocols.</p>
          </div>
          <div className="card" style={{ padding: '1.5rem' }}>
            <h4 style={{ color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>How is patient confidentiality maintained?</h4>
            <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: '1.5' }}>Our administrative workflows adhere strictly to the Australian Privacy Principles (APPs). We handle only non-clinical operational tasks such as scheduling and intake distribution. We do not provide clinical advice or alter clinical treatment notes.</p>
          </div>
          <div className="card" style={{ padding: '1.5rem' }}>
            <h4 style={{ color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>What is the onboarding timeline for a new clinic?</h4>
            <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: '1.5' }}>Following our initial consultation and software access setup, our dedicated support team can be actively coordinating your calendar and communications within 48 to 72 business hours.</p>
          </div>
        </div>
      </section>

      <section className="lead-magnet-section section text-center mt-4" style={{ padding: '3rem 2rem', backgroundColor: '#e0f2fe', borderRadius: '12px', border: '1px solid #bae6fd' }}>
        <h2 className="section-title mb-2">Practice Operations Assessment</h2>
        <div className="placeholder-box">
          <h3 style={{ color: '#0284c7' }} className="mb-2">Complimentary Practice Workflow Audit</h3>
          <p style={{ color: '#0369a1', maxWidth: '600px', margin: '0 auto 1.5rem auto', lineHeight: '1.5' }}>
            Identify administrative bottlenecks impacting your clinic's capacity and learn how dedicated practice support can recover billable clinician hours.
          </p>
          <a href="/contact" className="btn btn-primary" style={{ display: 'inline-block' }}>Request Practice Assessment</a>
        </div>
      </section>
    </div>
  );
};

export default Home;
