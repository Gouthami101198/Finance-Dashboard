import React from "react";
import StatCards from "../components/dashboard/StatCards";
import TrendChart from "../components/dashboard/TrendChart";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import CategoryBreakdown from "../components/dashboard/CategoryBreakdown";
import BudgetWatch from "../components/dashboard/BudgetWatch";

export default function Overview({
  income, expense, balance, savingsRate, monthLabelText,
  budgetRows, breakdown, thisMonthTx,
  monthlyTrend, weeklyTrend, chartPeriod, setChartPeriod,
  onViewAllTransactions, onManageBudgets,
}) {
  const overBudgetCount = budgetRows.filter((b) => b.tone === "over").length;

  return (
    <>
      <StatCards
        income={income}
        expense={expense}
        balance={balance}
        savingsRate={savingsRate}
        overBudgetCount={overBudgetCount}
        totalBudgetCount={budgetRows.length}
        monthLabelText={monthLabelText}
      />

      <div className="content-grid">
        <div>
          <TrendChart monthlyTrend={monthlyTrend} weeklyTrend={weeklyTrend} period={chartPeriod} setPeriod={setChartPeriod} />
          <RecentTransactions transactions={thisMonthTx} onViewAll={onViewAllTransactions} monthLabelText={monthLabelText} />
        </div>
        <div>
          <CategoryBreakdown breakdown={breakdown} monthLabelText={monthLabelText} />
          <BudgetWatch budgetRows={budgetRows} onManage={onManageBudgets} />
        </div>
      </div>
    </>
  );
}
