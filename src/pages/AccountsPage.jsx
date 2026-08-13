import React, { useMemo } from "react";
import { Landmark, TrendingUp, TrendingDown } from "lucide-react";
import AccountCard from "../components/accounts/AccountCard";
import { useCurrency } from "../context/CurrencyContext";

export default function AccountsPage({ accounts, onEdit, onDelete }) {
  const { formatAmount } = useCurrency();

  const netWorth = useMemo(() => accounts.reduce((s, a) => s + a.balance, 0), [accounts]);
  const assets = useMemo(() => accounts.filter((a) => a.balance > 0).reduce((s, a) => s + a.balance, 0), [accounts]);
  const liabilities = useMemo(() => accounts.filter((a) => a.balance < 0).reduce((s, a) => s + Math.abs(a.balance), 0), [accounts]);

  return (
    <>
      <div className="summary-grid">
        <div className="card stat-card balance-card">
          <div className="label">Net worth</div>
          <div className="value num">{formatAmount(netWorth)}</div>
          <div className="sub">across {accounts.length} accounts</div>
        </div>
        <div className="card stat-card tone-emerald">
          <div className="icon-chip"><TrendingUp size={17} /></div>
          <div className="label">Total assets</div>
          <div className="value num">{formatAmount(assets)}</div>
          <div className="sub">bank, savings & cash</div>
        </div>
        <div className="card stat-card tone-rust">
          <div className="icon-chip"><TrendingDown size={17} /></div>
          <div className="label">Total liabilities</div>
          <div className="value num">{formatAmount(liabilities)}</div>
          <div className="sub">card balances owed</div>
        </div>
      </div>

      {accounts.length === 0 ? (
        <div className="card panel">
          <div className="empty-state">
            <h4>No accounts yet</h4>
            <p>Add a bank account, savings account, wallet or card to get started.</p>
          </div>
        </div>
      ) : (
        <div className="cards-grid">
          {accounts.map((a) => (
            <AccountCard key={a.id} account={a} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      )}
    </>
  );
}
