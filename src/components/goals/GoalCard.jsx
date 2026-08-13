import React from "react";
import { Edit2, Trash2, PlusCircle } from "lucide-react";
import { goalIconMeta } from "../../data/goals";
import { useCurrency } from "../../context/CurrencyContext";
import ProgressBar from "../common/ProgressBar";

export default function GoalCard({ goal, onEdit, onDelete, onAddFunds }) {
  const { formatAmount } = useCurrency();
  const meta = goalIconMeta(goal.iconKey);
  const Icon = meta.icon;
  const pct = goal.target > 0 ? Math.min((goal.saved / goal.target) * 100, 100) : 0;
  const tone = pct >= 100 ? "ok" : pct >= 60 ? "ok" : pct >= 25 ? "warn" : "over";
  const reached = pct >= 100;

  return (
    <div className="card goal-card">
      <div className="account-top">
        <span className="cat-badge" style={{ "--cat-color": meta.color, width: 40, height: 40 }}>
          <Icon size={19} />
        </span>
        <div className="account-actions">
          <button className="icon-btn" onClick={() => onEdit(goal)} aria-label={`Edit ${goal.name}`}><Edit2 size={14} /></button>
          <button className="icon-btn danger-hover" onClick={() => onDelete(goal)} aria-label={`Delete ${goal.name}`}><Trash2 size={14} /></button>
        </div>
      </div>
      <div className="account-name">{goal.name}</div>
      <div className="account-type">Target by {new Date(goal.targetDate + "T00:00:00").toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</div>

      <div style={{ margin: "14px 0 6px" }}>
        <ProgressBar pct={pct} tone={reached ? "ok" : tone === "over" ? "over" : tone === "warn" ? "warn" : "ok"} />
      </div>
      <div className="figures" style={{ display: "flex", justifyContent: "space-between" }}>
        <span>{formatAmount(goal.saved)} saved</span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className="figures" style={{ marginBottom: 14 }}>of {formatAmount(goal.target)} goal</div>

      <button className="btn ghost" style={{ width: "100%", justifyContent: "center" }} onClick={() => onAddFunds(goal)} disabled={reached}>
        <PlusCircle size={15} /> {reached ? "Goal reached" : "Add funds"}
      </button>
    </div>
  );
}
