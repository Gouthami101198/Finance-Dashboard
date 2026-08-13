import React from "react";
import BudgetRow from "../components/budgets/BudgetRow";

export default function BudgetsPage({ budgetRows, monthLabelText, onSaveLimit }) {
  return (
    <div className="card panel">
      <div className="panel-head">
        <h3>Monthly budgets — {monthLabelText}</h3>
      </div>
      {budgetRows.map((b) => (
        <BudgetRow key={b.name} b={b} onSaveLimit={onSaveLimit} />
      ))}
    </div>
  );
}
