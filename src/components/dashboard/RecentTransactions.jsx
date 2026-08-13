import React from "react";
import CatBadge from "../common/CatBadge";
import { fmtDate } from "../../utils/format";
import { useCurrency } from "../../context/CurrencyContext";

export default function RecentTransactions({ transactions, onViewAll, monthLabelText }) {
  const { formatAmount } = useCurrency();

  return (
    <div className="card panel">
      <div className="panel-head">
        <h3>Recent transactions</h3>
        <button className="btn ghost" style={{ padding: "6px 12px" }} onClick={onViewAll}>
          View all
        </button>
      </div>
      {transactions.length === 0 ? (
        <div className="empty-note">No transactions in {monthLabelText} yet.</div>
      ) : (
        transactions.slice(0, 5).map((t) => (
          <div className="recent-row" key={t.id}>
            <CatBadge name={t.category} size={32} />
            <div className="meta">
              <div className="note">{t.note}</div>
              <div className="cat">
                {t.category} · {fmtDate(t.date)}
              </div>
            </div>
            <div className={`amt ${t.type === "income" ? "pos" : "neg"}`}>
              {t.type === "income" ? "+" : "−"}
              {formatAmount(t.amount)}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
