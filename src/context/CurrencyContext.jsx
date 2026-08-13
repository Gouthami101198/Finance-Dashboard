import React, { createContext, useContext, useState } from "react";
import { CURRENCIES, DEFAULT_CURRENCY } from "../data/currencies";
import { formatCurrency, toDisplayAmount, toBaseAmount } from "../utils/format";

const CurrencyContext = createContext(null);

export function CurrencyProvider({ children }) {
  const [currency, setCurrencyState] = useState(() => {
    if (typeof window === "undefined") return DEFAULT_CURRENCY;
    const saved = window.localStorage.getItem("fd-currency");
    return CURRENCIES.find((c) => c.code === saved) || DEFAULT_CURRENCY;
  });

  function setCurrency(code) {
    const next = CURRENCIES.find((c) => c.code === code);
    if (!next) return;
    setCurrencyState(next);
    window.localStorage.setItem("fd-currency", next.code);
  }

  const value = {
    currency,
    setCurrency,
    // All amounts are stored in INR; these helpers convert for display/editing.
    formatAmount: (amountInINR) => formatCurrency(amountInINR, currency),
    toDisplay: (amountInINR) => toDisplayAmount(amountInINR, currency),
    toBase: (displayAmount) => toBaseAmount(displayAmount, currency),
  };

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within a CurrencyProvider");
  return ctx;
}
