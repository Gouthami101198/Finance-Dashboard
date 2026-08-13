import React, { useState, useEffect } from "react";
import { ChevronDown, Trash2 } from "lucide-react";
import { CURRENCIES } from "../data/currencies";
import { useCurrency } from "../context/CurrencyContext";
import { useTheme } from "../context/ThemeContext";
import Switch from "../components/common/Switch";

function validateProfile(f) {
  const e = {};
  if (!f.name || !f.name.trim()) e.name = "Name is required.";
  if (!f.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "Enter a valid email address.";
  return e;
}

export default function SettingsPage({ profile, onSaveProfile, notifications, onToggleNotification, onResetData }) {
  const { currency, setCurrency } = useCurrency();
  const { theme, toggleTheme } = useTheme();
  const [form, setForm] = useState(profile);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  useEffect(() => setForm(profile), [profile]);
  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => setSaved(false), 2000);
    return () => clearTimeout(t);
  }, [saved]);

  function submit(e) {
    e.preventDefault();
    const eobj = validateProfile(form);
    setErrors(eobj);
    if (Object.keys(eobj).length) return;
    onSaveProfile(form);
    setSaved(true);
  }

  return (
    <div className="settings-grid">
      <div className="card panel">
        <div className="panel-head"><h3>Profile</h3></div>
        <div className="profile-head">
          <span className="avatar-circle">{(form.name || "?").trim().charAt(0).toUpperCase()}</span>
          <div>
            <div className="account-name">{form.name}</div>
            <div className="account-type">Member since {new Date(profile.memberSince + "T00:00:00").toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</div>
          </div>
        </div>
        <form onSubmit={submit} className="modal-form" noValidate style={{ marginTop: 18 }}>
          <label className="field">
            <span>Full name</span>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} aria-invalid={!!errors.name} />
            {errors.name && <em className="err">{errors.name}</em>}
          </label>
          <label className="field">
            <span>Email address</span>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} aria-invalid={!!errors.email} />
            {errors.email && <em className="err">{errors.email}</em>}
          </label>
          <div className="modal-actions" style={{ justifyContent: "flex-start" }}>
            <button type="submit" className="btn primary">Save profile</button>
            {saved && <span className="save-confirm">Saved ✓</span>}
          </div>
        </form>
      </div>

      <div>
        <div className="card panel">
          <div className="panel-head"><h3>Preferences</h3></div>

          <label className="field" style={{ marginBottom: 16 }}>
            <span>Display currency</span>
            <div className="select-wrap">
              <select value={currency.code} onChange={(e) => setCurrency(e.target.value)}>
                {CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.label}</option>)}
              </select>
              <ChevronDown size={16} />
            </div>
          </label>

          <Switch checked={theme === "dark"} onChange={toggleTheme} label="Dark mode" description="Switch the interface to a dark palette" />
        </div>

        <div className="card panel">
          <div className="panel-head"><h3>Notifications</h3></div>
          <Switch checked={notifications.budgetAlerts} onChange={(v) => onToggleNotification("budgetAlerts", v)}
            label="Budget alerts" description="Notify when a category nears its limit" />
          <Switch checked={notifications.billReminders} onChange={(v) => onToggleNotification("billReminders", v)}
            label="Bill reminders" description="Notify a few days before bills are due" />
          <Switch checked={notifications.weeklySummary} onChange={(v) => onToggleNotification("weeklySummary", v)}
            label="Weekly summary email" description="A digest of income, spending and budgets" />
        </div>

        <div className="card panel danger-zone">
          <div className="panel-head"><h3>Danger zone</h3></div>
          <p className="confirm-text" style={{ marginBottom: 14 }}>
            Reset all transactions, budgets, bills, goals and accounts back to the sample data this dashboard shipped with.
          </p>
          <button className="btn danger" onClick={onResetData}><Trash2 size={15} /> Reset all data</button>
        </div>
      </div>
    </div>
  );
}
