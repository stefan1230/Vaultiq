import React, { useState } from 'react';
import { formatLKR, pct } from '../utils/format';
import CurrencyInput from './CurrencyInput';

export default function SavingsPanel({ savings, onCreate, onMutate, onDelete }) {
  const [name, setName] = useState('');
  const [target, setTarget] = useState(null);

  const handleCreate = () => {
    if (!name.trim() || target == null || isNaN(target) || target <= 0) {
      alert('Provide a label and target amount.');
      return;
    }
    onCreate(name.trim(), target);
    setName('');
    setTarget(null);
  };

  return (
    <div style={styles.wrap}>
      <h2 style={styles.sectionTitle}>
        <span style={styles.dot} /> Savings & Goals
      </h2>

      <div style={styles.createCard}>
        <h3 style={styles.createTitle}>New Savings Goal</h3>
        <div style={styles.fields}>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Goal Label (e.g. Emergency Fund)"
          />
          <CurrencyInput
            value={target}
            onChange={setTarget}
            placeholder="e.g. 500,000 or 500000.00"
          />
          <button style={styles.createBtn} onClick={handleCreate}>
            Create Goal
          </button>
        </div>
      </div>

      <div style={styles.list}>
        {savings.map(goal => (
          <SavingsGoal key={goal.id} goal={goal} onMutate={onMutate} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
}

function SavingsGoal({ goal, onMutate, onDelete }) {
  const [amount, setAmount] = useState(null);
  const [action, setAction] = useState('add');
  const goalPct = pct(goal.current, goal.target);

  const handleMutate = () => {
    if (amount == null || isNaN(amount) || amount <= 0) {
      alert('Enter a valid amount.');
      return;
    }
    onMutate(goal.id, amount, action);
    setAmount(null);
  };

  return (
    <div style={styles.goalCard} className="fade-in">
      <div style={styles.goalHeader}>
        <h3 style={styles.goalName}>{goal.name}</h3>
        <button
          style={styles.deleteBtn}
          onClick={() => window.confirm('Delete this goal?') && onDelete(goal.id)}
        >
          ×
        </button>
      </div>
      <p style={styles.goalTarget}>Target: {formatLKR(goal.target)}</p>

      <div style={styles.goalProgress}>
        <span style={styles.goalCurrent} className="tabular">{formatLKR(goal.current)}</span>
        <span style={styles.goalPct}>{goalPct.toFixed(0)}%</span>
      </div>
      <div style={styles.progressTrack}>
        <div
          style={{
            ...styles.progressBar,
            width: `${goalPct}%`,
            background: 'linear-gradient(90deg, var(--emerald) 0%, var(--cyan) 100%)',
          }}
        />
      </div>

      <div style={styles.mutateRow}>
        <select value={action} onChange={e => setAction(e.target.value)} style={{ maxWidth: '110px' }}>
          <option value="add">Deposit (+)</option>
          <option value="sub">Withdraw (−)</option>
        </select>
        <CurrencyInput
          value={amount}
          onChange={setAmount}
          placeholder="e.g. 5,000.50"
          style={{ flex: 1 }}
        />
        <button style={styles.goBtn} onClick={handleMutate}>Go</button>
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
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
    background: 'var(--emerald)',
    display: 'inline-block',
    boxShadow: '0 0 10px var(--emerald-glow)',
  },
  createCard: {
    background: 'linear-gradient(135deg, var(--surface) 0%, var(--emerald-soft) 100%)',
    border: '1px solid rgba(52, 211, 153, 0.2)',
    borderRadius: 'var(--radius-md)',
    padding: '16px',
    boxShadow: 'var(--shadow-card)',
  },
  createTitle: {
    fontSize: '11px',
    fontWeight: 600,
    color: 'var(--emerald)',
    marginBottom: '12px',
    fontFamily: 'var(--mono)',
    letterSpacing: '0.04em',
  },
  fields: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  createBtn: {
    background: 'linear-gradient(135deg, var(--emerald) 0%, #2dd4bf 100%)',
    color: '#042f2e',
    fontWeight: 700,
    fontSize: '12px',
    height: '40px',
    borderRadius: 'var(--radius-sm)',
    boxShadow: '0 4px 16px var(--emerald-glow)',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  goalCard: {
    background: 'linear-gradient(160deg, var(--emerald-soft) 0%, var(--surface) 100%)',
    border: '1px solid rgba(52, 211, 153, 0.22)',
    borderLeft: '3px solid var(--emerald)',
    borderRadius: 'var(--radius-md)',
    padding: '16px',
    boxShadow: 'var(--shadow-card)',
  },
  goalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '4px',
  },
  goalName: {
    fontSize: '14px',
    fontWeight: 700,
    color: 'var(--text)',
  },
  deleteBtn: {
    background: 'transparent',
    color: 'var(--text-muted)',
    fontSize: '18px',
    lineHeight: 1,
    padding: '0 4px',
    borderRadius: '4px',
  },
  goalTarget: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    fontFamily: 'var(--mono)',
    marginBottom: '12px',
  },
  goalProgress: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: '6px',
  },
  goalCurrent: {
    fontSize: '15px',
    fontWeight: 700,
    color: 'var(--emerald)',
    fontFamily: 'var(--mono)',
  },
  goalPct: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    fontFamily: 'var(--mono)',
  },
  progressTrack: {
    background: 'var(--surface2)',
    height: '4px',
    borderRadius: '2px',
    overflow: 'hidden',
    marginBottom: '12px',
  },
  progressBar: {
    height: '100%',
    transition: 'width 0.5s ease',
    boxShadow: '0 0 8px var(--emerald-glow)',
  },
  mutateRow: {
    display: 'flex',
    gap: '6px',
    alignItems: 'center',
    borderTop: '1px solid rgba(52, 211, 153, 0.15)',
    paddingTop: '12px',
  },
  goBtn: {
    background: 'linear-gradient(135deg, var(--emerald) 0%, #2dd4bf 100%)',
    color: '#042f2e',
    fontWeight: 700,
    fontSize: '12px',
    height: '40px',
    width: '48px',
    borderRadius: 'var(--radius-sm)',
    flexShrink: 0,
    boxShadow: '0 2px 12px var(--emerald-glow)',
  },
};
