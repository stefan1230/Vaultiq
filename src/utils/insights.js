import { normalizeAccount, getAccountProgress } from './accounts';

export function computeInsights(accounts, statements, savings) {
  const accs = accounts.map(normalizeAccount);
  const totalDebt = accs.reduce((s, a) => s + a.currentBalance, 0);
  const totalSaved = savings.reduce((s, g) => s + g.current, 0);
  const totalSavingsTarget = savings.reduce((s, g) => s + g.target, 0);
  const totalInterest = statements.reduce((s, st) => s + st.interestCharged, 0);
  const totalPayments = statements.reduce((s, st) => s + st.paymentMade, 0);
  const totalPaydown = statements.reduce((s, st) => s + st.balanceDrop, 0);

  const ccAccounts = accs.filter(a => a.type === 'credit_card');
  const loanAccounts = accs.filter(a => a.type === 'loan');
  const ccDebt = ccAccounts.reduce((s, a) => s + a.currentBalance, 0);
  const loanDebt = loanAccounts.reduce((s, a) => s + a.currentBalance, 0);

  const netPosition = totalSaved - totalDebt;
  const debtToSavingsRatio = totalSaved > 0 ? totalDebt / totalSaved : null;

  const accountProgress = accs.map(a => ({
    account: a,
    ...getAccountProgress(a),
    balance: a.currentBalance,
  })).sort((a, b) => b.pct - a.pct);

  const topPerformer = accountProgress[0] || null;
  const highestBalance = [...accs].sort((a, b) => b.currentBalance - a.currentBalance)[0] || null;

  const sortedStmts = [...statements].sort((a, b) => b.month.localeCompare(a.month));
  const recentActivity = sortedStmts.slice(0, 5).map(st => {
    const acc = accs.find(a => a.id === st.accountId);
    return { ...st, accountName: acc?.name || 'Unknown' };
  });

  const months = [...new Set(statements.map(s => s.month))].sort().reverse();
  const lastMonth = months[0];
  const lastMonthPayments = lastMonth
    ? statements.filter(s => s.month === lastMonth).reduce((s, st) => s + st.paymentMade, 0)
    : 0;

  const savingsProgress = totalSavingsTarget > 0
    ? Math.min(100, (totalSaved / totalSavingsTarget) * 100)
    : 0;

  const utilization = ccAccounts.reduce((sum, a) => {
    const limit = a.limit || 0;
    return sum + (limit ? (a.currentBalance / limit) * 100 : 0);
  }, 0) / (ccAccounts.length || 1);

  return {
    totalDebt,
    totalSaved,
    totalSavingsTarget,
    totalInterest,
    totalPayments,
    totalPaydown,
    netPosition,
    debtToSavingsRatio,
    ccDebt,
    loanDebt,
    ccCount: ccAccounts.length,
    loanCount: loanAccounts.length,
    accountCount: accs.length,
    savingsGoalCount: savings.length,
    distinctMonths: months.length,
    lastMonth,
    lastMonthPayments,
    topPerformer,
    highestBalance,
    accountProgress,
    recentActivity,
    savingsProgress,
    avgCcUtilization: utilization,
  };
}
