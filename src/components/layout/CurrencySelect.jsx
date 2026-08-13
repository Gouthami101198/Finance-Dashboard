import React from "react";
import { ChevronDown } from "lucide-react";
import { CURRENCIES } from "../../data/currencies";
import { useCurrency } from "../../context/CurrencyContext";

export default function CurrencySelect() {
  const { currency, setCurrency } = useCurrency();
  return (
    <div className="month-select">
      <select value={currency.code} onChange={(e) => setCurrency(e.target.value)} aria-label="Select currency">
        {CURRENCIES.map((c) => (
          <option key={c.code} value={c.code}>
            {c.symbol} {c.code}
          </option>
        ))}
      </select>
      <ChevronDown size={15} />
    </div>
  );
}
