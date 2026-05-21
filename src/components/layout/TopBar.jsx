import React from 'react';
import ThemeToggle from '../ThemeToggle';
import { PAGE_TITLES } from '../../utils/navigation';

export default function TopBar({
  tab,
  syncLabel,
  syncColor,
  userEmail,
  onExport,
  onImport,
  onSignOut,
}) {
  return (
    <header className="admin-topbar">
      <div className="admin-topbar__left">
        <h2 className="admin-topbar__title">{PAGE_TITLES[tab] || 'Dashboard'}</h2>
        <p className="admin-topbar__sync" style={{ color: syncColor }}>{syncLabel}</p>
      </div>
      <div className="admin-topbar__actions">
        {userEmail && (
          <span className="admin-topbar__email" title={userEmail}>
            {userEmail}
          </span>
        )}
        <ThemeToggle />
        <button type="button" className="admin-topbar__btn" onClick={onExport}>
          Export
        </button>
        <button type="button" className="admin-topbar__btn" onClick={onImport}>
          Import
        </button>
        <button type="button" className="admin-topbar__btn admin-topbar__btn--ghost" onClick={onSignOut}>
          Sign out
        </button>
      </div>
    </header>
  );
}
