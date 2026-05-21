import React, { useState } from 'react';
import CurrencyInput from './CurrencyInput';
import { DEBT_TYPES, defaultStrategyForType, defaultColorForType } from '../utils/accounts';

export default function AddDebtForm({ onCreate }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('credit_card');
  const [principal, setPrincipal] = useState(null);
  const [currentBalance, setCurrentBalance] = useState(null);
  const [strategy, setStrategy] = useState('');

  const isLoan = type === 'loan';
  const principalLabel = isLoan ? 'Original Principal (LKR)' : 'Credit Limit (LKR)';

  const reset = () => {
    setName('');
    setType('credit_card');
    setPrincipal(null);
    setCurrentBalance(null);
    setStrategy('');
    setOpen(false);
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      alert('Enter a name for this debt.');
      return;
    }
    if (principal == null || isNaN(principal) || principal <= 0) {
      alert(`Enter a valid ${isLoan ? 'principal' : 'credit limit'}.`);
      return;
    }
    if (currentBalance == null || isNaN(currentBalance) || currentBalance < 0) {
      alert('Enter the current balance owed.');
      return;
    }
    if (currentBalance > principal && !isLoan) {
      alert('Current balance cannot exceed the credit limit.');
      return;
    }

    onCreate({
      name: name.trim(),
      type,
      limit: principal,
      initialBalance: principal,
      currentBalance,
      strategy: strategy.trim() || defaultStrategyForType(type),
      strategyColor: defaultColorForType(type),
    });
    reset();
  };

  if (!open) {
    return (
      <button type="button" style={styles.toggleBtn} onClick={() => setOpen(true)} className="fade-in">
        + Add Credit Card or Loan
      </button>
    );
  }

  return (
    <div style={styles.card} className="fade-in">
      <div style={styles.cardHeader}>
        <h3 style={styles.title}>Add Debt Account</h3>
        <button type="button" style={styles.closeBtn} onClick={reset} aria-label="Cancel">
          ×
        </button>
      </div>

      <div style={styles.fields}>
        <div style={styles.field}>
          <label style={styles.label}>Account Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder={isLoan ? 'e.g. Car Loan – BOC' : 'e.g. Sampath Visa'}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Debt Type</label>
          <select value={type} onChange={e => setType(e.target.value)}>
            {Object.values(DEBT_TYPES).map(t => (
              <option key={t.id} value={t.id}>
                {t.icon} {t.label}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.row}>
          <div style={styles.field}>
            <label style={styles.label}>{principalLabel}</label>
            <CurrencyInput
              value={principal}
              onChange={setPrincipal}
              placeholder={isLoan ? 'e.g. 2,500,000' : 'e.g. 300,000'}
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Current Balance (LKR)</label>
            <CurrencyInput
              value={currentBalance}
              onChange={setCurrentBalance}
              placeholder="e.g. 150,000"
            />
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Strategy Note (optional)</label>
          <input
            type="text"
            value={strategy}
            onChange={e => setStrategy(e.target.value)}
            placeholder={isLoan ? 'e.g. Extra payments Q3' : 'e.g. Attack first'}
          />
        </div>

        <button type="button" style={styles.submitBtn} onClick={handleSubmit}>
          Add Account
        </button>
      </div>
    </div>
  );
}

const styles = {
  toggleBtn: {
    width: '100%',
    background: 'var(--surface)',
    color: 'var(--text-dim)',
    border: '1px dashed var(--border2)',
    fontSize: '12px',
    fontWeight: 600,
    height: '44px',
    borderRadius: 'var(--radius-md)',
    letterSpacing: '0.02em',
  },
  card: {
    background: 'linear-gradient(135deg, var(--surface) 0%, var(--violet-soft) 100%)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: '16px',
    boxShadow: 'var(--shadow-card)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '14px',
  },
  title: {
    fontSize: '12px',
    fontWeight: 700,
    color: 'var(--text)',
    letterSpacing: '0.04em',
  },
  closeBtn: {
    background: 'transparent',
    color: 'var(--text-muted)',
    fontSize: '20px',
    lineHeight: 1,
    padding: '0 6px',
  },
  fields: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '12px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '10px',
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
  },
  submitBtn: {
    background: 'linear-gradient(135deg, var(--violet) 0%, var(--blue) 100%)',
    color: '#fff',
    fontWeight: 700,
    fontSize: '12px',
    height: '40px',
    borderRadius: 'var(--radius-sm)',
    marginTop: '4px',
  },
};
