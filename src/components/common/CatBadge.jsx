import React from "react";
import { catMeta } from "../../data/categories";

export default function CatBadge({ name, size = 34 }) {
  const meta = catMeta(name);
  const Icon = meta.icon;
  return (
    <span className="cat-badge" style={{ "--cat-color": meta.color, width: size, height: size }}>
      <Icon size={size * 0.5} strokeWidth={2.2} />
    </span>
  );
}
