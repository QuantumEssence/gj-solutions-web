
const About = () => {
  return (
    <div className="about-container fade-in">
      <div className="section-header text-center mb-4">
        <h1 className="section-title">🇦🇺 About G&J Solutions</h1>
        <p className="section-subtitle" style={{ maxWidth: '650px', margin: '0 auto', color: '#e6f4f5' }}>
          Dedicated administrative and virtual practice support tailored specifically for independent physiotherapists across Australia 🩺
        </p>
      </div>

      <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
        <div className="about-content">
          <h2 style={{ color: '#ffffff', marginBottom: '1rem' }}>Our Mission 🩺</h2>
          <p className="mb-3" style={{ color: '#f1f5f9', lineHeight: '1.6' }}>
            At G&J Solutions, we believe allied health practitioners should spend their energy helping patients move better and recover faster — not burning midnight oil on repetitive diary management, follow-up emails, and intake forms.
          </p>
          <p className="mb-3" style={{ color: '#f1f5f9', lineHeight: '1.6' }}>
            We provide dependable, AHPRA-aware administrative support designed around the workflows of Australian physiotherapy clinics. By seamlessly coordinating with your practice management software (such as Cliniko or Nookal), we bridge frontdesk gaps, protect patient privacy, and help your clinic grow sustainably. 🔒
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
              <span style={{ fontWeight: 'bold' }}>📅 Diary Efficiency</span>
            </div>
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
              <span style={{ fontWeight: 'bold' }}>🔒 AHPRA Conscious</span>
            </div>
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
              <span style={{ fontWeight: 'bold' }}>📋 Clinic Data Intake</span>
            </div>
          </div>
        </div>
        
        <div className="about-image" style={{ border: '2px dashed #cbd5e1', backgroundColor: '#f8fafc', borderRadius: '12px', height: '380px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#64748b', textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🩺</div>
          <p style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--color-primary-dark)' }}>Meet the G&J Solutions Team</p>
          <p style={{ fontSize: '0.85rem', maxWidth: '300px' }}>Dedicated virtual practice specialists committed to supporting Australian allied health professionals nationwide. 🇦🇺</p>
        </div>
      </div>
    </div>
  );
};

export default About;
