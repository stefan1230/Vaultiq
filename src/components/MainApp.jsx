import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useDB } from '../hooks/useDB';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { computeInsights } from '../utils/insights';
import AppHeader from './layout/AppHeader';
import BottomNav from './layout/BottomNav';
import Sidebar from './layout/Sidebar';
import TopBar from './layout/TopBar';
import DashboardScreen from './screens/DashboardScreen';
import InsightsScreen from './screens/InsightsScreen';
import MoreScreen from './screens/MoreScreen';
import LiabilitiesPanel from './LiabilitiesPanel';
import SavingsPanel from './SavingsPanel';

export default function MainApp({ user, onSignOut }) {
  const [tab, setTab] = useState('home');
  const [syncStatus, setSyncStatus] = useState('idle');
  const fileInputRef = useRef();
  const isDesktop = useMediaQuery('(min-width: 900px)');
  const db = useDB(user, setSyncStatus);

  useEffect(() => {
    if (user) db.initFromCloud(user.id);
  }, [user]); // eslint-disable-line

  const insights = useMemo(
    () => computeInsights(db.accounts, db.statements, db.savings),
    [db.accounts, db.statements, db.savings]
  );

  const syncLabel = {
    idle: '● Local',
    syncing: '⟳ Syncing…',
    synced: '● Cloud synced',
    error: '⚠ Sync error',
  }[syncStatus];

  const syncColor = {
    idle: 'var(--text-muted)',
    syncing: 'var(--cyan)',
    synced: 'var(--emerald)',
    error: 'var(--rose)',
  }[syncStatus];

  const sync = () => user && db.sync(user.id);

  const handleCommit = async (...args) => {
    await db.commitStatement(...args);
    sync();
  };

  const handleCreateAccount = async (fields) => {
    await db.createAccount(fields);
    sync();
  };

  const handleDeleteAccount = async (id) => {
    await db.deleteAccount(id);
    sync();
  };

  const handleCreateGoal = async (name, target) => {
    await db.createSavingsGoal(name, target);
    sync();
  };

  const handleMutateSavings = async (id, amt, action) => {
    await db.mutateSavings(id, amt, action);
    sync();
  };

  const handleDeleteSavings = async (id) => {
    await db.deleteSavings(id);
    sync();
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
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
        sync();
      } catch {
        alert('Failed to parse backup file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const renderContent = () => {
    switch (tab) {
      case 'home':
        return <DashboardScreen insights={insights} onNavigate={setTab} />;
      case 'debts':
        return (
          <div className="panel-page">
            <LiabilitiesPanel
              accounts={db.accounts}
              statements={db.statements}
              onCreate={handleCreateAccount}
              onCommit={handleCommit}
              onDelete={handleDeleteAccount}
            />
          </div>
        );
      case 'savings':
        return (
          <div className="panel-page panel-page--narrow">
            <SavingsPanel
              savings={db.savings}
              onCreate={handleCreateGoal}
              onMutate={handleMutateSavings}
              onDelete={handleDeleteSavings}
            />
          </div>
        );
      case 'insights':
        return <InsightsScreen insights={insights} />;
      case 'more':
        return (
          <MoreScreen
            userEmail={user?.email}
            onSignOut={onSignOut}
            onExport={db.exportData}
            onImport={handleImport}
            desktopMode={isDesktop}
          />
        );
      default:
        return null;
    }
  };

  if (isDesktop) {
    return (
      <div className="admin-shell">
        <Sidebar active={tab} onChange={setTab} />
        <div className="admin-main">
          <TopBar
            tab={tab}
            syncLabel={syncLabel}
            syncColor={syncColor}
            userEmail={user?.email}
            onExport={db.exportData}
            onImport={() => fileInputRef.current?.click()}
            onSignOut={onSignOut}
          />
          <main className="admin-content">{renderContent()}</main>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          style={{ display: 'none' }}
          onChange={handleImport}
        />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <AppHeader tab={tab} syncLabel={syncLabel} syncColor={syncColor} />
      <main className="app-content">{renderContent()}</main>
      <BottomNav active={tab} onChange={setTab} />
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleImport}
      />
    </div>
  );
}
