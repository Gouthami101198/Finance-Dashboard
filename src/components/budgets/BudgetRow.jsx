import React from "react";
import CatBadge from "../common/CatBadge";
import ProgressBar from "../common/ProgressBar";
import BudgetEditor from "./BudgetEditor";
import { useCurrency } from "../../context/CurrencyContext";

export default function BudgetRow({ b, onSaveLimit }) {
  const { formatAmount } = useCurrency();

  return (
    <div className="budget-row">
      <CatBadge name={b.name} size={38} />
      <div className="info">
        <div className="top-line">
          <b>{b.name}</b>
          <span className={`budget-tag ${b.tone}`}>{b.tone === "over" ? "Over budget" : b.tone === "warn" ? "Near limit" : "On track"}</span>
        </div>
        <ProgressBar pct={b.pct} tone={b.tone} />
        <div className="figures" style={{ marginTop: 6 }}>
          {formatAmount(b.spent)} spent of {formatAmount(b.limit)} ({Math.round(b.pct)}%)
        </div>
      </div>
      <BudgetEditor name={b.name} limit={b.limit} onSave={onSaveLimit} />
    </div>
  );
}
