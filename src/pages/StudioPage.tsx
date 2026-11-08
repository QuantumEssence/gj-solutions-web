import React from 'react';
import { Studio } from 'sanity';
import config from '../sanity/sanity.config';
import { isSanityConfigured } from '../sanity/client';
import { Link } from 'react-router-dom';
import { ExternalLink, Settings, ArrowLeft } from 'lucide-react';

const StudioPage: React.FC = () => {
  if (!isSanityConfigured) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ maxWidth: '640px', background: '#FFFFFF', border: '1px solid #CCFBF1', borderRadius: '1rem', padding: '2.5rem', boxShadow: '0 10px 25px -5px rgba(13, 148, 136, 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#0F766E', marginBottom: '1rem' }}>
            <Settings className="w-8 h-8 text-teal-600" />
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Sanity CMS Studio Setup</h1>
          </div>
          <p style={{ color: '#4B5563', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Sanity Modular Block Architecture is ready in the codebase! To connect your live cloud content repository and enable the visual Studio editor:
          </p>
          <div style={{ background: '#F0FDFA', borderLeft: '4px solid #0D9488', padding: '1rem', borderRadius: '0.375rem', marginBottom: '1.5rem' }}>
            <p style={{ margin: 0, fontSize: '0.875rem', fontFamily: 'monospace', color: '#134E48' }}>
              1. Add your project ID to <strong>.env</strong>:<br />
              <code>VITE_SANITY_PROJECT_ID=your_sanity_project_id</code><br />
              <code>VITE_SANITY_DATASET=production</code>
            </p>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '2rem' }}>
            In the meantime, the website is gracefully serving the pre-configured modular blocks so your pages will never break.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a
              href="https://www.sanity.io/manage"
              target="_blank"
              rel="noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#0D9488', color: '#fff', padding: '0.75rem 1.25rem', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: 600 }}
            >
              Open Sanity.io Manage <ExternalLink className="w-4 h-4" />
            </a>
            <Link
              to="/admin"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#F3F4F6', color: '#374151', padding: '0.75rem 1.25rem', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: 600 }}
            >
              <ArrowLeft className="w-4 h-4" /> Return to Admin
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', width: '100vw', position: 'fixed', top: 0, left: 0, zIndex: 9999 }}>
      <Studio config={config} />
    </div>
  );
};

export default StudioPage;
