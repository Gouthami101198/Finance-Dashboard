import {
  Wallet, Utensils, Car, ShoppingBag, Receipt, Film, HeartPulse,
  ShoppingCart, MoreHorizontal,
} from "lucide-react";

export const CATEGORIES = [
  { name: "Food & Dining", icon: Utensils, color: "#B5473A" },
  { name: "Transportation", icon: Car, color: "#4A6FA5" },
  { name: "Shopping", icon: ShoppingBag, color: "#7A5C8E" },
  { name: "Bills & Utilities", icon: Receipt, color: "#B8862E" },
  { name: "Entertainment", icon: Film, color: "#2E8B8B" },
  { name: "Health", icon: HeartPulse, color: "#A0623D" },
  { name: "Groceries", icon: ShoppingCart, color: "#2F6F4E" },
  { name: "Other", icon: MoreHorizontal, color: "#8A8F86" },
];

export const INCOME_CATEGORY = { name: "Income", icon: Wallet, color: "#2F6F4E" };

export const ALL_CATEGORIES = [INCOME_CATEGORY, ...CATEGORIES];

export const catMeta = (name) =>
  ALL_CATEGORIES.find((c) => c.name === name) || CATEGORIES[7];

export const MONTHS = ["2026-03", "2026-04", "2026-05", "2026-06", "2026-07", "2026-08"];

export const CURRENT_MONTH = MONTHS[MONTHS.length - 1];

export const monthLabel = (key) => {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-IN", { month: "short", year: "numeric" });
};

export const DEFAULT_BUDGETS = {
  "Food & Dining": 6000,
  Transportation: 4000,
  Shopping: 5000,
  "Bills & Utilities": 22000,
  Entertainment: 2500,
  Health: 3000,
  Groceries: 8000,
  Other: 2000,
};
