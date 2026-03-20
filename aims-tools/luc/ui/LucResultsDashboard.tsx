'use client';

import React from 'react';

export interface LucSimulationResult {
  simulation: {
    units_estimate: number;
    projected_used: number;
    projected_overage_units: number;
    confidence: number;
    discount_applied: boolean;
    discount_percentage: number;
    ui_breakdown: {
      service: string;
      cost_estimated: number;
      current_used: number;
      limit: number;
      discounts: string;
    }
  };
  isLive: boolean;
  liveGateResponse?: {
    allowed: boolean;
    reason_code: string;
    remaining_units: number;
    ui_banner: string | null;
  };
  liveRecordResponse?: any;
}

interface Props {
  data: LucSimulationResult | null;
  error: string | null;
}

export function LucResultsDashboard({ data, error }: Props) {
  if (error) {
    return (
      <div style={styles.card}>
        <div style={styles.errorBanner}>⛔ {error}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={styles.card}>
        <div style={styles.placeholder}>
          <span style={{ fontSize: '3rem' }}>📊</span>
          <p style={{ color: '#71717a', marginTop: '1rem' }}>
            Enter pre-flight parameters and hit Calculate to inspect Ledger Impact.
          </p>
        </div>
      </div>
    );
  }

  const { simulation, isLive, liveGateResponse } = data;
  const breakdwn = simulation.ui_breakdown;
  const usagePct = breakdwn.projected_used / breakdwn.limit;
  
  let gateStatus = '✅ OK';
  let gateColor = '#10b981';
  if (usagePct >= 1.10) {
    gateStatus = '⛔ HARD_BLOCK';
    gateColor = '#ef4444';
  } else if (usagePct >= 0.80) {
    gateStatus = '⚠️ SOFT_WARN';
    gateColor = '#f59e0b';
  }

  // Override string text if a live query occurred
  if (isLive && liveGateResponse) {
    gateStatus = liveGateResponse.allowed ? (usagePct >= 0.8 ? '⚠️ SOFT_WARN' : '✅ OK') : '⛔ BLOCKED BY CFO';
    gateColor = liveGateResponse.allowed ? (usagePct >= 0.8 ? '#f59e0b' : '#10b981') : '#ef4444';
  }

  const barWidth = Math.min(100, usagePct * 100);

  return (
    <div style={styles.card}>
      {/* Banner */}
      <div style={{ ...styles.banner, borderLeftColor: isLive ? '#ef4444' : '#a1a1aa' }}>
        <strong>Mode:</strong> {isLive ? 'Runtime (Ledger appending active)' : 'Telemetry (Simulation Mode)'}
        {isLive && liveGateResponse?.ui_banner && (
          <div style={{ marginTop: '0.5rem', color: '#fca5a5' }}>
            {liveGateResponse.ui_banner}
          </div>
        )}
      </div>

      {/* Main Cost */}
      <div style={styles.metricCard}>
        <div style={styles.metricTitle}>Unit Cost Estimate (Adjusted)</div>
        <div style={styles.metricValue}>
          {breakdwn.cost_estimated.toLocaleString()}
        </div>
        <div style={{ color: '#a1a1aa', fontSize: '0.85rem', marginTop: '0.5rem' }}>
          {breakdwn.discounts}
        </div>
      </div>

      {/* Quota Impact */}
      <div style={styles.row}>
        <div style={styles.metricCard}>
          <div style={styles.metricTitle}>Projected Usage</div>
          <div style={{...styles.metricValue, fontSize: '1.8rem'}}>
            {breakdwn.projected_used.toLocaleString()} <span style={{color:'#71717a', fontSize:'1rem'}}>/ {breakdwn.limit === 99999 ? '∞' : breakdwn.limit.toLocaleString()}</span>
          </div>
          
          <div style={styles.progressBarBg}>
            <div style={{ ...styles.progressBarFill, width: `${barWidth}%`, background: gateColor }}></div>
          </div>
        </div>
        <div style={styles.metricCard}>
          <div style={styles.metricTitle}>LUC Clearance Gate</div>
          <div style={{
            ...styles.metricValue,
            fontSize: '1.6rem',
            paddingTop: '0.5rem',
            color: gateColor,
          }}>
            {gateStatus}
          </div>
        </div>
      </div>

      {/* Orchestrator Logs */}
      <div style={{ marginTop: '1.5rem' }}>
        <h3 style={styles.insightsTitle}>Orchestrator Insights</h3>
        <ul style={styles.insightsList}>
          <li style={styles.insightItem}>
            <span style={{ color: '#3b82f6', marginRight: '0.5rem' }}>✦</span>
            Execution route verified for {breakdwn.service}
          </li>
          <li style={styles.insightItem}>
            <span style={{ color: '#3b82f6', marginRight: '0.5rem' }}>✦</span>
            {usagePct > 1.0 
              ? `Projected overage payload triggered: ${(breakdwn.projected_used - breakdwn.limit).toLocaleString()} units over limits.`
              : 'Execution securely within quota boundaries.'}
          </li>
          <li style={styles.insightItem}>
            <span style={{ color: '#3b82f6', marginRight: '0.5rem' }}>✦</span>
            {isLive 
              ? (liveGateResponse?.allowed 
                  ? 'Task actively passed gating limits. Usage logged.' 
                  : 'CFO_Ang aggressively blocked action from impacting quotas.')
              : (usagePct > 1.1 
                  ? 'CFO_Ang WILL HARD_BLOCK this trajectory if executed.' 
                  : 'Clearance ready for routing via Picker_Ang.')
            }
          </li>
        </ul>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: 'rgba(24, 24, 27, 0.65)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '24px',
    padding: '2rem',
    backdropFilter: 'blur(20px)',
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  placeholder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    textAlign: 'center',
  },
  errorBanner: {
    padding: '1rem',
    borderRadius: '12px',
    background: 'rgba(239,68,68,0.15)',
    border: '1px solid rgba(239,68,68,0.3)',
    color: '#fca5a5',
    fontSize: '0.9rem',
    textAlign: 'center',
  },
  banner: {
    padding: '1rem',
    background: 'rgba(0,0,0,0.5)',
    borderRadius: '12px',
    borderLeft: '4px solid',
    fontSize: '0.9rem',
    color: '#d4d4d8',
  },
  metricCard: {
    background: 'rgba(0,0,0,0.4)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    padding: '1.25rem',
  },
  metricTitle: {
    color: '#a1a1aa',
    fontSize: '0.8rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    marginBottom: '0.5rem',
  },
  metricValue: {
    fontSize: '2.5rem',
    fontWeight: 800,
    color: '#fafafa',
    wordBreak: 'break-all',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  progressBarBg: {
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '8px',
    height: '12px',
    width: '100%',
    marginTop: '1rem',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    transition: 'width 0.5s ease, background 0.3s ease',
  },
  insightsTitle: {
    fontSize: '0.85rem',
    color: '#fafafa',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    marginBottom: '0.75rem',
    fontWeight: 600,
  },
  insightsList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  insightItem: {
    color: '#a1a1aa',
    lineHeight: 1.6,
    marginBottom: '0.75rem',
    fontSize: '0.9rem',
  },
};
