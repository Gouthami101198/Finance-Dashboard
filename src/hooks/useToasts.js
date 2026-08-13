import { useState, useRef } from "react";

/** Simple in-memory toast queue: auto-dismisses each toast after ~3.2s. */
export function useToasts() {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(1000);

  function pushToast(message, kind = "success") {
    const id = idRef.current++;
    setToasts((t) => [...t, { id, message, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }

  function dismissToast(id) {
    setToasts((t) => t.filter((x) => x.id !== id));
  }

  return { toasts, pushToast, dismissToast };
}
