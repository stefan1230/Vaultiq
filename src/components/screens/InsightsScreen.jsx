import React from 'react';
import { formatLKR } from '../../utils/format';
import { DEBT_TYPES } from '../../utils/accounts';

function MetricRow({ label, value, hint, color }) {
  return (
    <div className="metric-row">
      <div>
        <p className="metric-row__label">{label}</p>
        {hint && <p className="metric-row__hint">{hint}</p>}
      </div>
      <p className="metric-row__value tabular" style={{ color: color || 'var(--text)' }}>{value}</p>
    </div>
  );
}

function ProgressList({ items }) {
  return (
    <div className="progress-list">
      {items.map(({ account, pct, label }) => (
        <div key={account.id} className="progress-list__item">
          <div className="progress-list__header">
            <span className="progress-list__name">
              {DEBT_TYPES[account.type]?.icon} {account.name}
            </span>
            <span className="progress-list__pct tabular">{pct.toFixed(0)}%</span>
          </div>
          <div className="progress-list__track">
            <div
              className="progress-list__fill"
              style={{
                width: `${pct}%`,
                background: account.type === 'loan'
                  ? 'linear-gradient(90deg, var(--violet), #c4b5fd)'
                  : 'linear-gradient(90deg, var(--amber), #fbbf24)',
              }}
            />
          </div>
          <p className="progress-list__sub tabular">
            {formatLKR(account.currentBalance)} · {label}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function InsightsScreen({ insights }) {
  const ratioLabel = insights.debtToSavingsRatio != null
    ? `${insights.debtToSavingsRatio.toFixed(1)}× debt vs savings`
    : 'No savings yet';

  return (
    <div className="screen insights-admin">
      <section className="section-card fade-in">
        <h2 className="section-card__title">Financial overview</h2>
        <MetricRow label="Total debt" value={formatLKR(insights.totalDebt)} color="var(--amber)" />
        <MetricRow label="Total savings" value={formatLKR(insights.totalSaved)} color="var(--emerald)" />
        <MetricRow
          label="Net position"
          value={formatLKR(insights.netPosition)}
          color={insights.netPosition >= 0 ? 'var(--emerald)' : 'var(--rose)'}
          hint="Savings minus debt"
        />
        <MetricRow label="Debt ratio" value={ratioLabel} />
      </section>

      <section className="section-card fade-in">
        <h2 className="section-card__title">Payments &amp; interest</h2>
        <MetricRow label="All-time payments" value={formatLKR(insights.totalPayments)} color="var(--blue)" />
        <MetricRow label="Principal reduced" value={formatLKR(insights.totalPaydown)} color="var(--emerald)" />
        <MetricRow label="Interest charged (est.)" value={formatLKR(insights.totalInterest)} color="var(--rose)" />
        {insights.lastMonth && (
          <MetricRow
            label={`Last month (${insights.lastMonth})`}
            value={formatLKR(insights.lastMonthPayments)}
          />
        )}
      </section>

      <section className="section-card fade-in">
        <h2 className="section-card__title">Savings health</h2>
        <MetricRow
          label="Goals progress"
          value={`${insights.savingsProgress.toFixed(0)}%`}
          hint={formatLKR(insights.totalSaved) + ' of ' + formatLKR(insights.totalSavingsTarget)}
          color="var(--emerald)"
        />
        <div className="progress-list__track" style={{ marginTop: '8px' }}>
          <div
            className="progress-list__fill"
            style={{
              width: `${insights.savingsProgress}%`,
              background: 'linear-gradient(90deg, var(--emerald), var(--cyan))',
            }}
          />
        </div>
      </section>

      {insights.highestBalance && (
        <section className="section-card fade-in">
          <h2 className="section-card__title">Largest liability</h2>
          <p className="insight-highlight tabular">{insights.highestBalance.name}</p>
          <p className="insight-highlight__sub tabular">{formatLKR(insights.highestBalance.currentBalance)}</p>
        </section>
      )}

      {insights.accountProgress.length > 0 && (
        <section className="section-card fade-in">
          <h2 className="section-card__title">Paydown by account</h2>
          <ProgressList items={insights.accountProgress} />
        </section>
      )}

      {insights.recentActivity.length > 0 && (
        <section className="section-card fade-in">
          <h2 className="section-card__title">Statement timeline</h2>
          <div className="timeline">
            {insights.recentActivity.map((st, i) => (
              <div key={st.id || i} className="timeline__item">
                <div className="timeline__dot" />
                <div className="timeline__body">
                  <p className="timeline__title">{st.accountName}</p>
                  <p className="timeline__meta">{st.month}</p>
                  <p className="timeline__detail tabular">
                    Paid {st.paymentMade.toLocaleString()} · ↓{st.balanceDrop.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
