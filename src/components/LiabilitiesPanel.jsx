import React from 'react';
import AccountCard from './AccountCard';
import AddDebtForm from './AddDebtForm';
import { normalizeAccount, DEBT_TYPES } from '../utils/accounts';

function DebtGroup({ title, icon, dotColor, accounts, statements, onCommit, onDelete }) {
  if (accounts.length === 0) return null;

  return (
    <div className="debt-group" style={styles.group}>
      <h3 style={styles.groupTitle}>
        <span style={{ ...styles.groupDot, background: dotColor }} />
        {icon} {title}
        <span style={styles.count}>{accounts.length}</span>
      </h3>
      <div className="debt-group__list" style={styles.list}>
        {accounts.map(acc => (
          <AccountCard
            key={acc.id}
            account={acc}
            statements={statements}
            onCommit={onCommit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}

export default function LiabilitiesPanel({ accounts, statements, onCreate, onCommit, onDelete }) {
  const normalized = accounts.map(normalizeAccount);
  const creditCards = normalized.filter(a => a.type === 'credit_card');
  const loans = normalized.filter(a => a.type === 'loan');

  return (
    <div className="liabilities-panel" style={styles.wrap}>
      <AddDebtForm onCreate={onCreate} />

      {normalized.length === 0 && (
        <p style={styles.empty}>
          No debts yet. Add a credit card or loan to start tracking.
        </p>
      )}

      <DebtGroup
        title="Credit Cards"
        icon={DEBT_TYPES.credit_card.icon}
        dotColor="var(--amber)"
        accounts={creditCards}
        statements={statements}
        onCommit={onCommit}
        onDelete={onDelete}
      />

      <DebtGroup
        title="Loans"
        icon={DEBT_TYPES.loan.icon}
        dotColor="var(--violet)"
        accounts={loans}
        statements={statements}
        onCommit={onCommit}
        onDelete={onDelete}
      />
    </div>
  );
}

const styles = {
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  group: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  groupTitle: {
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  groupDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    flexShrink: 0,
  },
  count: {
    fontSize: '10px',
    fontWeight: 600,
    color: 'var(--text-dim)',
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    padding: '1px 7px',
    marginLeft: '2px',
    textTransform: 'none',
    letterSpacing: 0,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  empty: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    textAlign: 'center',
    padding: '24px 16px',
    border: '1px dashed var(--border)',
    borderRadius: 'var(--radius-md)',
  },
};
