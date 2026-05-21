import React from 'react';
import { PAGE_TITLES } from '../../utils/navigation';

export default function AppHeader({ tab, syncLabel, syncColor, subtitle }) {
  return (
    <header className="app-header">
      <div className="app-header__brand">
        <h1 className="app-header__title">
          Vault<span className="app-header__accent">iq</span>
        </h1>
        <p className="app-header__subtitle">
          {subtitle || PAGE_TITLES[tab] || 'Dashboard'}
        </p>
      </div>
      <div className="app-header__status" style={{ color: syncColor }}>
        {syncLabel}
      </div>
    </header>
  );
}
