import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Users, 
  CalendarCheck, 
  Archive, 
  TrendingUp, 
  Award, 
  Activity,
  Briefcase,
  PieChart,
  ShieldCheck,
  CheckCircle2,
  Layers
} from 'lucide-react';
import type { AnalyticsSummary, Inquiry } from './types';

interface AnalyticsOverviewProps {
  summary: AnalyticsSummary;
  activeCount: number;
  trashedCount: number;
  inquiries?: Inquiry[];
}

export const AnalyticsOverview: React.FC<AnalyticsOverviewProps> = ({
  summary,
  activeCount,
  trashedCount,
  inquiries = []
}) => {
  // Discovery call conversion rate calculation
  const totalLeads = summary.totalSubmissions > 0 ? summary.totalSubmissions : activeCount;
  const callConversionRate = totalLeads > 0 
    ? Math.round((summary.discoveryCalls / totalLeads) * 100) 
    : 0;

  // Pie chart calculation
  const spmcPercent = Math.min(100, Math.max(0, summary.spmcPercentage || 0));
  const nonSpmcPercent = 100 - spmcPercent;
  const nonSpmcCount = Math.max(0, totalLeads - summary.spmcCount);

  // SVG Donut metrics (Radius 64, Circumference ~402.12)
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const spmcStrokeDash = (spmcPercent / 100) * circumference;
  const nonSpmcStrokeDash = (nonSpmcPercent / 100) * circumference;

  // Interactive Hover State
  const [hoveredSegment, setHoveredSegment] = useState<'spmc' | 'non-spmc' | null>(null);

  // Service Package Distribution derived from inquiries
  const serviceDistribution = useMemo(() => {
    const list = inquiries.length > 0 ? inquiries : [];
    const counts: Record<string, number> = {
      'Desk Work only': 0,
      'Desk Work + Data gathering': 0,
      'Contract Review': 0,
      'Report preparation only': 0,
      'All Three': 0,
      'Other': 0
    };

    let total = 0;
    for (const item of list) {
      const s = item.service_interest?.trim() || 'Other';
      if (counts[s] !== undefined) {
        counts[s] = (counts[s] || 0) + 1;
      } else {
        counts['Other'] = (counts['Other'] || 0) + 1;
      }
      total++;
    }

    // Colors for each service type
    const palette: Record<string, string> = {
      'Desk Work only': '#0d9488', // teal
      'Desk Work + Data gathering': '#0284c7', // sky
      'Contract Review': '#6366f1', // indigo
      'Report preparation only': '#f59e0b', // amber
      'All Three': '#10b981', // emerald
      'Other': '#94a3b8' // slate
    };

    return Object.entries(counts)
      .filter(([, count]) => count > 0)
      .map(([name, count]) => ({
        name,
        count,
        percent: total > 0 ? Math.round((count / total) * 100) : 0,
        color: palette[name] || '#64748b'
      }));
  }, [inquiries]);

  return (
    <div className="card mb-4 admin-analytics-card">
      <div className="admin-analytics-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <h3 className="admin-card-title">
            <BarChart3 size={20} className="text-primary-light" />
            <span>Traffic & Practice Analytics</span>
          </h3>
          <span className="admin-report-ready-badge">
            <ShieldCheck size={13} />
            <span>🇦🇺 Report Ready • Allied Health Intake Standard</span>
          </span>
        </div>
        <div className="admin-status-badge">
          <Activity size={13} className="spin-slow" />
          <span>Live Metrics Active</span>
        </div>
      </div>

      {/* Traffic Impression Highlight */}
      <div className="admin-traffic-banner">
        <div className="admin-traffic-banner-title">Practice Traffic Monitor</div>
        <div className="admin-traffic-banner-desc">
          Live tracking active • Total page impressions recorded: <strong>{summary.totalViews.toLocaleString()}</strong>
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="admin-kpi-grid mt-4">
        <div className="admin-kpi-card">
          <div className="admin-kpi-icon-wrap" style={{ backgroundColor: '#e0f2fe', color: '#0369a1' }}>
            <Users size={18} />
          </div>
          <div className="admin-kpi-label">Unique Visitors</div>
          <div className="admin-kpi-value">{summary.uniqueVisitors.toLocaleString()}</div>
          <div className="admin-kpi-sub">Distinct clinic IPs</div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-icon-wrap" style={{ backgroundColor: '#dcfce7', color: '#15803d' }}>
            <TrendingUp size={18} />
          </div>
          <div className="admin-kpi-label">Active Inquiries</div>
          <div className="admin-kpi-value">{activeCount}</div>
          <div className="admin-kpi-sub">{summary.totalSubmissions} total logged</div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-icon-wrap" style={{ backgroundColor: '#fef3c7', color: '#b45309' }}>
            <CalendarCheck size={18} />
          </div>
          <div className="admin-kpi-label">Consultations Booked</div>
          <div className="admin-kpi-value">{summary.discoveryCalls}</div>
          <div className="admin-kpi-sub">
            <span className="admin-pill-highlight green">
              {callConversionRate}% Conv. Rate
            </span>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-icon-wrap" style={{ backgroundColor: '#f1f5f9', color: '#64748b' }}>
            <Archive size={18} />
          </div>
          <div className="admin-kpi-label">Archived Inquiries</div>
          <div className="admin-kpi-value" style={{ color: trashedCount > 0 ? '#b45309' : '#64748b' }}>
            {trashedCount}
          </div>
          <div className="admin-kpi-sub">Soft-deleted items</div>
        </div>
      </div>

      {/* SECTION 1: Interactive Demographic Pie Chart & Ratio Breakdown */}
      <div className="admin-demographic-section mt-4">
        <div className="admin-demographic-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PieChart size={18} className="text-emerald-700" />
            <h4 className="admin-demographic-title">Clinic Intake Demographics & SPMC Ratio</h4>
          </div>
          <span className="admin-demographic-sub">
            Evaluating practice partner tiers vs. independent Australian allied health clinics
          </span>
        </div>

        <div className="admin-demographic-grid">
          {/* Interactive SVG Donut Chart */}
          <div className="admin-pie-chart-wrapper">
            <div className="admin-svg-container">
              <svg 
                viewBox="0 0 200 200" 
                className="admin-pie-svg"
                role="img"
                aria-label="SPMC vs Non-SPMC leads ratio chart"
              >
                {/* Background Ring */}
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="transparent"
                  stroke="#f1f5f9"
                  strokeWidth="20"
                />

                {totalLeads > 0 ? (
                  <>
                    {/* SPMC Segment (Emerald) */}
                    <circle
                      cx="100"
                      cy="100"
                      r={radius}
                      fill="transparent"
                      stroke="#059669"
                      strokeWidth={hoveredSegment === 'spmc' ? '24' : '20'}
                      strokeDasharray={`${spmcStrokeDash} ${circumference}`}
                      strokeDashoffset="0"
                      transform="rotate(-90 100 100)"
                      className="pie-segment spmc-segment"
                      onMouseEnter={() => setHoveredSegment('spmc')}
                      onMouseLeave={() => setHoveredSegment(null)}
                      style={{ cursor: 'pointer', transition: 'all 0.25s ease' }}
                    />

                    {/* Independent / Non-SPMC Segment (Sky Blue) */}
                    <circle
                      cx="100"
                      cy="100"
                      r={radius}
                      fill="transparent"
                      stroke="#0284c7"
                      strokeWidth={hoveredSegment === 'non-spmc' ? '24' : '20'}
                      strokeDasharray={`${nonSpmcStrokeDash} ${circumference}`}
                      strokeDashoffset={`${-spmcStrokeDash}`}
                      transform="rotate(-90 100 100)"
                      className="pie-segment non-spmc-segment"
                      onMouseEnter={() => setHoveredSegment('non-spmc')}
                      onMouseLeave={() => setHoveredSegment(null)}
                      style={{ cursor: 'pointer', transition: 'all 0.25s ease' }}
                    />
                  </>
                ) : (
                  <circle
                    cx="100"
                    cy="100"
                    r={radius}
                    fill="transparent"
                    stroke="#cbd5e1"
                    strokeWidth="20"
                    strokeDasharray="4 4"
                  />
                )}

                {/* Center Percentage & Label */}
                <text
                  x="100"
                  y="94"
                  textAnchor="middle"
                  className="pie-center-value"
                >
                  {summary.spmcPercentage}%
                </text>
                <text
                  x="100"
                  y="114"
                  textAnchor="middle"
                  className="pie-center-label"
                >
                  SPMC Ratio
                </text>
              </svg>

              {/* Dynamic Interactive Tooltip */}
              {hoveredSegment && (
                <div className={`pie-tooltip ${hoveredSegment}`}>
                  {hoveredSegment === 'spmc' ? (
                    <div>
                      <strong>SPMC Affiliated:</strong> {summary.spmcCount} leads ({summary.spmcPercentage}%)
                    </div>
                  ) : (
                    <div>
                      <strong>Independent / Non-SPMC:</strong> {nonSpmcCount} leads ({nonSpmcPercent}%)
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Chart Legend */}
            <div className="admin-pie-legend">
              <div 
                className={`legend-item ${hoveredSegment === 'spmc' ? 'highlight' : ''}`}
                onMouseEnter={() => setHoveredSegment('spmc')}
                onMouseLeave={() => setHoveredSegment(null)}
              >
                <div className="legend-indicator" style={{ backgroundColor: '#059669' }} />
                <div className="legend-info">
                  <div className="legend-title">SPMC Affiliated</div>
                  <div className="legend-meta">
                    <strong>{summary.spmcCount}</strong> clinics ({summary.spmcPercentage}%)
                  </div>
                </div>
              </div>

              <div 
                className={`legend-item ${hoveredSegment === 'non-spmc' ? 'highlight' : ''}`}
                onMouseEnter={() => setHoveredSegment('non-spmc')}
                onMouseLeave={() => setHoveredSegment(null)}
              >
                <div className="legend-indicator" style={{ backgroundColor: '#0284c7' }} />
                <div className="legend-info">
                  <div className="legend-title">Independent Clinics</div>
                  <div className="legend-meta">
                    <strong>{nonSpmcCount}</strong> clinics ({nonSpmcPercent}%)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Strategic Insights & Service Package Distribution */}
          <div className="admin-distribution-container">
            <div className="admin-service-dist-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Layers size={16} className="text-teal-700" />
                <span className="dist-title">Service Package Distribution</span>
              </div>
              <span className="dist-lead-count">{activeCount} active inquiries</span>
            </div>

            {serviceDistribution.length === 0 ? (
              <div className="dist-empty-state">
                <span>No active service inquiries to map.</span>
              </div>
            ) : (
              <div>
                {/* Multi-segment Stacked Progress Bar */}
                <div className="admin-stacked-bar">
                  {serviceDistribution.map((item) => (
                    <div
                      key={item.name}
                      className="stacked-bar-segment"
                      style={{
                        width: `${item.percent}%`,
                        backgroundColor: item.color
                      }}
                      title={`${item.name}: ${item.count} (${item.percent}%)`}
                    />
                  ))}
                </div>

                {/* Service Package Legend Chips */}
                <div className="admin-service-chips-grid mt-3">
                  {serviceDistribution.map((item) => (
                    <div key={item.name} className="service-chip-item">
                      <div className="service-chip-dot" style={{ backgroundColor: item.color }} />
                      <div className="service-chip-text">
                        <span className="service-chip-name">{item.name}</span>
                        <span className="service-chip-val">
                          {item.count} ({item.percent}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Practice Benchmark Pill */}
            <div className="admin-benchmark-banner mt-3">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#14532d', fontWeight: 600, fontSize: '0.82rem' }}>
                <CheckCircle2 size={14} className="text-emerald-600" />
                <span>Highest Demand Package:</span>
                <span className="benchmark-highlight">{summary.topService || 'Desk Work only'}</span>
              </div>
              <p className="benchmark-note">
                Leading operational request across Victorian & New South Wales private physiotherapy clinics.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Strategic Practice Performance Insights Banner */}
      <div className="admin-insights-banner mt-4">
        <div className="admin-insight-col">
          <div className="admin-insight-header">
            <Award size={16} className="text-emerald-700" />
            <span className="admin-insight-title">SPMC Partner Program Health</span>
          </div>
          <div className="admin-insight-data">
            <span className="admin-insight-metric">
              {summary.spmcCount} <span className="admin-insight-total">/ {totalLeads}</span>
            </span>
            <span className="admin-pill-badge spmc">
              {summary.spmcPercentage}% Partner Proportion
            </span>
          </div>
          <div className="admin-insight-desc">
            Directly qualify for South Perth Medical Centre partner-level services and referral priority.
          </div>
        </div>

        <div className="admin-insight-divider" />

        <div className="admin-insight-col">
          <div className="admin-insight-header">
            <Briefcase size={16} className="text-emerald-700" />
            <span className="admin-insight-title">Highest Demand Service</span>
          </div>
          <div className="admin-insight-data">
            <span className="admin-insight-metric service-name">{summary.topService || 'None'}</span>
          </div>
          <div className="admin-insight-desc">
            Leading area of interest for Australian physiotherapy clinics.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsOverview;
