import React from 'react';
import { NAV_ITEMS } from '../../utils/navigation';

export default function BottomNav({ active, onChange }) {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {NAV_ITEMS.map(tab => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            className={`bottom-nav__item${isActive ? ' bottom-nav__item--active' : ''}`}
            onClick={() => onChange(tab.id)}
            aria-current={isActive ? 'page' : undefined}
          >
            <span className="bottom-nav__icon" aria-hidden>{tab.icon}</span>
            <span className="bottom-nav__label">{tab.mobileLabel || tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
