import React, { useState } from 'react';
import { supabase } from '../utils/supabase';
import ThemeToggle from './ThemeToggle';

export default function AuthScreen({ onAuth, showThemeToggle }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    setError('');
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) {
      setError(err.message);
    } else {
      onAuth(data.user);
    }
    setLoading(false);
  };

  return (
    <div style={styles.wrapper}>
      {showThemeToggle && (
        <div style={styles.themeBar}>
          <ThemeToggle />
        </div>
      )}
      <div style={styles.glowA} aria-hidden />
      <div style={styles.glowB} aria-hidden />
      <div style={styles.card} className="fade-in">
        <div style={styles.logo}>
          <span style={styles.logoIcon}>⬡</span>
        </div>
        <h1 style={styles.title}>
          Vault<span style={styles.titleAccent}>iq</span>
        </h1>
        <p style={styles.sub}>Secure cloud-synced finance workspace</p>

        <div style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
          </div>
          {error && <p style={styles.error}>{error}</p>}
          <button style={styles.btn} onClick={handleLogin} disabled={loading}>
            {loading ? 'Connecting…' : 'Establish Session'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    background: 'transparent',
    position: 'relative',
    overflow: 'hidden',
  },
  themeBar: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    zIndex: 2,
  },
  glowA: {
    position: 'absolute',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(52, 211, 153, 0.15) 0%, transparent 70%)',
    top: '-100px',
    left: '-80px',
    pointerEvents: 'none',
  },
  glowB: {
    position: 'absolute',
    width: '350px',
    height: '350px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(167, 139, 250, 0.12) 0%, transparent 70%)',
    bottom: '-80px',
    right: '-60px',
    pointerEvents: 'none',
  },
  card: {
    background: 'linear-gradient(160deg, var(--surface) 0%, var(--bg-elevated) 100%)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '40px 32px',
    width: '100%',
    maxWidth: '380px',
    boxShadow: '0 24px 64px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255,255,255,0.04)',
    position: 'relative',
    zIndex: 1,
  },
  logo: {
    marginBottom: '20px',
  },
  logoIcon: {
    fontSize: '32px',
    background: 'linear-gradient(135deg, var(--emerald) 0%, var(--cyan) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    filter: 'drop-shadow(0 0 12px var(--emerald-glow))',
  },
  title: {
    fontSize: '28px',
    fontWeight: 800,
    lineHeight: 1.15,
    color: 'var(--text)',
    marginBottom: '8px',
  },
  titleAccent: {
    background: 'linear-gradient(90deg, var(--emerald) 0%, var(--cyan) 50%, var(--violet) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  sub: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    marginBottom: '32px',
    fontFamily: 'var(--mono)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '10px',
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    fontFamily: 'var(--mono)',
  },
  error: {
    fontSize: '12px',
    color: 'var(--rose)',
    padding: '8px 10px',
    background: 'var(--rose-soft)',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid rgba(251, 113, 133, 0.2)',
  },
  btn: {
    background: 'linear-gradient(135deg, var(--emerald) 0%, #2dd4bf 100%)',
    color: '#042f2e',
    fontWeight: 700,
    fontSize: '13px',
    height: '44px',
    borderRadius: 'var(--radius-sm)',
    letterSpacing: '0.02em',
    marginTop: '8px',
    boxShadow: '0 4px 20px var(--emerald-glow)',
  },
};
