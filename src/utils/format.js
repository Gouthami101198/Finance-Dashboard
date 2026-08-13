export const fmtDate = (d) =>
  new Date(d + "T00:00:00").toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

/** Converts a base amount (stored in INR) into the target currency and formats it. */
export function formatCurrency(amountInINR, currency) {
  const converted = amountInINR * currency.rate;
  const digits = currency.code === "INR" ? 0 : 2;
  return new Intl.NumberFormat(currency.locale, {
    style: "currency",
    currency: currency.code,
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(converted);
}

/** Base (INR) amount -> number in the target currency, for editable form fields. */
export function toDisplayAmount(amountInINR, currency) {
  return +(amountInINR * currency.rate).toFixed(2);
}

/** Number typed in the target currency -> base (INR) amount, for storage. */
export function toBaseAmount(displayAmount, currency) {
  return +(displayAmount / currency.rate).toFixed(2);
}
