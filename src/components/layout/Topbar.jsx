import React from "react";
import { Menu } from "lucide-react";

export default function Topbar({ title, subtitle, onMenuClick, children }) {
  return (
    <div className="fd-topbar">
      <div className="titles">
        <button className="fd-hamburger" onClick={onMenuClick} aria-label="Open menu">
          <Menu size={19} />
        </button>
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
      </div>
      <div className="fd-top-actions">{children}</div>
    </div>
  );
}
