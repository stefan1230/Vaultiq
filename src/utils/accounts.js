export const DEBT_TYPES = {
  credit_card: { id: 'credit_card', label: 'Credit Card', icon: '💳' },
  loan: { id: 'loan', label: 'Loan', icon: '🏦' },
};

export function generateAccountId() {
  return `acc_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function normalizeAccount(account) {
  const type = account.type === 'loan' ? 'loan' : 'credit_card';
  return { ...account, type };
}

export function getAccountProgress(account) {
  const acc = normalizeAccount(account);
  if (acc.type === 'loan') {
    const principal = acc.initialBalance || acc.limit || 0;
    const paid = Math.max(0, principal - acc.currentBalance);
    return {
      pct: principal ? Math.min(100, Math.max(0, (paid / principal) * 100)) : 0,
      label: '% paid off',
      sublabel: `Principal: ${principal}`,
    };
  }
  const limit = acc.limit || 0;
  const cleared = Math.max(0, limit - acc.currentBalance);
  return {
    pct: limit ? Math.min(100, Math.max(0, (cleared / limit) * 100)) : 0,
    label: '% limit cleared',
    sublabel: `Limit: ${limit}`,
  };
}

export function defaultStrategyForType(type) {
  return type === 'loan' ? 'Active' : 'Paydown';
}

export function defaultColorForType(type) {
  return type === 'loan' ? 'violet' : 'blue';
}
