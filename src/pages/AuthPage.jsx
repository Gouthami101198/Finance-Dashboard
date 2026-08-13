import React, { useState, useRef, useEffect } from "react";
import { Wallet, Eye, EyeOff, ArrowRight, TrendingUp, ShieldCheck, PiggyBank } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateLogin(f) {
  const e = {};
  if (!f.email || !EMAIL_RE.test(f.email)) e.email = "Enter a valid email address.";
  if (!f.password || f.password.length < 6) e.password = "Password must be at least 6 characters.";
  return e;
}

function validateSignup(f) {
  const e = {};
  if (!f.name || !f.name.trim()) e.name = "Enter your full name.";
  if (!f.email || !EMAIL_RE.test(f.email)) e.email = "Enter a valid email address.";
  if (!f.password || f.password.length < 6) e.password = "Password must be at least 6 characters.";
  if (f.confirm !== f.password) e.confirm = "Passwords don't match.";
  if (!f.terms) e.terms = "You must accept the terms to continue.";
  return e;
}

export default function AuthPage() {
  const { login, signup } = useAuth();
  const { theme } = useTheme();
  const [mode, setMode] = useState("login"); // 'login' | 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", remember: true, terms: false });
  const firstRef = useRef(null);

  useEffect(() => {
    firstRef.current && firstRef.current.focus();
    setErrors({});
  }, [mode]);

  function submit(e) {
    e.preventDefault();
    const eobj = mode === "login" ? validateLogin(form) : validateSignup(form);
    setErrors(eobj);
    if (Object.keys(eobj).length) return;

    setSubmitting(true);
    // Small delay purely for a bit of perceived-motion polish — no real network call.
    setTimeout(() => {
      if (mode === "login") login({ email: form.email });
      else signup({ name: form.name, email: form.email });
    }, 450);
  }

  function fillDemo() {
    setMode("login");
    setForm((f) => ({ ...f, email: "", password: "" }));
  }

  return (
    <div className={`fd-root ${theme === "dark" ? "dark" : ""}`}>
    <div className="auth-shell">
      <div className="auth-brand-panel">
        <div className="auth-brand-glow" />
        <div className="auth-brand-content">
          <div className="fd-brand" style={{ padding: 0 }}>
            <div className="mark"><Wallet size={18} color="#fff" /></div>
            <div>
              <h1 style={{ color: "#fff" }}>Finance</h1>
              <span>Finance Dashboard</span>
            </div>
          </div>

          <h2 className="auth-tagline">Every rupee, accounted for.</h2>
          <p className="auth-subtagline">
            Track spending, manage budgets, hit your savings goals.
          </p>

          <div className="auth-feature-list">
            <div className="auth-feature">
              <span className="auth-feature-icon"><TrendingUp size={16} /></span>
              <span>Real-time income & expense tracking</span>
            </div>
            <div className="auth-feature">
              <span className="auth-feature-icon"><PiggyBank size={16} /></span>
              <span>Budgets and goals that stay honest</span>
            </div>
          </div>
        </div>
        <div className="auth-punch" />
      </div>

      <div className="auth-form-panel">
        <div className="auth-form-wrap">
          <div className="auth-tabs">
            <button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")} type="button">Log in</button>
            <button className={mode === "signup" ? "active" : ""} onClick={() => setMode("signup")} type="button">Sign up</button>
          </div>

          <h3 className="auth-title">{mode === "login" ? "Welcome back" : "Create your account"}</h3>
          <p className="auth-desc">
            {mode === "login" ? "Log in to see your dashboard." : "It takes less than a minute."}{" "}
            <button type="button" className="auth-link" onClick={fillDemo}>Use demo credentials</button>
          </p>

          <form onSubmit={submit} className="modal-form" noValidate>
            {mode === "signup" && (
              <label className="field">
                <span>Full name</span>
                <input ref={firstRef} type="text" placeholder="Your name" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })} aria-invalid={!!errors.name} />
                {errors.name && <em className="err">{errors.name}</em>}
              </label>
            )}

            <label className="field">
              <span>Email address</span>
              <input
                ref={mode === "login" ? firstRef : undefined}
                type="email" placeholder="you@example.com" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} aria-invalid={!!errors.email}
              />
              {errors.email && <em className="err">{errors.email}</em>}
            </label>

            <label className="field">
              <span>Password</span>
              <div className="amount-input">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 6 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  aria-invalid={!!errors.password}
                  style={{ paddingLeft: 12 }}
                />
                <button type="button" className="pw-toggle" onClick={() => setShowPassword((s) => !s)} aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <em className="err">{errors.password}</em>}
            </label>

            {mode === "signup" && (
              <label className="field">
                <span>Confirm password</span>
                <input type={showPassword ? "text" : "password"} placeholder="Re-enter your password" value={form.confirm}
                  onChange={(e) => setForm({ ...form, confirm: e.target.value })} aria-invalid={!!errors.confirm} />
                {errors.confirm && <em className="err">{errors.confirm}</em>}
              </label>
            )}

            {mode === "login" ? (
              <div className="auth-row">
                <label className="checkbox-field">
                  <input type="checkbox" checked={form.remember} onChange={(e) => setForm({ ...form, remember: e.target.checked })} />
                  <span>Remember me</span>
                </label>
                <button type="button" className="auth-link">Forgot password?</button>
              </div>
            ) : (
              <label className="checkbox-field" style={{ alignItems: "flex-start" }}>
                <input type="checkbox" checked={form.terms} onChange={(e) => setForm({ ...form, terms: e.target.checked })} style={{ marginTop: 2 }} />
                <span>I agree to the Terms of Service and Privacy Policy.</span>
              </label>
            )}
            {errors.terms && <em className="err">{errors.terms}</em>}

            <button type="submit" className="btn primary auth-submit" disabled={submitting}>
              {submitting ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
              {!submitting && <ArrowRight size={16} />}
            </button>
          </form>

          <p className="auth-switch">
            {mode === "login" ? (
              <>Don't have an account? <button type="button" className="auth-link" onClick={() => setMode("signup")}>Sign up</button></>
            ) : (
              <>Already have an account? <button type="button" className="auth-link" onClick={() => setMode("login")}>Log in</button></>
            )}
          </p>
        </div>
      </div>
    </div>
    </div>
  );
}
