import React, { useMemo } from "react";
import { Repeat, Zap, AlertTriangle, Wallet } from "lucide-react";
import BillRow from "../components/bills/BillRow";
import { billStatus } from "../data/bills";
import { useCurrency } from "../context/CurrencyContext";

export default function BillsPage({ bills, onEdit, onDelete }) {
  const { formatAmount } = useCurrency();

  const monthlyTotal = useMemo(
    () => bills.reduce((s, b) => s + (b.frequency === "Monthly" ? b.amount : b.frequency === "Quarterly" ? b.amount / 3 : b.amount / 12), 0),
    [bills]
  );
  const dueSoonCount = useMemo(() => bills.filter((b) => billStatus(b.dueDay) === "due-soon").length, [bills]);
  const autopayCount = useMemo(() => bills.filter((b) => b.autopay).length, [bills]);

  const sorted = useMemo(() => [...bills].sort((a, b) => a.dueDay - b.dueDay), [bills]);

  return (
    <>
      <div className="summary-grid">
        <div className="card stat-card tone-ink">
          <div className="icon-chip"><Repeat size={17} /></div>
          <div className="label">Est. monthly total</div>
          <div className="value num">{formatAmount(monthlyTotal)}</div>
          <div className="sub">across {bills.length} bills</div>
        </div>
        <div className="card stat-card tone-amber">
          <div className="icon-chip"><AlertTriangle size={17} /></div>
          <div className="label">Due within 5 days</div>
          <div className="value num">{dueSoonCount}</div>
          <div className="sub">need attention</div>
        </div>
        <div className="card stat-card tone-emerald">
          <div className="icon-chip"><Zap size={17} /></div>
          <div className="label">On autopay</div>
          <div className="value num">{autopayCount} / {bills.length}</div>
          <div className="sub">bills</div>
        </div>
        <div className="card stat-card tone-rust">
          <div className="icon-chip"><Wallet size={17} /></div>
          <div className="label">Manual bills</div>
          <div className="value num">{bills.length - autopayCount}</div>
          <div className="sub">require manual payment</div>
        </div>
      </div>

      <div className="card panel">
        <div className="panel-head"><h3>All recurring bills</h3></div>
        {sorted.length === 0 ? (
          <div className="empty-note">No bills added yet.</div>
        ) : (
          sorted.map((b) => <BillRow key={b.id} bill={b} onEdit={onEdit} onDelete={onDelete} />)
        )}
      </div>
    </>
  );
}
