import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { useCurrency } from "../../context/CurrencyContext";

export default function AddFundsModal({ goal, onClose, onAdd }) {
  const { currency, toBase } = useCurrency();
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const firstRef = useRef(null);
  useEffect(() => { firstRef.current && firstRef.current.focus(); }, []);

  function submit(e) {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError("Enter an amount greater than 0.");
      return;
    }
    onAdd(toBase(Number(amount)));
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-panel small">
        <div className="modal-head">
          <h3>Add funds — {goal.name}</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>
        <form onSubmit={submit} className="modal-form" noValidate>
          <label className="field">
            <span>Amount ({currency.code})</span>
            <div className="amount-input">
              <span>{currency.symbol}</span>
              <input ref={firstRef} inputMode="decimal" placeholder="0.00" value={amount}
                onChange={(e) => setAmount(e.target.value)} aria-invalid={!!error} />
            </div>
            {error && <em className="err">{error}</em>}
          </label>
          <div className="modal-actions">
            <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn primary">Add funds</button>
          </div>
        </form>
      </div>
    </div>
  );
}
