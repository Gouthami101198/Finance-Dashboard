// Rates are relative to INR (the currency all dummy data is stored in),
// e.g. 1 INR = 0.012 USD. Values are illustrative, not live market rates.
export const CURRENCIES = [
  { code: "INR", symbol: "\u20B9", label: "INR — Indian Rupee", rate: 1, locale: "en-IN" },
  { code: "USD", symbol: "$", label: "USD — US Dollar", rate: 0.012, locale: "en-US" },
  { code: "EUR", symbol: "\u20AC", label: "EUR — Euro", rate: 0.011, locale: "de-DE" },
  { code: "GBP", symbol: "\u00A3", label: "GBP — British Pound", rate: 0.0095, locale: "en-GB" },
];

export const DEFAULT_CURRENCY = CURRENCIES[0];
