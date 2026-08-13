import React, { useState, useEffect, useRef } from "react";
import { X, ChevronDown } from "lucide-react";
import { CATEGORIES, INCOME_CATEGORY, CURRENT_MONTH } from "../../data/categories";
import { useCurrency } from "../../context/CurrencyContext";

function validate(f) {
  const e = {};
  if (!f.amount || isNaN(Number(f.amount)) || Number(f.amount) <= 0) e.amount = "Enter an amount greater than 0.";
  if (!f.category) e.category = "Choose a category.";
  if (!f.date) e.date = "Choose a date.";
  if (f.note && f.note.trim().length > 60) e.note = "Keep the note under 60 characters.";
  return e;
}

export default function ExpenseModal({ mode, initial, onClose, onSave }) {
  const { currency, toDisplay, toBase } = useCurrency();

  // `initial` (when editing) carries the amount in base INR; the form works
  // in the currently selected display currency and converts back on submit.
  const [form, setForm] = useState(() =>
    initial
      ? { ...initial, amount: String(toDisplay(Number(initial.amount))) }
      : { type: "expense", category: CATEGORIES[0].name, amount: "", date: CURRENT_MONTH + "-01", note: "" }
  );
  const [errors, setErrors] = useState({});
  const firstRef = useRef(null);

  useEffect(() => {
    firstRef.current && firstRef.current.focus();
  }, []);

  const categoryOptions = form.type === "income" ? [INCOME_CATEGORY] : CATEGORIES;

  function handleType(type) {
    setForm((f) => ({ ...f, type, category: type === "income" ? INCOME_CATEGORY.name : CATEGORIES[0].name }));
  }

  function submit(e) {
    e.preventDefault();
    const eobj = validate(form);
    setErrors(eobj);
    if (Object.keys(eobj).length) return;
    onSave({ ...form, amount: toBase(Number(form.amount)) });
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-panel">
        <div className="modal-head">
          <h3>{mode === "edit" ? "Edit transaction" : "Add transaction"}</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={submit} className="modal-form" noValidate>
          <div className="type-toggle" role="radiogroup" aria-label="Transaction type">
            <button type="button" role="radio" aria-checked={form.type === "expense"} className={form.type === "expense" ? "active" : ""} onClick={() => handleType("expense")}>
              Expense
            </button>
            <button type="button" role="radio" aria-checked={form.type === "income"} className={form.type === "income" ? "active" : ""} onClick={() => handleType("income")}>
              Income
            </button>
          </div>

          <label className="field">
            <span>Amount ({currency.code})</span>
            <div className="amount-input">
              <span>{currency.symbol}</span>
              <input
                ref={firstRef}
                inputMode="decimal"
                placeholder="0.00"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                aria-invalid={!!errors.amount}
              />
            </div>
            {errors.amount && <em className="err">{errors.amount}</em>}
          </label>

          <label className="field">
            <span>Category</span>
            <div className="select-wrap">
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} aria-invalid={!!errors.category}>
                {categoryOptions.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} />
            </div>
            {errors.category && <em className="err">{errors.category}</em>}
          </label>

          <label className="field">
            <span>Date</span>
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} aria-invalid={!!errors.date} />
            {errors.date && <em className="err">{errors.date}</em>}
          </label>

          <label className="field">
            <span>
              Note <em className="optional">(optional)</em>
            </span>
            <input type="text" placeholder="What was this for?" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} aria-invalid={!!errors.note} />
            {errors.note && <em className="err">{errors.note}</em>}
          </label>

          <div className="modal-actions">
            <button type="button" className="btn ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn primary">
              {mode === "edit" ? "Save changes" : "Add transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
