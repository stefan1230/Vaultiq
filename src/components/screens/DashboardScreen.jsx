import React from 'react';
import { formatLKR } from '../../utils/format';
import StatCard from '../StatCard';

function HeroCard({ insights }) {
  const netPositive = insights.netPosition >= 0;
  return (
    <div className="hero-card fade-in">
      <p className="hero-card__label">Total Debt</p>
      <p className="hero-card__value tabular">{formatLKR(insights.totalDebt)}</p>
      <div className="hero-card__footer">
        <div className="hero-card__stat">
          <span className="hero-card__stat-label">Net position</span>
          <span
            className="hero-card__stat-value tabular"
            style={{ color: netPositive ? 'var(--emerald)' : 'var(--rose)' }}
          >
            {netPositive ? '+' : ''}{formatLKR(insights.netPosition)}
          </span>
        </div>
        <div className="hero-card__stat">
          <span className="hero-card__stat-label">Saved</span>
          <span className="hero-card__stat-value tabular" style={{ color: 'var(--emerald)' }}>
            {formatLKR(insights.totalSaved)}
          </span>
        </div>
      </div>
    </div>
  );
}

function QuickInsight({ icon, title, value, color }) {
  return (
    <div className="quick-insight fade-in">
      <span className="quick-insight__icon">{icon}</span>
      <div>
        <p className="quick-insight__title">{title}</p>
        <p className="quick-insight__value tabular" style={{ color: color || 'var(--text)' }}>{value}</p>
      </div>
    </div>
  );
}

function DebtSplitBar({ insights }) {
  const total = insights.ccDebt + insights.loanDebt || 1;
  const ccPct = (insights.ccDebt / total) * 100;
  const loanPct = (insights.loanDebt / total) * 100;

  return (
    <section className="section-card fade-in">
      <h2 className="section-card__title">Debt split</h2>
      <div className="split-bar">
        <div className="split-bar__track">
          <div className="split-bar__cc" style={{ width: `${ccPct}%` }} />
          <div className="split-bar__loan" style={{ width: `${loanPct}%` }} />
        </div>
      </div>
      <div className="split-legend">
        <span><i className="dot dot--amber" /> Cards {formatLKR(insights.ccDebt)}</span>
        <span><i className="dot dot--violet" /> Loans {formatLKR(insights.loanDebt)}</span>
      </div>
    </section>
  );
}

function AccountSnapshot({ items, onNavigate }) {
  if (items.length === 0) return null;
  return (
    <section className="section-card fade-in">
      <div className="section-card__row">
        <h2 className="section-card__title">Accounts</h2>
        <button type="button" className="link-btn" onClick={() => onNavigate('debts')}>View all</button>
      </div>
      <div className="snapshot-list">
        {items.slice(0, 4).map(({ account, pct, label }) => (
          <button
            key={account.id}
            type="button"
            className="snapshot-item"
            onClick={() => onNavigate('debts')}
          >
            <div className="snapshot-item__top">
              <span className="snapshot-item__name">{account.name}</span>
              <span className="snapshot-item__bal tabular">{formatLKR(account.currentBalance)}</span>
            </div>
            <div className="snapshot-item__bar">
              <div className="snapshot-item__fill" style={{ width: `${pct}%` }} />
            </div>
            <span className="snapshot-item__pct">{pct.toFixed(0)}{label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default function DashboardScreen({ insights, onNavigate }) {
  const top = insights.topPerformer;

  return (
    <div className="screen dashboard-admin">
      <div className="dashboard-admin__hero">
        <HeroCard insights={insights} />
      </div>

      <div className="dashboard-admin__stats stat-grid-mobile">
        <StatCard label="Interest paid" value={formatLKR(insights.totalInterest)} color="rose" />
        <StatCard label="Total paid down" value={formatLKR(insights.totalPaydown)} color="emerald" />
        <StatCard label="Months tracked" value={String(insights.distinctMonths)} color="violet" />
        <StatCard label="Savings goals" value={String(insights.savingsGoalCount)} color="amber" />
      </div>

      <div className="dashboard-admin__quick quick-insights-grid">
        {top && (
          <QuickInsight
            icon="🏆"
            title="Top progress"
            value={`${top.account.name} · ${top.pct.toFixed(0)}%`}
            color="var(--emerald)"
          />
        )}
        {insights.lastMonth && (
          <QuickInsight
            icon="📅"
            title={`Payments (${insights.lastMonth})`}
            value={formatLKR(insights.lastMonthPayments)}
            color="var(--blue)"
          />
        )}
        <QuickInsight
          icon="💳"
          title="Credit utilization"
          value={`${insights.avgCcUtilization.toFixed(0)}% avg`}
          color="var(--amber)"
        />
        <QuickInsight
          icon="📊"
          title="Portfolio"
          value={`${insights.ccCount} cards · ${insights.loanCount} loans`}
        />
      </div>

      <div className="dashboard-admin__split">
        <DebtSplitBar insights={insights} />
      </div>

      <div className="dashboard-admin__accounts">
        <AccountSnapshot items={insights.accountProgress} onNavigate={onNavigate} />
      </div>

      {insights.recentActivity.length > 0 && (
        <section className="section-card fade-in dashboard-admin__activity">
          <h2 className="section-card__title">Recent activity</h2>
          <div className="activity-list">
            {insights.recentActivity.map((st, i) => (
              <div key={st.id || i} className="activity-item slide-in">
                <div>
                  <p className="activity-item__name">{st.accountName}</p>
                  <p className="activity-item__month">{st.month}</p>
                </div>
                <div className="activity-item__amounts">
                  <span className="tabular" style={{ color: 'var(--emerald)' }}>
                    ↓ {st.balanceDrop.toLocaleString()}
                  </span>
                  <span className="tabular" style={{ color: 'var(--rose)' }}>
                    int {st.interestCharged.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
