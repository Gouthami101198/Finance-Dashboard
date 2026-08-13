import React from "react";

export default function ConfirmModal({
  title = "Are you sure?",
  text,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = true,
  onCancel,
  onConfirm,
}) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" onMouseDown={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="modal-panel small">
        <div className="modal-head">
          <h3>{title}</h3>
        </div>
        <p className="confirm-text">{text}</p>
        <div className="modal-actions">
          <button className="btn ghost" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button className={`btn ${danger ? "danger" : "primary"}`} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
