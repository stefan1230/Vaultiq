import React, { useState } from 'react';
import { formatLKR, formatMonthLabel, currentMonth } from '../utils/format';
import { normalizeAccount, getAccountProgress, DEBT_TYPES } from '../utils/accounts';
import CurrencyInput from './CurrencyInput';

const strategyStyles = {
  amber: { background: 'var(--amber-soft)', color: 'var(--amber)', border: '1px solid rgba(245,158,11,0.35)' },
  blue: { background: 'var(--blue-soft)', color: 'var(--blue)', border: '1px solid rgba(96,165,250,0.35)' },
  violet: { background: 'var(--violet-soft)', color: 'var(--violet)', border: '1px solid rgba(167,139,250,0.35)' },
  rose: { background: 'var(--rose-soft)', color: 'var(--rose)', border: '1px solid rgba(251,113,133,0.35)' },
};

const accentColors = {
  amber: { bar: 'linear-gradient(90deg, var(--amber) 0%, #fbbf24 100%)', top: 'var(--amber)', btn: 'linear-gradient(135deg, var(--amber) 0%, #fbbf24 100%)', btnText: '#422006' },
  blue: { bar: 'linear-gradient(90deg, var(--blue) 0%, var(--cyan) 100%)', top: 'var(--blue)', btn: 'linear-gradient(135deg, var(--blue) 0%, var(--cyan) 100%)', btnText: '#0c1929' },
  violet: { bar: 'linear-gradient(90deg, var(--violet) 0%, #c4b5fd 100%)', top: 'var(--violet)', btn: 'linear-gradient(135deg, var(--violet) 0%, #a78bfa 100%)', btnText: '#2e1065' },
  rose: { bar: 'linear-gradient(90deg, var(--rose) 0%, #fda4af 100%)', top: 'var(--rose)', btn: 'linear-gradient(135deg, var(--rose) 0%, #fb7185 100%)', btnText: '#4c0519' },
};

export default function AccountCard({ account, statements, onCommit, onDelete }) {
  const [newBal, setNewBal] = useState(null);
  const [payMade, setPayMade] = useState(null);
  const [month, setMonth] = useState(currentMonth());
  const [submitting, setSubmitting] = useState(false);

  const acc = normalizeAccount(account);
  const isLoan = acc.type === 'loan';
  const typeMeta = DEBT_TYPES[acc.type];

  const cardStmts = statements
    .filter(s => s.accountId === acc.id)
    .sort((a, b) => a.month.localeCompare(b.month));

  const progress = getAccountProgress(acc);
  const accent = accentColors[acc.strategyColor] || accentColors.blue;

  const handleSubmit = async () => {
    if (newBal == null || payMade == null || isNaN(newBal) || isNaN(payMade) || !month) {
      alert('Please fill in all fields.');
      return;
    }
    setSubmitting(true);
    await onCommit(acc.id, newBal, payMade, month);
    setNewBal(null);
    setPayMade(null);
    setSubmitting(false);
  };

  const handleDelete = () => {
    const label = isLoan ? 'loan' : 'credit card';
    if (window.confirm(`Delete "${acc.name}" and all its statement history?`)) {
      onDelete(acc.id);
    }
  };

  const limitLabel = isLoan
    ? `Principal: ${formatLKR(acc.initialBalance || acc.limit)}`
    : `Limit: ${formatLKR(acc.limit)}`;

  return (
    <div style={{ ...styles.card, borderTopColor: accent.top }} className="fade-in">
      <div style={styles.header}>
        <div style={styles.headerMain}>
          <div style={styles.nameRow}>
            <h2 style={styles.name}>{acc.name}</h2>
            <span style={styles.typeBadge}>{typeMeta.icon} {typeMeta.label}</span>
          </div>
          <p style={styles.limit}>{limitLabel}</p>
        </div>
        <div style={styles.headerActions}>
          <span style={{ ...styles.badge, ...(strategyStyles[acc.strategyColor] || strategyStyles.blue) }}>
            {acc.strategy}
          </span>
          {onDelete && (
            <button type="button" style={styles.deleteBtn} onClick={handleDelete} title="Delete account">
              ×
            </button>
          )}
        </div>
      </div>

      <div style={styles.balanceRow}>
        <span style={styles.balLabel}>Current Balance</span>
        <span style={styles.balValue} className="tabular">{formatLKR(acc.currentBalance)}</span>
      </div>

      <div style={styles.progressWrap}>
        <div style={styles.progressTrack}>
          <div style={{ ...styles.progressBar, width: `${progress.pct}%`, background: accent.bar }} />
        </div>
        <span style={styles.progressLabel}>{progress.pct.toFixed(0)}{progress.label}</span>
      </div>

      <div style={styles.divider} />

      <h4 style={styles.formTitle}>{isLoan ? 'Log Payment / Balance' : 'Log Statement'}</h4>
      <div style={styles.formGrid}>
        <div style={styles.fieldWrap}>
          <label style={styles.fieldLabel}>{isLoan ? 'Payment Month' : 'Statement Month'}</label>
          <input type="month" value={month} onChange={e => setMonth(e.target.value)} />
        </div>
        <div style={styles.fieldWrap}>
          <label style={styles.fieldLabel}>New Balance (LKR)</label>
          <CurrencyInput
            value={newBal}
            onChange={setNewBal}
            placeholder="e.g. 260,000 or 260000.50"
          />
        </div>
        <div style={styles.fieldWrap}>
          <label style={styles.fieldLabel}>Payment Made (LKR)</label>
          <CurrencyInput
            value={payMade}
            onChange={setPayMade}
            placeholder="e.g. 30,000 or 30000.25"
          />
        </div>
      </div>
      <button
        style={{ ...styles.submitBtn, background: accent.btn, color: accent.btnText }}
        onClick={handleSubmit}
        disabled={submitting}
      >
        {submitting ? 'Saving…' : '+ Add Log Entry'}
      </button>

      {cardStmts.length > 0 && (
        <div style={styles.history}>
          {cardStmts.map((s, i) => (
            <div key={s.id || i} style={styles.historyRow} className="slide-in">
              <span style={styles.historyMonth}>{formatMonthLabel(s.month)}</span>
              <div style={styles.historyMeta}>
                <span style={styles.metaItem}>
                  Paid <strong style={{ color: 'var(--text)' }}>{s.paymentMade.toLocaleString()}</strong>
                </span>
                <span style={{ ...styles.metaItem, color: 'var(--emerald)' }}>
                  ↓ {s.balanceDrop.toLocaleString()}
                </span>
                <span style={{ ...styles.metaItem, color: 'var(--rose)' }}>
                  Int {s.interestCharged.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      {cardStmts.length === 0 && (
        <p style={styles.empty}>No {isLoan ? 'payments' : 'statements'} logged yet</p>
      )}
    </div>
  );
}

const styles = {
  card: {
    background: 'linear-gradient(180deg, var(--surface) 0%, var(--bg-elevated) 100%)',
    border: '1px solid var(--border)',
    borderTop: '3px solid var(--amber)',
    borderRadius: 'var(--radius-md)',
    padding: '24px',
    width: '100%',
    boxShadow: 'var(--shadow-card)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '20px',
  },
  headerMain: { flex: 1, minWidth: 0 },
  headerActions: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '6px',
    flexShrink: 0,
  },
  nameRow: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '4px',
  },
  name: {
    fontSize: '16px',
    fontWeight: 700,
    color: 'var(--text)',
  },
  typeBadge: {
    fontSize: '10px',
    fontWeight: 600,
    color: 'var(--text-muted)',
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: '4px',
    padding: '2px 6px',
  },
  limit: {
    fontSize: '11px',
    color: 'var(--text-muted)',
  },
  badge: {
    fontSize: '9px',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    padding: '4px 8px',
    borderRadius: '4px',
    whiteSpace: 'nowrap',
  },
  deleteBtn: {
    background: 'transparent',
    color: 'var(--text-muted)',
    fontSize: '18px',
    lineHeight: 1,
    padding: '0 4px',
    borderRadius: '4px',
  },
  balanceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: '10px',
  },
  balLabel: {
    fontSize: '11px',
    color: 'var(--text-muted)',
  },
  balValue: {
    fontSize: '20px',
    fontWeight: 700,
    color: 'var(--text)',
    letterSpacing: '-0.03em',
  },
  progressWrap: { marginBottom: '20px' },
  progressTrack: {
    background: 'var(--surface2)',
    height: '3px',
    borderRadius: '2px',
    overflow: 'hidden',
    marginBottom: '4px',
  },
  progressBar: {
    height: '100%',
    borderRadius: '2px',
    transition: 'width 0.5s ease',
    boxShadow: '0 0 10px var(--emerald-glow)',
  },
  progressLabel: {
    fontSize: '10px',
    color: 'var(--text-muted)',
  },
  divider: {
    borderTop: '1px solid var(--border)',
    marginBottom: '16px',
  },
  formTitle: {
    fontSize: '10px',
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    marginBottom: '12px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '12px',
    marginBottom: '12px',
  },
  fieldWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  fieldLabel: {
    fontSize: '10px',
    color: 'var(--text-muted)',
    fontWeight: 500,
  },
  submitBtn: {
    fontWeight: 700,
    fontSize: '12px',
    height: '40px',
    borderRadius: 'var(--radius-sm)',
    padding: '0 20px',
    marginBottom: '16px',
    letterSpacing: '0.01em',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
  },
  history: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    maxHeight: '200px',
    overflowY: 'auto',
    paddingRight: '4px',
  },
  historyRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderLeft: '3px solid var(--border2)',
    borderRadius: 'var(--radius-sm)',
    padding: '10px 12px',
  },
  historyMonth: {
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--text)',
  },
  historyMeta: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
  },
  metaItem: {
    fontSize: '11px',
    color: 'var(--text-dim)',
  },
  empty: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    textAlign: 'center',
    padding: '16px 0',
  },
};
