import React from "react";
import { Wallet, LayoutDashboard, List, PiggyBank, Repeat, Target, Landmark, Settings, LogOut, X } from "lucide-react";

const NAV_ITEMS = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "transactions", label: "Transactions", icon: List },
  { key: "budgets", label: "Budgets", icon: PiggyBank },
  { key: "bills", label: "Bills", icon: Repeat },
  { key: "goals", label: "Goals", icon: Target },
  { key: "accounts", label: "Accounts", icon: Landmark },
];

const SETTINGS_ITEM = { key: "settings", label: "Settings", icon: Settings };

export default function Sidebar({ view, setView, open, onClose, onLogout, userName }) {
  function go(key) {
    setView(key);
    onClose();
  }

  return (
    <>
      {open && (
        <div
          className="fd-scrim"
          style={{ display: "block", position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 80 }}
          onClick={onClose}
        />
      )}
      <aside className={`fd-sidebar ${open ? "open" : ""}`}>
        <div className="fd-brand">
          <div className="mark">
            <Wallet size={17} color="#fff" />
          </div>
          <div>
            <h1>Finance</h1>
            <span>Finance Dashboard</span>
          </div>
          <button className="fd-close-sidebar" onClick={onClose} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <nav className="fd-nav">
          {NAV_ITEMS.map((n) => (
            <button key={n.key} className={view === n.key ? "active" : ""} onClick={() => go(n.key)}>
              <n.icon size={17} /> {n.label}
            </button>
          ))}
        </nav>

        <div className="fd-nav fd-nav-secondary">
          <button className={view === SETTINGS_ITEM.key ? "active" : ""} onClick={() => go(SETTINGS_ITEM.key)}>
            <SETTINGS_ITEM.icon size={17} /> {SETTINGS_ITEM.label}
          </button>
          <button onClick={onLogout} className="fd-logout">
            <LogOut size={17} /> Log out
          </button>
        </div>

        <div className="fd-sidebar-foot">
          {userName ? `Signed in as ${userName}.` : ""} All figures shown are sample data for demonstration only.
        </div>
      </aside>
    </>
  );
}
