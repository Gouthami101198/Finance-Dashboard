import React, { useState, useMemo, useEffect } from "react";
import { PlusCircle, ChevronDown, ChevronUp } from "lucide-react";

import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";
import CurrencySelect from "./components/layout/CurrencySelect";
import ThemeToggle from "./components/layout/ThemeToggle";
import ExpenseModal from "./components/modals/ExpenseModal";
import AccountModal from "./components/modals/AccountModal";
import BillModal from "./components/modals/BillModal";
import GoalModal from "./components/modals/GoalModal";
import AddFundsModal from "./components/modals/AddFundsModal";
import ConfirmModal from "./components/modals/ConfirmModal";
import Toasts from "./components/common/Toasts";
import Overview from "./pages/Overview";
import TransactionsPage from "./pages/TransactionsPage";
import BudgetsPage from "./pages/BudgetsPage";
import BillsPage from "./pages/BillsPage";
import GoalsPage from "./pages/GoalsPage";
import AccountsPage from "./pages/AccountsPage";
import SettingsPage from "./pages/SettingsPage";

import { CATEGORIES, MONTHS, CURRENT_MONTH, DEFAULT_BUDGETS, monthLabel } from "./data/categories";
import { buildTransactions } from "./data/transactions";
import { DEFAULT_ACCOUNTS } from "./data/accounts";
import { DEFAULT_BILLS } from "./data/bills";
import { DEFAULT_GOALS } from "./data/goals";
import { DEFAULT_PROFILE, DEFAULT_NOTIFICATIONS } from "./data/profile";
import { useToasts } from "./hooks/useToasts";
import { useTheme } from "./context/ThemeContext";
import { useAuth } from "./context/AuthContext";

const PAGE_SIZE = 8;
let uid = 1000;
let billUid = 100;
let goalUid = 100;
let accountUid = 100;

const sumBy = (arr, type) => arr.filter((t) => t.type === type).reduce((s, t) => s + t.amount, 0);

export default function App() {
  const { theme } = useTheme();
  const { user, logout } = useAuth();

  /* ---- core data ---- */
  const [transactions, setTransactions] = useState(buildTransactions);
  const [budgets, setBudgets] = useState(DEFAULT_BUDGETS);
  const [accounts, setAccounts] = useState(DEFAULT_ACCOUNTS);
  const [bills, setBills] = useState(DEFAULT_BILLS);
  const [goals, setGoals] = useState(DEFAULT_GOALS);
  const [profile, setProfile] = useState(() =>
    user ? { ...DEFAULT_PROFILE, name: user.name, email: user.email } : DEFAULT_PROFILE
  );
  const [notifications, setNotifications] = useState(DEFAULT_NOTIFICATIONS);

  /* ---- navigation & UI ---- */
  const [view, setView] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(CURRENT_MONTH);
  const [chartPeriod, setChartPeriod] = useState("monthly");

  /* ---- modals ---- */
  const [modal, setModal] = useState(null);         // transaction: { mode, data }
  const [billModal, setBillModal] = useState(null);   // { mode, data }
  const [goalModal, setGoalModal] = useState(null);   // { mode, data }
  const [accountModal, setAccountModal] = useState(null); // { mode, data }
  const [fundsGoal, setFundsGoal] = useState(null);   // goal object
  const [confirmState, setConfirmState] = useState(null); // { title, text, confirmLabel, danger, onConfirm }

  /* ---- transactions table state ---- */
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortKey, setSortKey] = useState("date-desc");
  const [page, setPage] = useState(1);

  const { toasts, pushToast, dismissToast } = useToasts();

  /* ---- scroll effects ---- */
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      setScrolled(y > 8);
      setShowScrollTop(y > 480);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [view]);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ---- month-scoped figures ---- */
  const monthTx = (m) => transactions.filter((t) => t.date.startsWith(m));
  const thisMonthTx = useMemo(() => monthTx(selectedMonth), [transactions, selectedMonth]);
  const income = useMemo(() => sumBy(thisMonthTx, "income"), [thisMonthTx]);
  const expense = useMemo(() => sumBy(thisMonthTx, "expense"), [thisMonthTx]);
  const balance = income - expense;
  const savingsRate = income > 0 ? Math.round((balance / income) * 100) : 0;

  const breakdown = useMemo(() => {
    return CATEGORIES.map((c) => ({
      name: c.name,
      color: c.color,
      value: thisMonthTx.filter((t) => t.type === "expense" && t.category === c.name).reduce((s, t) => s + t.amount, 0),
    })).filter((d) => d.value > 0);
  }, [thisMonthTx]);

  const monthlyTrend = useMemo(
    () =>
      MONTHS.map((m) => {
        const mt = monthTx(m);
        return { label: monthLabel(m), income: sumBy(mt, "income"), expense: sumBy(mt, "expense") };
      }),
    [transactions]
  );

  const weeklyTrend = useMemo(() => {
    const end = new Date(CURRENT_MONTH + "-09T00:00:00");
    const weeks = [];
    for (let w = 7; w >= 0; w--) {
      const weekEnd = new Date(end);
      weekEnd.setDate(end.getDate() - w * 7);
      const weekStart = new Date(weekEnd);
      weekStart.setDate(weekEnd.getDate() - 6);
      const total = transactions
        .filter((t) => {
          const d = new Date(t.date + "T00:00:00");
          return t.type === "expense" && d >= weekStart && d <= weekEnd;
        })
        .reduce((s, t) => s + t.amount, 0);
      weeks.push({ label: `${weekStart.getDate()}/${weekStart.getMonth() + 1}`, expense: total });
    }
    return weeks;
  }, [transactions]);

  const budgetRows = useMemo(
    () =>
      CATEGORIES.map((c) => {
        const spent = thisMonthTx.filter((t) => t.type === "expense" && t.category === c.name).reduce((s, t) => s + t.amount, 0);
        const limit = budgets[c.name] || 0;
        const pct = limit > 0 ? (spent / limit) * 100 : 0;
        const tone = pct >= 100 ? "over" : pct >= 80 ? "warn" : "ok";
        return { ...c, spent, limit, pct, tone };
      }),
    [thisMonthTx, budgets]
  );

  /* ---- transactions table derived ---- */
  const filtered = useMemo(() => {
    let list = transactions.filter((t) => {
      const q = search.trim().toLowerCase();
      const matchesQ = !q || t.note.toLowerCase().includes(q) || t.category.toLowerCase().includes(q);
      const matchesType = filterType === "all" || t.type === filterType;
      const matchesCat = filterCategory === "all" || t.category === filterCategory;
      return matchesQ && matchesType && matchesCat;
    });
    const [key, dir] = sortKey.split("-");
    list = [...list].sort((a, b) => {
      let v = key === "date" ? (a.date < b.date ? -1 : a.date > b.date ? 1 : 0) : a.amount - b.amount;
      return dir === "asc" ? v : -v;
    });
    return list;
  }, [transactions, search, filterType, filterCategory, sortKey]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageSafe = Math.min(page, totalPages);
  const pageItems = filtered.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE);

  useEffect(() => setPage(1), [search, filterType, filterCategory, sortKey]);

  /* ---- transaction actions ---- */
  function saveTransaction(data) {
    if (modal.mode === "edit") {
      setTransactions((ts) => ts.map((t) => (t.id === modal.data.id ? { ...t, ...data } : t)));
      pushToast("Transaction updated.");
    } else {
      setTransactions((ts) => [{ id: uid++, ...data }, ...ts]);
      pushToast("Transaction added.");
    }
    setModal(null);
  }

  function requestDeleteTransaction(id) {
    const t = transactions.find((x) => x.id === id);
    setConfirmState({
      title: "Delete transaction?",
      text: t ? `This will permanently remove "${t.note}" from your records.` : "",
      confirmLabel: "Delete",
      danger: true,
      onConfirm: () => {
        setTransactions((ts) => ts.filter((x) => x.id !== id));
        pushToast("Transaction deleted.", "info");
        setConfirmState(null);
      },
    });
  }

  function updateBudget(name, baseAmount) {
    if (!baseAmount || isNaN(baseAmount) || baseAmount <= 0) {
      pushToast("Budget must be a number greater than 0.", "error");
      return;
    }
    setBudgets((b) => ({ ...b, [name]: baseAmount }));
    pushToast(`Budget for ${name} updated.`);
  }

  /* ---- bill actions ---- */
  function saveBill(data) {
    if (billModal.mode === "edit") {
      setBills((bs) => bs.map((b) => (b.id === billModal.data.id ? { ...b, ...data } : b)));
      pushToast("Bill updated.");
    } else {
      setBills((bs) => [{ id: billUid++, ...data }, ...bs]);
      pushToast("Bill added.");
    }
    setBillModal(null);
  }

  function requestDeleteBill(bill) {
    setConfirmState({
      title: "Delete bill?",
      text: `This will remove "${bill.name}" from your recurring bills.`,
      confirmLabel: "Delete",
      danger: true,
      onConfirm: () => {
        setBills((bs) => bs.filter((b) => b.id !== bill.id));
        pushToast("Bill deleted.", "info");
        setConfirmState(null);
      },
    });
  }

  /* ---- goal actions ---- */
  function saveGoal(data) {
    if (goalModal.mode === "edit") {
      setGoals((gs) => gs.map((g) => (g.id === goalModal.data.id ? { ...g, ...data } : g)));
      pushToast("Goal updated.");
    } else {
      setGoals((gs) => [{ id: goalUid++, ...data }, ...gs]);
      pushToast("Goal added.");
    }
    setGoalModal(null);
  }

  function requestDeleteGoal(goal) {
    setConfirmState({
      title: "Delete goal?",
      text: `This will remove "${goal.name}" and its saved progress.`,
      confirmLabel: "Delete",
      danger: true,
      onConfirm: () => {
        setGoals((gs) => gs.filter((g) => g.id !== goal.id));
        pushToast("Goal deleted.", "info");
        setConfirmState(null);
      },
    });
  }

  function addFundsToGoal(baseAmount) {
    setGoals((gs) =>
      gs.map((g) => {
        if (g.id !== fundsGoal.id) return g;
        const nextSaved = g.saved + baseAmount;
        return { ...g, saved: nextSaved };
      })
    );
    const target = fundsGoal.target;
    const nextSaved = fundsGoal.saved + baseAmount;
    pushToast(nextSaved >= target ? `${fundsGoal.name} goal reached! 🎉` : "Funds added to goal.");
    setFundsGoal(null);
  }

  /* ---- account actions ---- */
  function saveAccount(data) {
    if (accountModal.mode === "edit") {
      setAccounts((as_) => as_.map((a) => (a.id === accountModal.data.id ? { ...a, ...data } : a)));
      pushToast("Account updated.");
    } else {
      setAccounts((as_) => [{ id: accountUid++, ...data }, ...as_]);
      pushToast("Account added.");
    }
    setAccountModal(null);
  }

  function requestDeleteAccount(account) {
    setConfirmState({
      title: "Delete account?",
      text: `This will remove "${account.name}" from your accounts.`,
      confirmLabel: "Delete",
      danger: true,
      onConfirm: () => {
        setAccounts((as_) => as_.filter((a) => a.id !== account.id));
        pushToast("Account deleted.", "info");
        setConfirmState(null);
      },
    });
  }

  /* ---- settings actions ---- */
  function saveProfile(data) {
    setProfile((p) => ({ ...p, ...data }));
    pushToast("Profile updated.");
  }

  function toggleNotification(key, value) {
    setNotifications((n) => ({ ...n, [key]: value }));
  }

  function requestResetData() {
    setConfirmState({
      title: "Reset all data?",
      text: "This restores transactions, budgets, bills, goals and accounts to the original sample data. This cannot be undone.",
      confirmLabel: "Reset data",
      danger: true,
      onConfirm: () => {
        setTransactions(buildTransactions());
        setBudgets(DEFAULT_BUDGETS);
        setAccounts(DEFAULT_ACCOUNTS);
        setBills(DEFAULT_BILLS);
        setGoals(DEFAULT_GOALS);
        pushToast("All data has been reset.", "info");
        setConfirmState(null);
      },
    });
  }

  const monthLabelText = monthLabel(selectedMonth);

  const pageTitles = {
    overview: { title: "Overview", subtitle: "Your income, spending and savings at a glance." },
    transactions: { title: "Transactions", subtitle: "Search, filter and manage every transaction." },
    budgets: { title: "Budgets", subtitle: "Track monthly spending limits by category." },
    bills: { title: "Bills", subtitle: "Keep tabs on recurring payments and autopay." },
    goals: { title: "Goals", subtitle: "Track progress toward your savings targets." },
    accounts: { title: "Accounts", subtitle: "Your bank accounts, cash and cards in one place." },
    settings: { title: "Settings", subtitle: "Manage your profile and app preferences." },
  };

  return (
    <div className={`fd-root ${theme === "dark" ? "dark" : ""}`}>
      <div className="fd-shell">
        <Sidebar view={view} setView={setView} open={sidebarOpen} onClose={() => setSidebarOpen(false)} onLogout={logout} userName={user?.name} />

        <main className="fd-main">
          <div className={`fd-topbar-wrap ${scrolled ? "scrolled" : ""}`}>
          <Topbar title={pageTitles[view].title} subtitle={pageTitles[view].subtitle} onMenuClick={() => setSidebarOpen(true)}>
            <CurrencySelect />

            {(view === "overview" || view === "budgets") && (
              <div className="month-select">
                <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} aria-label="Select month">
                  {MONTHS.map((m) => (
                    <option key={m} value={m}>{monthLabel(m)}</option>
                  ))}
                </select>
                <ChevronDown size={15} />
              </div>
            )}

            <ThemeToggle />

            {(view === "overview" || view === "transactions") && (
              <button className="btn primary" onClick={() => setModal({ mode: "add" })}>
                <PlusCircle size={16} /> Add transaction
              </button>
            )}
            {view === "bills" && (
              <button className="btn primary" onClick={() => setBillModal({ mode: "add" })}>
                <PlusCircle size={16} /> Add bill
              </button>
            )}
            {view === "goals" && (
              <button className="btn primary" onClick={() => setGoalModal({ mode: "add" })}>
                <PlusCircle size={16} /> Add goal
              </button>
            )}
            {view === "accounts" && (
              <button className="btn primary" onClick={() => setAccountModal({ mode: "add" })}>
                <PlusCircle size={16} /> Add account
              </button>
            )}
          </Topbar>
          </div>

          <div key={view} className="page-transition">
          {view === "overview" && (
            <Overview
              income={income} expense={expense} balance={balance} savingsRate={savingsRate}
              monthLabelText={monthLabelText} budgetRows={budgetRows} breakdown={breakdown} thisMonthTx={thisMonthTx}
              monthlyTrend={monthlyTrend} weeklyTrend={weeklyTrend} chartPeriod={chartPeriod} setChartPeriod={setChartPeriod}
              onViewAllTransactions={() => setView("transactions")}
              onManageBudgets={() => setView("budgets")}
            />
          )}

          {view === "transactions" && (
            <TransactionsPage
              search={search} setSearch={setSearch}
              filterType={filterType} setFilterType={setFilterType}
              filterCategory={filterCategory} setFilterCategory={setFilterCategory}
              sortKey={sortKey} setSortKey={setSortKey}
              filteredTransactions={filtered}
              pageItems={pageItems}
              filteredCount={filtered.length}
              page={pageSafe} totalPages={totalPages} pageSize={PAGE_SIZE}
              onPrevPage={() => setPage((p) => p - 1)}
              onNextPage={() => setPage((p) => p + 1)}
              onEdit={(t) => setModal({ mode: "edit", data: t })}
              onDelete={requestDeleteTransaction}
            />
          )}

          {view === "budgets" && <BudgetsPage budgetRows={budgetRows} monthLabelText={monthLabelText} onSaveLimit={updateBudget} />}

          {view === "bills" && (
            <BillsPage
              bills={bills}
              onEdit={(b) => setBillModal({ mode: "edit", data: b })}
              onDelete={requestDeleteBill}
            />
          )}

          {view === "goals" && (
            <GoalsPage
              goals={goals}
              onEdit={(g) => setGoalModal({ mode: "edit", data: g })}
              onDelete={requestDeleteGoal}
              onAddFunds={(g) => setFundsGoal(g)}
            />
          )}

          {view === "accounts" && (
            <AccountsPage
              accounts={accounts}
              onEdit={(a) => setAccountModal({ mode: "edit", data: a })}
              onDelete={requestDeleteAccount}
            />
          )}

          {view === "settings" && (
            <SettingsPage
              profile={profile}
              onSaveProfile={saveProfile}
              notifications={notifications}
              onToggleNotification={toggleNotification}
              onResetData={requestResetData}
            />
          )}
          </div>
        </main>
      </div>

      {showScrollTop && (
        <button className="scroll-top-btn" onClick={scrollToTop} aria-label="Scroll to top">
          <ChevronUp size={18} />
        </button>
      )}

      {modal && <ExpenseModal mode={modal.mode} initial={modal.data || null} onClose={() => setModal(null)} onSave={saveTransaction} />}
      {billModal && <BillModal mode={billModal.mode} initial={billModal.data || null} onClose={() => setBillModal(null)} onSave={saveBill} />}
      {goalModal && <GoalModal mode={goalModal.mode} initial={goalModal.data || null} onClose={() => setGoalModal(null)} onSave={saveGoal} />}
      {accountModal && <AccountModal mode={accountModal.mode} initial={accountModal.data || null} onClose={() => setAccountModal(null)} onSave={saveAccount} />}
      {fundsGoal && <AddFundsModal goal={fundsGoal} onClose={() => setFundsGoal(null)} onAdd={addFundsToGoal} />}

      {confirmState && (
        <ConfirmModal
          title={confirmState.title}
          text={confirmState.text}
          confirmLabel={confirmState.confirmLabel}
          danger={confirmState.danger}
          onCancel={() => setConfirmState(null)}
          onConfirm={confirmState.onConfirm}
        />
      )}

      <Toasts toasts={toasts} dismiss={dismissToast} />
    </div>
  );
}
