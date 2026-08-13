import React, { useState, useRef, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import { CATEGORIES } from "../../data/categories";
import { FREQUENCIES } from "../../data/bills";
import { useCurrency } from "../../context/CurrencyContext";

function validate(f) {
  const e = {};
  if (!f.name || !f.name.trim()) e.name = "Give the bill a name.";
  if (!f.amount || isNaN(Number(f.amount)) || Number(f.amount) <= 0) e.amount = "Enter an amount greater than 0.";
  const day = Number(f.dueDay);
  if (!f.dueDay || isNaN(day) || day < 1 || day > 31) e.dueDay = "Due day must be between 1 and 31.";
  return e;
}

export default function BillModal({ mode, initial, onClose, onSave }) {
  const { toDisplay, toBase, currency } = useCurrency();
  const [form, setForm] = useState(() =>
    initial
      ? { ...initial, amount: String(toDisplay(Number(initial.amount))), dueDay: String(initial.dueDay) }
      : { name: "", category: CATEGORIES[0].name, amount: "", dueDay: "1", frequency: "Monthly", autopay: false }
  );
  const [errors, setErrors] = useState({});
  const firstRef = useRef(null);
  useEffect(() => { firstRef.current && firstRef.current.focus(); }, []);

  function submit(e) {
    e.preventDefault();
    const eobj = validate(form);
    setErrors(eobj);
    if (Object.keys(eobj).length) return;
    onSave({ ...form, amount: toBase(Number(form.amount)), dueDay: Number(form.dueDay) });
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-panel">
        <div className="modal-head">
          <h3>{mode === "edit" ? "Edit bill" : "Add bill"}</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>
        <form onSubmit={submit} className="modal-form" noValidate>
          <label className="field">
            <span>Bill name</span>
            <input ref={firstRef} type="text" placeholder="e.g. Electricity" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} aria-invalid={!!errors.name} />
            {errors.name && <em className="err">{errors.name}</em>}
          </label>

          <label className="field">
            <span>Category</span>
            <div className="select-wrap">
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select>
              <ChevronDown size={16} />
            </div>
          </label>

          <label className="field">
            <span>Amount ({currency.code})</span>
            <div className="amount-input">
              <span>{currency.symbol}</span>
              <input inputMode="decimal" placeholder="0.00" value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })} aria-invalid={!!errors.amount} />
            </div>
            {errors.amount && <em className="err">{errors.amount}</em>}
          </label>

          <div style={{ display: "flex", gap: 12 }}>
            <label className="field" style={{ flex: 1 }}>
              <span>Due day of month</span>
              <input type="number" min="1" max="31" value={form.dueDay}
                onChange={(e) => setForm({ ...form, dueDay: e.target.value })} aria-invalid={!!errors.dueDay} />
              {errors.dueDay && <em className="err">{errors.dueDay}</em>}
            </label>
            <label className="field" style={{ flex: 1 }}>
              <span>Frequency</span>
              <div className="select-wrap">
                <select value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })}>
                  {FREQUENCIES.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
                <ChevronDown size={16} />
              </div>
            </label>
          </div>

          <label className="checkbox-field">
            <input type="checkbox" checked={form.autopay} onChange={(e) => setForm({ ...form, autopay: e.target.checked })} />
            <span>Autopay enabled</span>
          </label>

          <div className="modal-actions">
            <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn primary">{mode === "edit" ? "Save changes" : "Add bill"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
