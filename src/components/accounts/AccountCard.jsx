import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import { typeMeta } from "../../data/accounts";
import { useCurrency } from "../../context/CurrencyContext";

export default function AccountCard({ account, onEdit, onDelete }) {
  const { formatAmount } = useCurrency();
  const meta = typeMeta(account.type);
  const Icon = meta.icon;
  const isDebt = account.balance < 0;

  return (
    <div className="card account-card">
      <div className="account-top">
        <span className="cat-badge" style={{ "--cat-color": meta.color, width: 40, height: 40 }}>
          <Icon size={19} />
        </span>
        <div className="account-actions">
          <button className="icon-btn" onClick={() => onEdit(account)} aria-label={`Edit ${account.name}`}><Edit2 size={14} /></button>
          <button className="icon-btn danger-hover" onClick={() => onDelete(account)} aria-label={`Delete ${account.name}`}><Trash2 size={14} /></button>
        </div>
      </div>
      <div className="account-name">{account.name}</div>
      <div className="account-type">{meta.label}{account.last4 ? ` · •••• ${account.last4}` : ""}</div>
      <div className={`account-balance ${isDebt ? "neg" : "pos"}`}>{formatAmount(account.balance)}</div>
      {isDebt && <div className="account-note">Amount owed</div>}
    </div>
  );
}
