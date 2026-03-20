'use client';

import React from 'react';

/**
 * LucStatusStrip — Global shell strip that shows:
 * - Active Boomer_Angs (count)
 * - LUC quota state (% used, warning, projected overage)
 * - Link to /workspace/luc
 * 
 * In production, this fetches from /api/luc/status.
 * For now, it renders a static representation.
 */
export function LucStatusStrip() {
  return (
    <div style={styles.strip}>
      <div style={styles.left}>
        <span style={styles.indicator}></span>
        <span style={styles.label}>CFO_Ang</span>
        <span style={styles.status}>Active</span>
        <span style={styles.divider}>|</span>
        <span style={styles.label}>Agents</span>
        <span style={styles.agentCount}>3</span>
      </div>
      <div style={styles.right}>
        <span style={styles.quotaLabel}>Deal Quota:</span>
        <span style={styles.quotaValue}>0 / 5 used</span>
        <span style={styles.divider}>|</span>
        <span style={styles.quotaLabel}>Balance:</span>
        <span style={styles.balanceValue}>$24.50 LUC</span>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  strip: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.75rem 1.25rem',
    background: 'rgba(0,0,0,0.5)',
    borderRadius: '12px',
    fontSize: '0.8rem',
    color: '#a1a1aa',
    border: '1px solid rgba(255,255,255,0.08)',
    marginBottom: '2rem',
    fontFamily: "'Inter', -apple-system, sans-serif",
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  indicator: {
    display: 'inline-block',
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    background: '#10b981',
    boxShadow: '0 0 8px #10b981',
  },
  label: {
    color: '#71717a',
    fontWeight: 500,
  },
  status: {
    color: '#10b981',
    fontWeight: 600,
  },
  divider: {
    color: 'rgba(255,255,255,0.1)',
    margin: '0 0.25rem',
  },
  agentCount: {
    color: '#60a5fa',
    fontWeight: 700,
  },
  quotaLabel: {
    color: '#71717a',
  },
  quotaValue: {
    color: '#d4d4d8',
  },
  balanceValue: {
    color: '#10b981',
    fontWeight: 600,
  },
};
