import { Link } from 'react-router-dom';
import { FileCheck, ArrowLeft, AlertTriangle } from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="legal-page-container fade-in" style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '4rem' }}>
      <div className="mb-4">
        <Link 
          to="/" 
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', fontWeight: 500, fontSize: '0.95rem' }}
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </div>

      <div className="card mb-4" style={{ padding: '2.5rem', borderLeft: '5px solid var(--color-primary-dark)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ backgroundColor: 'var(--color-primary-subtle)', color: 'var(--color-primary-dark)', padding: '0.5rem', borderRadius: '8px' }}>
            <FileCheck size={28} />
          </div>
          <div>
            <h1 style={{ fontSize: '2rem', color: 'var(--color-primary-dark)', marginBottom: '0.25rem' }}>Practice Support Terms of Service</h1>
            <p style={{ margin: 0, color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
              Standard Service Agreement for Australian Allied Health & Physiotherapy Practices • Last Updated: October 2026
            </p>
          </div>
        </div>

        <p style={{ lineHeight: '1.7', color: 'var(--color-text-muted)', marginTop: '1rem' }}>
          These Terms of Service ("Agreement") govern the engagement between G&J Solutions ("Service Provider", "we", "us") and the allied health, physiotherapy, or physical rehabilitation clinic ("Client Clinic", "you") engaging our virtual practice management and administrative support services.
        </p>
      </div>

      <div className="card mb-4" style={{ padding: '2.5rem' }}>
        <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '1.25rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <AlertTriangle size={22} style={{ color: '#d97706', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ color: '#92400e', display: 'block', marginBottom: '0.25rem' }}>
                Mandatory Clinical Responsibility Disclaimer
              </strong>
              <p style={{ fontSize: '0.9rem', color: '#78350f', margin: 0, lineHeight: 1.5 }}>
                G&J Solutions provides non-clinical administrative and practice coordination services only. G&J Solutions is not a registered medical clinic, does not employ treating clinicians on behalf of patients, and does not provide physical therapy, medical diagnosis, triage, or clinical decision-making. 
                The Client Clinic and its AHPRA-registered healthcare practitioners retain sole legal, professional, and ethical responsibility for patient diagnosis, care pathways, and clinical record documentation.
              </p>
            </div>
          </div>
        </div>

        <h2 style={{ fontSize: '1.35rem', color: 'var(--color-primary-dark)', marginBottom: '1rem' }}>
          1. Scope of Administrative Services
        </h2>
        <p style={{ lineHeight: '1.7', color: 'var(--color-text-muted)' }}>
          G&J Solutions provides authorized operational services according to the selected practice support package:
        </p>
        <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.8', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
          <li><strong>Frontdesk & Diary Coordination:</strong> Managing clinician diaries within Cliniko, Nookal, or Coreplus, responding to patient booking inquiries, triaging waitlists, and rebooking cancellations.</li>
          <li><strong>Patient Intake & Document Triage:</strong> Distributing digital intake questionnaires, verifying referral details (e.g., GP Management Plans / Team Care Arrangements), and tracking documentation completeness.</li>
          <li><strong>Operational Agreement Assessment:</strong> Providing plain-language administrative reviews of clinic operational workflows, equipment agreements, or contractor templates. <em>This does not constitute formal legal counsel or convey attorney-client privilege.</em></li>
        </ul>

        <h2 style={{ fontSize: '1.35rem', color: 'var(--color-primary-dark)', marginTop: '2rem', marginBottom: '1rem' }}>
          2. Explicit Non-Scope Activities
        </h2>
        <p style={{ lineHeight: '1.7', color: 'var(--color-text-muted)' }}>
          To ensure strict regulatory and statutory compliance, G&J Solutions personnel will not under any circumstance:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '8px', padding: '1rem' }}>
            <span style={{ color: '#991b1b', fontWeight: 600, fontSize: '0.9rem', display: 'block', marginBottom: '0.25rem' }}>No Clinical Interventions</span>
            <p style={{ fontSize: '0.85rem', color: '#7f1d1d', margin: 0 }}>Giving clinical advice, evaluating symptoms, or altering clinical SOAP/treatment notes.</p>
          </div>
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '8px', padding: '1rem' }}>
            <span style={{ color: '#991b1b', fontWeight: 600, fontSize: '0.9rem', display: 'block', marginBottom: '0.25rem' }}>No Tax or BAS Filing</span>
            <p style={{ fontSize: '0.85rem', color: '#7f1d1d', margin: 0 }}>Filing business activity statements (BAS), corporate tax returns, or providing financial advice.</p>
          </div>
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '8px', padding: '1rem' }}>
            <span style={{ color: '#991b1b', fontWeight: 600, fontSize: '0.9rem', display: 'block', marginBottom: '0.25rem' }}>No Banking Credential Storage</span>
            <p style={{ fontSize: '0.85rem', color: '#7f1d1d', margin: 0 }}>Storing primary banking passwords, direct debit authorisations, or reconciling merchant accounts.</p>
          </div>
        </div>

        <h2 style={{ fontSize: '1.35rem', color: 'var(--color-primary-dark)', marginTop: '2.5rem', marginBottom: '1rem' }}>
          3. Systems Access & Security Obligations
        </h2>
        <p style={{ lineHeight: '1.7', color: 'var(--color-text-muted)' }}>
          The Client Clinic agrees to provision individual user profiles for designated G&J Solutions personnel within the clinic's Practice Management Software. Shared master administrator passwords must never be provided. The Client Clinic retains the right to modify or revoke user permissions at any time.
        </p>
        <p style={{ lineHeight: '1.7', color: 'var(--color-text-muted)' }}>
          G&J Solutions mandates that all staff maintain multi-factor authentication (MFA), encrypted hardware endpoints, and adhere to strict clean-desk policies with no unauthorized copying or downloading of clinic data.
        </p>

        <h2 style={{ fontSize: '1.35rem', color: 'var(--color-primary-dark)', marginTop: '2.5rem', marginBottom: '1rem' }}>
          4. Clinic Confidentiality & Data Protection
        </h2>
        <p style={{ lineHeight: '1.7', color: 'var(--color-text-muted)' }}>
          Both parties agree to treat all business information, patient details, clinic fee schedules, and practitioner operational data as strictly confidential. This obligation survives termination of this Agreement indefinitely.
        </p>

        <h2 style={{ fontSize: '1.35rem', color: 'var(--color-primary-dark)', marginTop: '2.5rem', marginBottom: '1rem' }}>
          5. Australian Consumer Law & Governing Jurisdiction
        </h2>
        <p style={{ lineHeight: '1.7', color: 'var(--color-text-muted)' }}>
          Nothing in this Agreement excludes, restricts, or modifies any consumer rights or statutory guarantees provided under Schedule 2 of the <em>Competition and Consumer Act 2010 (Cth)</em> (Australian Consumer Law). This Agreement is governed by the laws in force in the State of Victoria, Australia, and each party submits to the non-exclusive jurisdiction of its courts.
        </p>

        <div style={{ borderTop: '1px solid var(--color-border)', marginTop: '2rem', paddingTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-light)' }}>
            Questions regarding our engagement terms? Email <a href="mailto:admin@gjsolutions.com.au" style={{ color: 'var(--color-primary)', fontWeight: 500 }}>admin@gjsolutions.com.au</a>
          </div>
          <Link to="/contact" className="btn btn-primary" style={{ fontSize: '0.9rem', padding: '0.6rem 1.25rem' }}>
            Inquire for Practice Engagement
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
