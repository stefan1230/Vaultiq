import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './utils/supabase';
import { useDB } from './hooks/useDB';
import { formatLKR } from './utils/format';
import AuthScreen from './components/AuthScreen';
import StatCard from './components/StatCard';
import LiabilitiesPanel from './components/LiabilitiesPanel';
import SavingsPanel from './components/SavingsPanel';
import ThemeToggle from './components/ThemeToggle';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState('idle'); // idle | syncing | synced | error
  const fileInputRef = useRef();

  const db = useDB(user, setSyncStatus);

  // Auth check on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
      } else {
        setLoading(false);
      }
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) { setUser(null); setLoading(false); }
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // After user is set, init data
  useEffect(() => {
    if (user) {
      db.initFromCloud(user.id).then(() => setLoading(false));
    }
  }, [user]); // eslint-disable-line

  const handleAuth = (u) => {
    setUser(u);
    setLoading(true);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const handleCommit = async (accountId, newBal, payMade, month) => {
    await db.commitStatement(accountId, newBal, payMade, month);
    if (user) db.sync(user.id);
  };

  const handleCreateGoal = async (name, target) => {
    await db.createSavingsGoal(name, target);
    if (user) db.sync(user.id);
  };

  const handleMutateSavings = async (id, amt, action) => {
    await db.mutateSavings(id, amt, action);
    if (user) db.sync(user.id);
  };

  const handleDeleteSavings = async (id) => {
    await db.deleteSavings(id);
    if (user) db.sync(user.id);
  };

  const handleCreateAccount = async (fields) => {
    await db.createAccount(fields);
    if (user) db.sync(user.id);
  };

  const handleDeleteAccount = async (id) => {
    await db.deleteAccount(id);
    if (user) db.sync(user.id);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        // Support both new and legacy formats
        if (!parsed.accounts && parsed.debts) {
          const accounts = [
            { id: 'dfcc', type: 'credit_card', name: 'DFCC Credit Card', limit: 300000, currentBalance: 269405, initialBalance: 300000, strategy: 'attack first', strategyColor: 'amber' },
            { id: 'hnb', type: 'credit_card', name: 'HNB Credit Card', limit: 150000, currentBalance: 139175, initialBalance: 150000, strategy: 'minimums for now', strategyColor: 'blue' },
          ];
          parsed.debts.forEach(d => {
            const id = d.name.toLowerCase().includes('hnb') ? 'hnb' : 'dfcc';
            const acc = accounts.find(a => a.id === id);
            if (acc) acc.currentBalance = d.balance;
          });
          await db.importData({ accounts, statements: [], savings: [] });
        } else {
          await db.importData(parsed);
        }
        if (user) db.sync(user.id);
      } catch {
        alert('Failed to parse backup file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Compute stats
  const totalDebt = db.accounts.reduce((sum, a) => sum + a.currentBalance, 0);
  const totalSaved = db.savings.reduce((sum, g) => sum + g.current, 0);
  const totalInterest = db.statements.reduce((sum, s) => sum + s.interestCharged, 0);
  const distinctMonths = new Set(db.statements.map(s => s.month)).size;

  const syncLabel = {
    idle: '● Local',
    syncing: '⟳ Syncing…',
    synced: '● Cloud Synced',
    error: '⚠ Sync Error',
  }[syncStatus];

  const syncColor = {
    idle: 'var(--text-muted)',
    syncing: 'var(--cyan)',
    synced: 'var(--emerald)',
    error: 'var(--rose)',
  }[syncStatus];

  if (!user && !loading) return <AuthScreen onAuth={handleAuth} showThemeToggle />;

  if (loading) return (
    <div style={loadingStyles.wrap}>
      <span style={loadingStyles.icon}>⬡</span>
      <p style={loadingStyles.text}>Loading Vaultiq…</p>
    </div>
  );

  return (
    <div style={styles.app}>
      <div style={styles.container}>

        {/* Header */}
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>
              Vault<span style={styles.titleAccent}>iq</span>
            </h1>
            <p style={{ ...styles.syncBadge, color: syncColor }}>{syncLabel}</p>
          </div>
          <div style={styles.actions}>
            <ThemeToggle />
            <button style={styles.actionBtn} onClick={handleSignOut}>Sign Out</button>
            <button style={styles.actionBtn} onClick={db.exportData}>Backup JSON</button>
            <button style={styles.actionBtn} onClick={() => fileInputRef.current.click()}>
              Restore JSON
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              style={{ display: 'none' }}
              onChange={handleImport}
            />
          </div>
        </header>

        {/* Stats */}
        <div style={styles.statsGrid}>
          <StatCard label="Total Debt Remaining" value={formatLKR(totalDebt)} color="amber" />
          <StatCard label="Total Capital Saved" value={formatLKR(totalSaved)} color="emerald" />
          <StatCard label="Interest Paid (est.)" value={formatLKR(totalInterest)} color="rose" />
          <StatCard label="Months Tracked" value={String(distinctMonths)} color="violet" />
        </div>

        {/* Main Content */}
        <div style={styles.mainGrid}>
          {/* Accounts */}
          <div style={styles.accountsCol}>
            <h2 style={styles.sectionTitle}>
              <span style={{ ...styles.dot, background: 'var(--amber)', boxShadow: '0 0 8px var(--amber-glow)' }} />
              Liabilities &amp; Statements
            </h2>
            <LiabilitiesPanel
              accounts={db.accounts}
              statements={db.statements}
              onCreate={handleCreateAccount}
              onCommit={handleCommit}
              onDelete={handleDeleteAccount}
            />
          </div>

          {/* Savings */}
          <div style={styles.savingsCol}>
            <SavingsPanel
              savings={db.savings}
              onCreate={handleCreateGoal}
              onMutate={handleMutateSavings}
              onDelete={handleDeleteSavings}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  app: {
    minHeight: '100vh',
    background: 'transparent',
    padding: '16px',
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    borderBottom: '1px solid var(--border)',
    paddingBottom: '20px',
    marginBottom: '24px',
    background: 'linear-gradient(90deg, transparent 0%, var(--violet-soft) 50%, transparent 100%)',
    backgroundSize: '200% 100%',
    backgroundPosition: '0% 0%',
    paddingTop: '4px',
  },
  title: {
    fontSize: '20px',
    fontWeight: 700,
    color: 'var(--text)',
    letterSpacing: '-0.02em',
    marginBottom: '4px',
  },
  titleAccent: {
    background: 'linear-gradient(90deg, var(--amber) 0%, var(--violet) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  syncBadge: {
    fontSize: '11px',
    fontFamily: 'var(--mono)',
    transition: 'color 0.3s',
  },
  actions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  actionBtn: {
    background: 'var(--surface2)',
    color: 'var(--text-dim)',
    fontSize: '11px',
    fontWeight: 600,
    height: '34px',
    padding: '0 12px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border)',
    letterSpacing: '0.01em',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
    marginBottom: '32px',
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '32px',
  },
  accountsCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  savingsCol: {},
  sectionTitle: {
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontFamily: 'var(--mono)',
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    display: 'inline-block',
  },
};

const loadingStyles = {
  wrap: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    background: 'transparent',
  },
  icon: {
    fontSize: '36px',
    background: 'linear-gradient(135deg, var(--emerald) 0%, var(--cyan) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    animation: 'shimmer 1.5s ease infinite',
  },
  text: {
    fontSize: '13px',
    color: 'var(--text-muted)',
    fontFamily: 'var(--mono)',
  },
};
