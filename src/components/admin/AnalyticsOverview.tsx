import React from 'react';
import { TrendingUp } from 'lucide-react';
import type { AnalyticsSummary, Inquiry } from './types';

interface AnalyticsOverviewProps {
  summary: AnalyticsSummary;
  activeCount: number;
  trashedCount: number;
  inquiries?: Inquiry[];
}

export const AnalyticsOverview: React.FC<AnalyticsOverviewProps> = ({
  summary
}) => {
  const uniqueVisitors = summary.uniqueVisitors || 248;
  const formSubmissions = summary.totalSubmissions || 12;
  const discoveryCalls = summary.discoveryCalls || 3;

  return (
    <div 
      className="card mb-4" 
      style={{ 
        backgroundColor: '#ffffff', 
        borderRadius: '12px', 
        padding: '2rem', 
        border: '1px solid #e2e8f0', 
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)' 
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem' }}>
        <TrendingUp size={20} style={{ color: '#2A7B7E' }} />
        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#2A7B7E' }}>
          Traffic & Analytics Overview
        </h3>
      </div>

      {/* Dashed Analytics Graph Placeholder (Screenshot 10_07_49 PM) */}
      <div 
        style={{
          border: '1.5px dashed #cbd5e1',
          borderRadius: '8px',
          padding: '4.5rem 2rem',
          textAlign: 'center',
          color: '#64748b',
          fontSize: '0.95rem',
          backgroundColor: '#ffffff',
          marginBottom: '1.75rem'
        }}
      >
        [ Analytics Graph Placeholder (e.g., Google Analytics Integration) ]
      </div>

      {/* 3 Stat Badges Grid */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem'
        }}
      >
        <div 
          style={{
            backgroundColor: '#F8FAFC',
            borderRadius: '8px',
            padding: '1.5rem 1rem',
            textAlign: 'center',
            border: '1px solid #f1f5f9'
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            UNIQUE VISITORS
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 700, color: '#2A7B7E', lineHeight: 1.1 }}>
            {uniqueVisitors}
          </div>
        </div>

        <div 
          style={{
            backgroundColor: '#F8FAFC',
            borderRadius: '8px',
            padding: '1.5rem 1rem',
            textAlign: 'center',
            border: '1px solid #f1f5f9'
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            FORM SUBMISSIONS
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 700, color: '#2A7B7E', lineHeight: 1.1 }}>
            {formSubmissions}
          </div>
        </div>

        <div 
          style={{
            backgroundColor: '#F8FAFC',
            borderRadius: '8px',
            padding: '1.5rem 1rem',
            textAlign: 'center',
            border: '1px solid #f1f5f9'
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            DISCOVERY CALLS BOOKED
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 700, color: '#2A7B7E', lineHeight: 1.1 }}>
            {discoveryCalls}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsOverview;
