import React from 'react';
import { NAV_ITEMS } from '../../utils/navigation';

export default function Sidebar({ active, onChange }) {
  const mainItems = NAV_ITEMS.filter(t => t.id !== 'more');

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__brand">
        <h1 className="admin-sidebar__title">
          Vault<span className="admin-sidebar__accent">iq</span>
        </h1>
        <p className="admin-sidebar__tagline">Finance workspace</p>
      </div>

      <nav className="admin-sidebar__nav" aria-label="Main navigation">
        {mainItems.map(tab => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              className={`admin-sidebar__link${isActive ? ' admin-sidebar__link--active' : ''}`}
              onClick={() => onChange(tab.id)}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="admin-sidebar__icon" aria-hidden>{tab.icon}</span>
              {tab.label}
            </button>
          );
        })}
      </nav>

      <div className="admin-sidebar__footer">
        <button
          type="button"
          className={`admin-sidebar__link${active === 'more' ? ' admin-sidebar__link--active' : ''}`}
          onClick={() => onChange('more')}
        >
          <span className="admin-sidebar__icon" aria-hidden>○</span>
          Settings
        </button>
      </div>
    </aside>
  );
}
