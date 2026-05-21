import React from 'react';

const colorMap = {
  amber: { value: 'var(--amber)', dot: 'var(--amber)' },
  emerald: { value: 'var(--emerald)', dot: 'var(--emerald)' },
  rose: { value: 'var(--rose)', dot: 'var(--rose)' },
  violet: { value: 'var(--violet)', dot: 'var(--violet)' },
  default: { value: 'var(--violet)', dot: 'var(--violet)' },
};

const variantClass = {
  amber: 'stat-card--amber',
  emerald: 'stat-card--emerald',
  rose: 'stat-card--rose',
  violet: 'stat-card--violet',
  default: 'stat-card--violet',
};

export default function StatCard({ label, value, color }) {
  const c = colorMap[color] || colorMap.default;
  const variant = variantClass[color] || variantClass.default;

  return (
    <div style={styles.card} className={`fade-in ${variant}`}>
      <div style={styles.labelRow}>
        <span style={{ ...styles.dot, background: c.dot }} />
        <p style={styles.label}>{label}</p>
      </div>
      <p style={{ ...styles.value, color: c.value }} className="tabular">{value}</p>
    </div>
  );
}

const styles = {
  card: {
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: '18px 16px',
  },
  labelRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '10px',
  },
  dot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    flexShrink: 0,
    boxShadow: '0 0 8px currentColor',
  },
  label: {
    fontSize: '10px',
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    letterSpacing: '0.04em',
  },
  value: {
    fontSize: '20px',
    fontWeight: 700,
    letterSpacing: '-0.02em',
  },
};
