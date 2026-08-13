import React, { useState, useRef, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import { GOAL_ICONS } from "../../data/goals";
import { useCurrency } from "../../context/CurrencyContext";

function validate(f) {
  const e = {};
  if (!f.name || !f.name.trim()) e.name = "Give the goal a name.";
  if (!f.target || isNaN(Number(f.target)) || Number(f.target) <= 0) e.target = "Enter a target greater than 0.";
  if (f.saved === "" || isNaN(Number(f.saved)) || Number(f.saved) < 0) e.saved = "Enter a valid saved amount.";
  if (!f.targetDate) e.targetDate = "Choose a target date.";
  return e;
}

export default function GoalModal({ mode, initial, onClose, onSave }) {
  const { toDisplay, toBase, currency } = useCurrency();
  const [form, setForm] = useState(() =>
    initial
      ? { ...initial, target: String(toDisplay(Number(initial.target))), saved: String(toDisplay(Number(initial.saved))) }
      : { name: "", iconKey: GOAL_ICONS[0].key, target: "", saved: "0", targetDate: "" }
  );
  const [errors, setErrors] = useState({});
  const firstRef = useRef(null);
  useEffect(() => { firstRef.current && firstRef.current.focus(); }, []);

  function submit(e) {
    e.preventDefault();
    const eobj = validate(form);
    setErrors(eobj);
    if (Object.keys(eobj).length) return;
    onSave({ ...form, target: toBase(Number(form.target)), saved: toBase(Number(form.saved)) });
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-panel">
        <div className="modal-head">
          <h3>{mode === "edit" ? "Edit goal" : "Add goal"}</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>
        <form onSubmit={submit} className="modal-form" noValidate>
          <label className="field">
            <span>Goal name</span>
            <input ref={firstRef} type="text" placeholder="e.g. Goa Vacation" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} aria-invalid={!!errors.name} />
            {errors.name && <em className="err">{errors.name}</em>}
          </label>

          <label className="field">
            <span>Icon</span>
            <div className="icon-picker">
              {GOAL_ICONS.map((g) => {
                const Icon = g.icon;
                return (
                  <button type="button" key={g.key} className={`icon-pick ${form.iconKey === g.key ? "active" : ""}`}
                    style={{ "--cat-color": g.color }} onClick={() => setForm({ ...form, iconKey: g.key })} aria-label={g.key}>
                    <Icon size={16} />
                  </button>
                );
              })}
            </div>
          </label>

          <div style={{ display: "flex", gap: 12 }}>
            <label className="field" style={{ flex: 1 }}>
              <span>Target ({currency.code})</span>
              <div className="amount-input">
                <span>{currency.symbol}</span>
                <input inputMode="decimal" placeholder="0.00" value={form.target}
                  onChange={(e) => setForm({ ...form, target: e.target.value })} aria-invalid={!!errors.target} />
              </div>
              {errors.target && <em className="err">{errors.target}</em>}
            </label>
            <label className="field" style={{ flex: 1 }}>
              <span>Already saved</span>
              <div className="amount-input">
                <span>{currency.symbol}</span>
                <input inputMode="decimal" placeholder="0.00" value={form.saved}
                  onChange={(e) => setForm({ ...form, saved: e.target.value })} aria-invalid={!!errors.saved} />
              </div>
              {errors.saved && <em className="err">{errors.saved}</em>}
            </label>
          </div>

          <label className="field">
            <span>Target date</span>
            <input type="date" value={form.targetDate} onChange={(e) => setForm({ ...form, targetDate: e.target.value })} aria-invalid={!!errors.targetDate} />
            {errors.targetDate && <em className="err">{errors.targetDate}</em>}
          </label>

          <div className="modal-actions">
            <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn primary">{mode === "edit" ? "Save changes" : "Add goal"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
