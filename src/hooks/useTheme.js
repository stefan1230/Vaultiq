import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'vaultiq-theme';
const LEGACY_THEME_KEY = 'debt-tracker-theme';

function getInitialTheme() {
  if (typeof window === 'undefined') return 'dark';
  let stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    stored = localStorage.getItem(LEGACY_THEME_KEY);
    if (stored === 'light' || stored === 'dark') {
      localStorage.setItem(STORAGE_KEY, stored);
      localStorage.removeItem(LEGACY_THEME_KEY);
    }
  }
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(STORAGE_KEY, theme);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = theme === 'light' ? '#f4f6fb' : '#0b1020';
}

export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme(t => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, setTheme, toggle, isDark: theme === 'dark' };
}
