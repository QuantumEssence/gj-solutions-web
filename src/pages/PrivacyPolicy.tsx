import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, FileText, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';

const PrivacyPolicy = () => {
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
            <ShieldCheck size={28} />
          </div>
          <div>
            <h1 style={{ fontSize: '2rem', color: 'var(--color-primary-dark)', marginBottom: '0.25rem' }}>Privacy & Data Governance Policy</h1>
            <p style={{ margin: 0, color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
              Compliance with the <em>Privacy Act 1988 (Cth)</em> and Australian Privacy Principles (APPs) • Last Updated: October 2026
            </p>
          </div>
        </div>

        <div style={{ backgroundColor: '#f0fdfa', border: '1px solid #99f6e4', borderRadius: '8px', padding: '1.25rem', marginTop: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <AlertCircle size={22} style={{ color: '#0f766e', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ color: '#115e59', display: 'block', marginBottom: '0.25rem' }}>
                Strict Non-Clinical & Zero-PHI Local Storage Guarantee
              </strong>
              <p style={{ fontSize: '0.9rem', color: '#134e4a', margin: 0, lineHeight: 1.5 }}>
                G&J Solutions operates solely as an outsourced administrative contractor to Australian physiotherapy and allied health clinics. 
                We do not collect, retain, sell, or host Patient Health Information (PHI) on our own proprietary servers. All patient interactions, bookings, and appointment coordination are executed directly inside the client clinic's authenticated Practice Management Software (e.g. Cliniko, Nookal, Coreplus) via least-privilege, multi-factor authenticated (MFA) credentials.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-4" style={{ padding: '2.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', color: 'var(--color-primary-dark)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Lock size={20} /> 1. Commitment to Australian Privacy Principles (APPs)
        </h2>
        <p style={{ lineHeight: '1.7', color: 'var(--color-text-muted)' }}>
          G&J Solutions recognizes the paramount importance of safeguarding personal and health information within the Australian healthcare ecosystem. We adhere strictly to the 13 Australian Privacy Principles contained in Schedule 1 of the <em>Privacy Act 1988 (Cth)</em>, the <em>My Health Records Act 2012</em>, and the guidelines set forth by the Office of the Australian Information Commissioner (OAIC).
        </p>

        <h3 style={{ fontSize: '1.15rem', color: 'var(--color-text)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
          APP 1 — Open and Transparent Management
        </h3>
        <p style={{ lineHeight: '1.7', color: 'var(--color-text-muted)' }}>
          We maintain transparent records regarding how administrative support is carried out. Clinicians retain continuous audit oversight of all actions taken in their practice management software through system activity logs.
        </p>

        <h3 style={{ fontSize: '1.15rem', color: 'var(--color-text)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
          APP 3 & APP 6 — Collection, Use and Disclosure of Sensitive Health Data
        </h3>
        <p style={{ lineHeight: '1.7', color: 'var(--color-text-muted)' }}>
          We only handle personal and sensitive health data (e.g., patient contact details, GP referral documentation, EPC/CDM referral numbers, and treatment appointment types) for the primary operational purpose of calendar scheduling, appointment confirmations, and practice administration. Data is never disclosed to unauthorized third parties or secondary marketing systems under any circumstance.
        </p>

        <h3 style={{ fontSize: '1.15rem', color: 'var(--color-text)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
          APP 11 — Security of Personal Information & Technical Measures
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary-dark)', fontWeight: 600, marginBottom: '0.25rem' }}>
              <CheckCircle size={16} /> Zero Local Downloads
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-light)', margin: 0 }}>
              Staff workstations are configured to prohibit local downloading, exporting, or printing of patient records or identifying documents.
            </p>
          </div>
          <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary-dark)', fontWeight: 600, marginBottom: '0.25rem' }}>
              <CheckCircle size={16} /> Multi-Factor Authentication
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-light)', margin: 0 }}>
              All access to clinic practice management software requires authenticated MFA and individual practitioner-managed accounts.
            </p>
          </div>
          <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary-dark)', fontWeight: 600, marginBottom: '0.25rem' }}>
              <CheckCircle size={16} /> Confidentiality Deeds
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-light)', margin: 0 }}>
              All team members execute comprehensive confidentiality and non-disclosure agreements prior to engaging with any clinic account.
            </p>
          </div>
        </div>
      </div>

      <div className="card mb-4" style={{ padding: '2.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', color: 'var(--color-primary-dark)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText size={20} /> 2. Non-Clinical Disclaimer & Scope Boundaries
        </h2>
        <p style={{ lineHeight: '1.7', color: 'var(--color-text-muted)' }}>
          G&J Solutions explicitly differentiates administrative practice support from healthcare service delivery:
        </p>
        <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.8', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
          <li><strong>No Clinical Advice:</strong> Our staff are practice management specialists and do not provide medical diagnosis, clinical triage, symptom assessment, or therapy recommendations.</li>
          <li><strong>No Clinical Note Alterations:</strong> Our assistants never edit, create, or alter clinical treatment notes, objective assessment measures, or physiotherapy SOAP notes.</li>
          <li><strong>Emergency Protocol:</strong> If a patient indicates acute pain, trauma, red-flag symptoms, or medical emergencies, staff immediately follow the clinic's escalation policy or direct the caller to call 000 / present to the nearest hospital emergency department.</li>
        </ul>

        <h2 style={{ fontSize: '1.4rem', color: 'var(--color-primary-dark)', marginBottom: '1rem' }}>
          3. Notifiable Data Breaches (NDB) Scheme
        </h2>
        <p style={{ lineHeight: '1.7', color: 'var(--color-text-muted)' }}>
          In accordance with Part IIIC of the <em>Privacy Act 1988</em>, G&J Solutions maintains an established Incident Response Procedure. In the unlikely event of an eligible data breach or unauthorized system incident involving clinic data, the affected clinic's nominated Privacy Officer will be alerted within 24 hours to coordinate appropriate notifications to the OAIC and affected individuals.
        </p>

        <h2 style={{ fontSize: '1.4rem', color: 'var(--color-primary-dark)', marginTop: '2rem', marginBottom: '1rem' }}>
          4. Contacting Our Privacy Officer
        </h2>
        <p style={{ lineHeight: '1.7', color: 'var(--color-text-muted)' }}>
          For inquiries regarding our compliance policies or to submit a privacy request:
        </p>
        <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
          <strong>Privacy Officer — G&J Solutions</strong><br />
          Email: <a href="mailto:privacy@gjsolutions.com.au" style={{ color: 'var(--color-primary)', fontWeight: 500 }}>privacy@gjsolutions.com.au</a><br />
          Location: Melbourne, Victoria, Australia<br />
          Official Oversight: Office of the Australian Information Commissioner (<a href="https://www.oaic.gov.au" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)' }}>www.oaic.gov.au</a>)
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
