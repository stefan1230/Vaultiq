import React from 'react';
import { useThemeContext } from '../context/ThemeContext';

export default function ThemeToggle({ style }) {
  const { theme, toggle } = useThemeContext();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      style={{ ...toggleStyles.btn, ...style }}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      <span style={toggleStyles.icon} aria-hidden>{isDark ? '☀' : '☾'}</span>
      <span style={toggleStyles.label}>{isDark ? 'Light' : 'Dark'}</span>
    </button>
  );
}

const toggleStyles = {
  btn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: 'var(--surface2)',
    color: 'var(--text-dim)',
    fontSize: '11px',
    fontWeight: 600,
    height: '34px',
    padding: '0 12px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border)',
  },
  icon: {
    fontSize: '14px',
    lineHeight: 1,
  },
  label: {
    letterSpacing: '0.02em',
  },
};
