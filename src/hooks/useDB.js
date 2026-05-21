import { useState, useCallback } from 'react';
import {
  getAll, putRecord, addRecord, getRecord, deleteRecord,
  getAllFromDB, bulkImport, openDB,
} from '../utils/db';
import { cloudSync, cloudFetch } from '../utils/supabase';
import { generateAccountId, normalizeAccount } from '../utils/accounts';

const DEFAULT_ACCOUNTS = [
  {
    id: 'dfcc',
    type: 'credit_card',
    name: 'DFCC Credit Card',
    limit: 300000,
    currentBalance: 269405,
    initialBalance: 300000,
    strategy: 'attack first',
    strategyColor: 'amber',
  },
  {
    id: 'hnb',
    type: 'credit_card',
    name: 'HNB Credit Card',
    limit: 150000,
    currentBalance: 139175,
    initialBalance: 150000,
    strategy: 'minimums for now',
    strategyColor: 'blue',
  },
];

export function useDB(user, setSyncStatus) {
  const [accounts, setAccounts] = useState([]);
  const [statements, setStatements] = useState([]);
  const [savings, setSavings] = useState([]);

  const load = useCallback(async () => {
    const [accs, stmts, saves] = await Promise.all([
      getAll('accounts'),
      getAll('statements'),
      getAll('savings'),
    ]);
    setAccounts(accs.map(normalizeAccount));
    setStatements(stmts);
    setSavings(saves);
  }, []);

  const sync = useCallback(async (userId) => {
    if (!userId) return;
    setSyncStatus('syncing');
    const data = await getAllFromDB();
    const ok = await cloudSync(userId, data);
    setSyncStatus(ok ? 'synced' : 'error');
  }, [setSyncStatus]);

  const seed = useCallback(async () => {
    const accs = await getAll('accounts');
    if (accs.length === 0) {
      for (const acc of DEFAULT_ACCOUNTS) await putRecord('accounts', acc);
      await addRecord('savings', { name: 'Emergency Fund', target: 250000, current: 0 });
    }
  }, []);

  const initFromCloud = useCallback(async (userId) => {
    const payload = await cloudFetch(userId);
    if (payload) {
      await bulkImport(payload);
    } else {
      await seed();
    }
    await load();
  }, [seed, load]);

  const commitStatement = useCallback(async (accountId, newBalance, paymentMade, month) => {
    const account = await getRecord('accounts', accountId);
    if (!account) return;
    const prev = account.currentBalance;
    const interest = Math.max(0, newBalance - (prev - paymentMade));
    const drop = Math.max(0, prev - newBalance);
    account.currentBalance = newBalance;
    await putRecord('accounts', account);
    await addRecord('statements', { accountId, month, newBalance, paymentMade, interestCharged: interest, balanceDrop: drop });
    await load();
    return { interest, drop };
  }, [load]);

  const createSavingsGoal = useCallback(async (name, target) => {
    await addRecord('savings', { name, target, current: 0 });
    await load();
  }, [load]);

  const mutateSavings = useCallback(async (goalId, amount, action) => {
    const goal = await getRecord('savings', goalId);
    if (!goal) return;
    goal.current = action === 'add' ? goal.current + amount : Math.max(0, goal.current - amount);
    await putRecord('savings', goal);
    await load();
  }, [load]);

  const deleteSavings = useCallback(async (goalId) => {
    await deleteRecord('savings', goalId);
    await load();
  }, [load]);

  const createAccount = useCallback(async (fields) => {
    const account = normalizeAccount({
      id: generateAccountId(),
      ...fields,
    });
    await putRecord('accounts', account);
    await load();
    return account;
  }, [load]);

  const deleteAccount = useCallback(async (accountId) => {
    const stmts = await getAll('statements');
    for (const s of stmts.filter(x => x.accountId === accountId)) {
      await deleteRecord('statements', s.id);
    }
    await deleteRecord('accounts', accountId);
    await load();
  }, [load]);

  const exportData = useCallback(async () => {
    const data = await getAllFromDB();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `vaultiq_backup_${Date.now()}.json`;
    a.click();
  }, []);

  const importData = useCallback(async (json) => {
    await bulkImport(json);
    await load();
  }, [load]);

  return {
    accounts, statements, savings,
    load, seed, initFromCloud,
    commitStatement, createAccount, deleteAccount,
    createSavingsGoal, mutateSavings, deleteSavings,
    exportData, importData, sync,
  };
}
