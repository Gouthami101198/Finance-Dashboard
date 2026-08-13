import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import CatBadge from "../common/CatBadge";
import { fmtDate } from "../../utils/format";
import { useCurrency } from "../../context/CurrencyContext";

export default function TransactionRow({ t, onEdit, onDelete }) {
  const { formatAmount } = useCurrency();

  return (
    <div className="t-row">
      <div className="t-desc">
        <CatBadge name={t.category} />
        <div>
          <div className="note">{t.note}</div>
        </div>
      </div>
      <div className="t-date">{fmtDate(t.date)}</div>
      <div className="cat" style={{ fontSize: 13 }}>
        {t.category}
      </div>
      <div className={`t-amt ${t.type === "income" ? "amt pos" : "amt neg"}`}>
        {t.type === "income" ? "+" : "−"}
        {formatAmount(t.amount)}
      </div>
      <div className="t-actions">
        <button className="icon-btn" onClick={() => onEdit(t)} aria-label={`Edit ${t.note}`}>
          <Edit2 size={14} />
        </button>
        <button className="icon-btn danger-hover" onClick={() => onDelete(t.id)} aria-label={`Delete ${t.note}`}>
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
