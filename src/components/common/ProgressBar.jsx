import React, { useState, useEffect } from "react";

export default function ProgressBar({ pct, tone }) {
  const target = Math.min(pct, 100);
  const [width, setWidth] = useState(0);

  // Animate from 0 on mount/update so the bar visibly fills rather than snapping.
  useEffect(() => {
    const raf = requestAnimationFrame(() => setWidth(target));
    return () => cancelAnimationFrame(raf);
  }, [target]);

  return (
    <div className="pbar-track">
      <div className={`pbar-fill tone-${tone}`} style={{ width: `${width}%` }} />
    </div>
  );
}
