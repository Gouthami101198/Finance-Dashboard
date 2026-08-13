import React from "react";
import { Edit2, Trash2, Zap } from "lucide-react";
import CatBadge from "../common/CatBadge";
import { billStatus } from "../../data/bills";
import { useCurrency } from "../../context/CurrencyContext";

const STATUS_META = {
  paid: { label: "Paid this cycle", tone: "ok" },
  "due-soon": { label: "Due soon", tone: "warn" },
  upcoming: { label: "Upcoming", tone: "neutral" },
};

export default function BillRow({ bill, onEdit, onDelete }) {
  const { formatAmount } = useCurrency();
  const status = STATUS_META[billStatus(bill.dueDay)];

  return (
    <div className="bill-row">
      <CatBadge name={bill.category} />
      <div className="bill-info">
        <div className="bill-top">
          <span className="bill-name">{bill.name}</span>
          {bill.autopay && (
            <span className="autopay-chip">
              <Zap size={11} /> Autopay
            </span>
          )}
        </div>
        <div className="bill-meta">
          {bill.category} · Due day {bill.dueDay} · {bill.frequency}
        </div>
      </div>
      <div className="bill-amount">{formatAmount(bill.amount)}</div>
      <span className={`budget-tag ${status.tone}`}>{status.label}</span>
      <div className="t-actions">
        <button className="icon-btn" onClick={() => onEdit(bill)} aria-label={`Edit ${bill.name}`}><Edit2 size={14} /></button>
        <button className="icon-btn danger-hover" onClick={() => onDelete(bill)} aria-label={`Delete ${bill.name}`}><Trash2 size={14} /></button>
      </div>
    </div>
  );
}
