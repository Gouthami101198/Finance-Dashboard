import React, { useState, useEffect } from "react";
import { useCurrency } from "../../context/CurrencyContext";

export default function BudgetEditor({ name, limit, onSave }) {
  const { currency, toDisplay, toBase } = useCurrency();
  const [value, setValue] = useState(String(toDisplay(limit)));

  // Keep the field in sync when the limit changes externally, or when the
  // selected currency changes (re-express the same base amount).
  useEffect(() => setValue(String(toDisplay(limit))), [limit, currency]);

  function handleSave() {
    onSave(name, toBase(Number(value)));
  }

  return (
    <div className="budget-edit">
      <span>{currency.symbol}</span>
      <input inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} aria-label={`Set budget for ${name}`} />
      <button onClick={handleSave}>Save</button>
    </div>
  );
}
