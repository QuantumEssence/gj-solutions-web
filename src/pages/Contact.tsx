import { AlertTriangle } from 'lucide-react';
import { ContactForm } from '../features/contact';

const Contact = () => {
  return (
    <div className="contact-page fade-in" style={{ paddingBottom: '4rem' }}>
      {/* Page Header (Screenshot 10_07_40 PM) */}
      <div className="section-header text-center mb-4" style={{ paddingTop: '1.5rem' }}>
        <h1 
          className="section-title" 
          style={{ 
            color: '#2A7B7E', 
            fontSize: '2.5rem', 
            fontWeight: 700, 
            marginBottom: '0.75rem' 
          }}
        >
          Get in Touch
        </h1>
        <p 
          className="section-subtitle" 
          style={{ 
            maxWidth: '640px', 
            margin: '0 auto 2.5rem auto', 
            fontSize: '1.05rem', 
            lineHeight: '1.6', 
            color: '#4a5568' 
          }}
        >
          Please fill out the questionnaire below so we can understand your needs before connecting.
        </p>
      </div>

      {/* Privacy Restriction Banner (Screenshot 10_07_40 PM) */}
      <div
        className="privacy-banner mb-4"
        style={{
          backgroundColor: '#FFF5F5',
          border: '1px solid #FED7D7',
          padding: '1.25rem 1.5rem',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '1rem',
          maxWidth: '720px',
          margin: '0 auto 2.5rem auto',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
        }}
      >
        <AlertTriangle size={24} style={{ flexShrink: 0, marginTop: '2px', color: '#DC2626' }} />
        <div>
          <strong 
            style={{ 
              display: 'block', 
              marginBottom: '0.25rem', 
              fontSize: '1rem', 
              fontWeight: 700,
              color: '#C53030' 
            }}
          >
            Strict Data Privacy Restriction
          </strong>
          <p style={{ margin: 0, fontSize: '0.925rem', lineHeight: '1.5', color: '#9B2C2C' }}>
            Do not submit any live patient health information or medical records through this form. This system is strictly for business inquiries.
          </p>
        </div>
      </div>

      {/* Contact Form Container */}
      <ContactForm />
    </div>
  );
};

export default Contact;
