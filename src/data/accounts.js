import { Landmark, PiggyBank, Wallet, CreditCard } from "lucide-react";

export const ACCOUNT_TYPES = [
  { key: "bank", label: "Bank Account", icon: Landmark, color: "#4A6FA5" },
  { key: "savings", label: "Savings", icon: PiggyBank, color: "#2F6F4E" },
  { key: "cash", label: "Cash Wallet", icon: Wallet, color: "#B8862E" },
  { key: "card", label: "Credit Card", icon: CreditCard, color: "#7A5C8E" },
];

export const typeMeta = (key) => ACCOUNT_TYPES.find((t) => t.key === key) || ACCOUNT_TYPES[0];

// Card balances are negative (amount owed); everything else is positive.
export const DEFAULT_ACCOUNTS = [
  { id: 1, name: "HDFC Checking", type: "bank", balance: 142500, last4: "4821" },
  { id: 2, name: "Emergency Savings", type: "savings", balance: 268000, last4: "9033" },
  { id: 3, name: "Cash Wallet", type: "cash", balance: 3200, last4: null },
  { id: 4, name: "HDFC Regalia Card", type: "card", balance: -18400, last4: "7712" },
];
