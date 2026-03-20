'use client';

import React, { useState } from 'react';

export interface LucSimulationValues {
  service_key: string;
  units_estimate: number;
  has_pattern_match: boolean;
  isLive: boolean; // if true, it hits the CFO_Ang execute + record
}

interface Props {
  onSubmit: (values: LucSimulationValues) => void;
  loading: boolean;
}

export function LucSimulationForm({ onSubmit, loading }: Props) {
  const [values, setValues] = useState<LucSimulationValues>({
    service_key: 'llm_tokens_in',
    units_estimate: 15000,
    has_pattern_match: true,
    isLive: false,
  });

  const handleChange = (field: keyof LucSimulationValues) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    let val: any = e.target.value;
    if (e.target.type === 'number') val = parseFloat(val) || 0;
    if (e.target.type === 'checkbox') val = (e.target as HTMLInputElement).checked;
    
    setValues(prev => ({ ...prev, [field]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.card}>
      <h2 style={styles.cardTitle}>Ledger Simulation Setup</h2>
      <p style={styles.subtitle}>Configure pre-flight capability tests.</p>

      <div style={styles.formGroup}>
        <label style={styles.label}>Service Capability Route</label>
        <select
          value={values.service_key}
          onChange={handleChange('service_key')}
          style={styles.input}
        >
          <option value="llm_tokens_in">LLM Tokens (Inbound)</option>
          <option value="llm_tokens_out">LLM Tokens (Outbound)</option>
          <option value="brave_queries">Brave Search Queries</option>
          <option value="n8n_executions">n8n Workflow Executions</option>
          <option value="swarm_cycles">Swarm Agent Cycles</option>
          <option value="container_hours">Container Hours</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Estimated Units Transacted</label>
        <input
          type="number"
          min="1"
          value={values.units_estimate}
          onChange={handleChange('units_estimate')}
          style={styles.input}
        />
      </div>

      <div style={styles.checkboxGroup}>
        <input
          type="checkbox"
          id="pattern"
          checked={values.has_pattern_match}
          onChange={handleChange('has_pattern_match')}
        />
        <label htmlFor="pattern" style={styles.checkLabel}>
          Enable ByteRover Reusability Discount Pattern
        </label>
      </div>

      <div style={styles.checkboxGroup}>
        <input
          type="checkbox"
          id="live"
          checked={values.isLive}
          onChange={handleChange('isLive')}
        />
        <label htmlFor="live" style={styles.checkLabel}>
          Execute Mode (Live Ledger Recording via CFO_Ang)
        </label>
      </div>

      <button type="submit" disabled={loading} style={{
        ...styles.btn,
        opacity: loading ? 0.6 : 1,
        cursor: loading ? 'not-allowed' : 'pointer',
      }}>
        {loading ? 'Evaluating...' : 'Calculate Ledger Impact'}
      </button>
    </form>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: 'rgba(24, 24, 27, 0.65)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '24px',
    padding: '2.5rem',
    backdropFilter: 'blur(20px)',
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
  },
  cardTitle: {
    fontSize: '1.4rem',
    fontWeight: 700,
    marginBottom: '0.2rem',
    color: '#fafafa',
  },
  subtitle: {
    color: '#a1a1aa',
    fontSize: '0.9rem',
    marginBottom: '1.5rem',
  },
  formGroup: {
    marginBottom: '1.25rem',
    flex: 1,
  },
  label: {
    display: 'block',
    fontSize: '0.8rem',
    color: '#a1a1aa',
    marginBottom: '0.5rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    fontWeight: 600,
  },
  input: {
    width: '100%',
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fafafa',
    padding: '0.9rem 1rem',
    borderRadius: '12px',
    fontSize: '1rem',
    fontFamily: 'inherit',
    outline: 'none',
  },
  checkboxGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginTop: '1rem',
    color: '#a1a1aa',
  },
  checkLabel: {
    margin: 0,
    cursor: 'pointer',
  },
  btn: {
    width: '100%',
    background: '#3b82f6',
    color: '#fff',
    border: 'none',
    padding: '1.1rem',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: 600,
    marginTop: '1.5rem',
    boxShadow: '0 10px 15px -3px rgba(59,130,246,0.3)',
    fontFamily: 'inherit',
  },
};
