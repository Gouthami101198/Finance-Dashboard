import React, { useMemo } from "react";
import { Target, PiggyBank } from "lucide-react";
import GoalCard from "../components/goals/GoalCard";
import { useCurrency } from "../context/CurrencyContext";

export default function GoalsPage({ goals, onEdit, onDelete, onAddFunds }) {
  const { formatAmount } = useCurrency();

  const totalSaved = useMemo(() => goals.reduce((s, g) => s + g.saved, 0), [goals]);
  const totalTarget = useMemo(() => goals.reduce((s, g) => s + g.target, 0), [goals]);
  const overallPct = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;
  const reachedCount = goals.filter((g) => g.saved >= g.target).length;

  return (
    <>
      <div className="summary-grid">
        <div className="card stat-card balance-card">
          <div className="label">Total saved</div>
          <div className="value num">{formatAmount(totalSaved)}</div>
          <div className="sub">{overallPct}% of all goal targets</div>
        </div>
        <div className="card stat-card tone-emerald">
          <div className="icon-chip"><Target size={17} /></div>
          <div className="label">Total target</div>
          <div className="value num">{formatAmount(totalTarget)}</div>
          <div className="sub">across {goals.length} goals</div>
        </div>
        <div className="card stat-card tone-amber">
          <div className="icon-chip"><PiggyBank size={17} /></div>
          <div className="label">Goals reached</div>
          <div className="value num">{reachedCount} / {goals.length}</div>
          <div className="sub">fully funded</div>
        </div>
      </div>

      {goals.length === 0 ? (
        <div className="card panel">
          <div className="empty-state">
            <h4>No savings goals yet</h4>
            <p>Add a goal to start tracking progress toward it.</p>
          </div>
        </div>
      ) : (
        <div className="cards-grid">
          {goals.map((g) => (
            <GoalCard key={g.id} goal={g} onEdit={onEdit} onDelete={onDelete} onAddFunds={onAddFunds} />
          ))}
        </div>
      )}
    </>
  );
}
