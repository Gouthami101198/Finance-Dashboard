import React, { useState, useRef, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import { ACCOUNT_TYPES } from "../../data/accounts";
import { useCurrency } from "../../context/CurrencyContext";

function validate(f) {
  const e = {};
  if (!f.name || !f.name.trim()) e.name = "Give the account a name.";
  if (f.balance === "" || isNaN(Number(f.balance))) e.balance = "Enter a valid balance.";
  if (f.last4 && !/^\d{0,4}$/.test(f.last4)) e.last4 = "Up to 4 digits only.";
  return e;
}

export default function AccountModal({ mode, initial, onClose, onSave }) {
  const { toDisplay, toBase, currency } = useCurrency();
  const [form, setForm] = useState(() =>
    initial
      ? { ...initial, balance: String(toDisplay(Number(initial.balance))) }
      : { name: "", type: ACCOUNT_TYPES[0].key, balance: "", last4: "" }
  );
  const [errors, setErrors] = useState({});
  const firstRef = useRef(null);
  useEffect(() => { firstRef.current && firstRef.current.focus(); }, []);

  function submit(e) {
    e.preventDefault();
    const eobj = validate(form);
    setErrors(eobj);
    if (Object.keys(eobj).length) return;
    onSave({ ...form, balance: toBase(Number(form.balance)), last4: form.last4 || null });
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-panel">
        <div className="modal-head">
          <h3>{mode === "edit" ? "Edit account" : "Add account"}</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>
        <form onSubmit={submit} className="modal-form" noValidate>
          <label className="field">
            <span>Account name</span>
            <input ref={firstRef} type="text" placeholder="e.g. HDFC Checking" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} aria-invalid={!!errors.name} />
            {errors.name && <em className="err">{errors.name}</em>}
          </label>

          <label className="field">
            <span>Account type</span>
            <div className="select-wrap">
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                {ACCOUNT_TYPES.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
              </select>
              <ChevronDown size={16} />
            </div>
          </label>

          <label className="field">
            <span>Balance ({currency.code}) <em className="optional">{form.type === "card" ? "— enter amount owed as negative" : ""}</em></span>
            <div className="amount-input">
              <span>{currency.symbol}</span>
              <input inputMode="decimal" placeholder="0.00" value={form.balance}
                onChange={(e) => setForm({ ...form, balance: e.target.value })} aria-invalid={!!errors.balance} />
            </div>
            {errors.balance && <em className="err">{errors.balance}</em>}
          </label>

          <label className="field">
            <span>Last 4 digits <em className="optional">(optional)</em></span>
            <input type="text" inputMode="numeric" maxLength={4} placeholder="e.g. 4821" value={form.last4 || ""}
              onChange={(e) => setForm({ ...form, last4: e.target.value.replace(/\D/g, "") })} aria-invalid={!!errors.last4} />
            {errors.last4 && <em className="err">{errors.last4}</em>}
          </label>

          <div className="modal-actions">
            <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn primary">{mode === "edit" ? "Save changes" : "Add account"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
