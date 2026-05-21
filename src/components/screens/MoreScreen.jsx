import React, { useRef } from 'react';
import ThemeToggle from '../ThemeToggle';

function SettingsRow({ label, description, children }) {
  return (
    <div className="settings-row">
      <div className="settings-row__text">
        <p className="settings-row__label">{label}</p>
        {description && <p className="settings-row__desc">{description}</p>}
      </div>
      <div className="settings-row__action">{children}</div>
    </div>
  );
}

export default function MoreScreen({
  onSignOut,
  onExport,
  onImport,
  userEmail,
  desktopMode,
}) {
  const fileInputRef = useRef();

  return (
    <div className="screen settings-page">
      {!desktopMode && (
        <section className="section-card fade-in">
          <h2 className="section-card__title">Account</h2>
          {userEmail && <p className="settings-email">{userEmail}</p>}
          <button type="button" className="settings-btn settings-btn--danger" onClick={onSignOut}>
            Sign out
          </button>
        </section>
      )}

      {desktopMode && userEmail && (
        <section className="section-card fade-in">
          <h2 className="section-card__title">Account</h2>
          <p className="settings-email">{userEmail}</p>
          <p className="settings-row__desc">Sign out and data tools are in the top bar.</p>
        </section>
      )}

      <section className="section-card fade-in">
        <h2 className="section-card__title">Appearance</h2>
        <SettingsRow label="Theme" description="Light or dark mode">
          <ThemeToggle />
        </SettingsRow>
      </section>

      {!desktopMode && (
        <section className="section-card fade-in">
          <h2 className="section-card__title">Data</h2>
          <SettingsRow label="Backup" description="Export JSON to your device">
            <button type="button" className="settings-btn" onClick={onExport}>
              Export
            </button>
          </SettingsRow>
          <SettingsRow label="Restore" description="Import a previous backup">
            <button
              type="button"
              className="settings-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              Import
            </button>
          </SettingsRow>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            onChange={onImport}
          />
        </section>
      )}

      {desktopMode && (
        <section className="section-card fade-in">
          <h2 className="section-card__title">Data</h2>
          <p className="settings-row__desc">Use Export and Import in the top bar to back up or restore your portfolio.</p>
        </section>
      )}

      <p className="app-version">Vaultiq · Personal finance workspace</p>
    </div>
  );
}
