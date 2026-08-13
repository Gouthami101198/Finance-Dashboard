import React from "react";
import CatBadge from "../common/CatBadge";
import ProgressBar from "../common/ProgressBar";
import { useCurrency } from "../../context/CurrencyContext";

export default function BudgetWatch({ budgetRows, onManage }) {
  const { formatAmount } = useCurrency();

  return (
    <div className="card panel">
      <div className="panel-head">
        <h3>Budget watch</h3>
        <button className="btn ghost" style={{ padding: "6px 12px" }} onClick={onManage}>
          Manage
        </button>
      </div>
      {budgetRows.slice(0, 4).map((b) => (
        <div className="budget-row" key={b.name}>
          <CatBadge name={b.name} size={30} />
          <div className="info">
            <div className="top-line">
              <b>{b.name}</b> <span className="figures">{formatAmount(b.spent)} / {formatAmount(b.limit)}</span>
            </div>
            <ProgressBar pct={b.pct} tone={b.tone} />
          </div>
        </div>
      ))}
    </div>
  );
}
