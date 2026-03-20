'use client';

import React, { useState } from 'react';
import { LucSimulationForm, type LucSimulationValues } from './LucSimulationForm';
import { LucResultsDashboard, type LucSimulationResult } from './LucResultsDashboard';
import { LucStatusStrip } from './LucStatusStrip';

/**
 * LucPanel — Primary workspace page component for the LUC Ledger Simulator.
 * Rendered at /workspace/luc or /dashboard/luc.
 * 
 * Demonstrates pre-flight estimations (Simulate) vs active transactions (Live).
 */
export function LucPanel() {
  const [results, setResults] = useState<LucSimulationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: LucSimulationValues) => {
    setLoading(true);
    setError(null);

    try {
      // In production, this matches the endpoint configured in api/luc.routes.ts
      const res = await fetch('/api/luc/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_key: values.service_key,
          units_estimate: values.units_estimate,
          context_factors: { has_pattern_match: values.has_pattern_match },
          isLive: values.isLive
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Simulation failed (${res.status})`);
      }

      const data = await res.json();
      setResults(data);
    } catch (err: any) {
      setError(err.message || 'Failed to simulate transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <LucStatusStrip />
      <div style={styles.header}>
        <h1 style={styles.title}>Ledger Usage Calculator (L.U.C)</h1>
        <p style={styles.subtitle}>
          Execute precise pre-flight gating analysis prior to Boomer_Ang delegation.
        </p>
      </div>
      <div style={styles.grid}>
        <LucSimulationForm onSubmit={handleSubmit} loading={loading} />
        <LucResultsDashboard data={results} error={error} />
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    minHeight: '100vh',
    padding: '2rem',
    background: '#09090b',
    color: '#fafafa',
    fontFamily: "'Inter', -apple-system, sans-serif",
  },
  header: {
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 700,
    background: 'linear-gradient(to right, #60a5fa, #3b82f6)',
    WebkitBackgroundClip: 'text', // Safe fallback style matching legacy definitions
    WebkitTextFillColor: 'transparent',
    marginBottom: '0.5rem',
  },
  subtitle: {
    color: '#a1a1aa',
    fontSize: '0.95rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.2fr',
    gap: '2rem',
  },
};

export default LucPanel;
