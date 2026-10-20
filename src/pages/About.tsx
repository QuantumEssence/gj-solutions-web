
const About = () => {
  return (
    <div className="about-container fade-in">
      <div className="section-header text-center mb-4">
        <h1 className="section-title">About G&J Solutions</h1>
        <p className="section-subtitle" style={{ maxWidth: '650px', margin: '0 auto', color: '#e6f4f5' }}>
          Dedicated administrative and virtual practice support designed for independent physiotherapists across Australia
        </p>
      </div>

      <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
        <div className="about-content">
          <h2 style={{ color: '#ffffff', marginBottom: '1rem' }}>Our Purpose</h2>
          <p className="mb-3" style={{ color: '#f1f5f9', lineHeight: '1.6' }}>
            At G&J Solutions, we believe allied health practitioners should focus their time and energy on clinical care — helping patients recover and achieve their physical health goals — rather than spending hours each day on repetitive administration, calendar gaps, and phone follow-ups.
          </p>
          <p className="mb-3" style={{ color: '#f1f5f9', lineHeight: '1.6' }}>
            We provide dependable, privacy-conscious administrative support tailored to the specific operational rhythms of Australian physiotherapy clinics. By integrating directly into your practice management software such as Cliniko, Nookal, and Coreplus, we bridge frontdesk capacity gaps and establish structured practice workflows.
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
              <span style={{ fontWeight: 'bold' }}>Diary Coordination</span>
            </div>
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
              <span style={{ fontWeight: 'bold' }}>Privacy Conscious</span>
            </div>
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
              <span style={{ fontWeight: 'bold' }}>Intake & Referral Management</span>
            </div>
          </div>
        </div>
        
        <div className="about-image" style={{ border: '1px solid #cbd5e1', backgroundColor: '#ffffff', borderRadius: '12px', minHeight: '340px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#475569', textAlign: 'center', padding: '2.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <h3 style={{ fontWeight: '700', marginBottom: '0.75rem', color: 'var(--color-primary-dark)', fontSize: '1.25rem' }}>G&J Solutions Practice Team</h3>
          <p style={{ fontSize: '0.9rem', maxWidth: '340px', lineHeight: '1.6', color: '#64748b' }}>
            Experienced practice support professionals serving independent allied health and physiotherapy clinics across Sydney, Melbourne, Brisbane, and regional Australia.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
