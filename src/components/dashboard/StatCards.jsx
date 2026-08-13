import React from "react";
import { TrendingUp, TrendingDown, PiggyBank } from "lucide-react";
import { useCurrency } from "../../context/CurrencyContext";

export default function StatCards({ income, expense, balance, savingsRate, overBudgetCount, totalBudgetCount, monthLabelText }) {
  const { formatAmount } = useCurrency();

  return (
    <div className="summary-grid">
      <div className="card stat-card balance-card">
        <div className="label">Net balance</div>
        <div className="value num">{formatAmount(balance)}</div>
        <div className="sub">{savingsRate >= 0 ? `${savingsRate}% saved this month` : `${Math.abs(savingsRate)}% over income`}</div>
      </div>
      <div className="card stat-card tone-emerald">
        <div className="icon-chip">
          <TrendingUp size={17} />
        </div>
        <div className="label">Income</div>
        <div className="value num">{formatAmount(income)}</div>
        <div className="sub">{monthLabelText}</div>
      </div>
      <div className="card stat-card tone-rust">
        <div className="icon-chip">
          <TrendingDown size={17} />
        </div>
        <div className="label">Expenses</div>
        <div className="value num">{formatAmount(expense)}</div>
        <div className="sub">{monthLabelText}</div>
      </div>
      <div className="card stat-card tone-amber">
        <div className="icon-chip">
          <PiggyBank size={17} />
        </div>
        <div className="label">Budgets over limit</div>
        <div className="value num">
          {overBudgetCount} / {totalBudgetCount}
        </div>
        <div className="sub">categories this month</div>
      </div>
    </div>
  );
}
