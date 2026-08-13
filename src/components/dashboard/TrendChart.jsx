import React from "react";
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis,
  Tooltip, CartesianGrid, Legend,
} from "recharts";
import { useCurrency } from "../../context/CurrencyContext";
import { useTheme } from "../../context/ThemeContext";
import { CHART_COLORS } from "../../utils/chartColors";

export default function TrendChart({ monthlyTrend, weeklyTrend, period, setPeriod }) {
  const { currency, formatAmount } = useCurrency();
  const { theme } = useTheme();
  const c = CHART_COLORS[theme];
  const shortTick = (v) => `${currency.symbol}${Math.round((v * currency.rate) / 1000)}k`;

  return (
    <div className="card panel">
      <div className="panel-head">
        <h3>Income vs. expenses</h3>
        <div className="seg">
          <button className={period === "monthly" ? "active" : ""} onClick={() => setPeriod("monthly")}>
            Monthly
          </button>
          <button className={period === "weekly" ? "active" : ""} onClick={() => setPeriod("weekly")}>
            Weekly
          </button>
        </div>
      </div>
      <div style={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          {period === "monthly" ? (
            <BarChart data={monthlyTrend} barGap={4}>
              <CartesianGrid vertical={false} stroke={c.grid} />
              <XAxis dataKey="label" tick={{ fontSize: 11.5, fill: c.axis }} axisLine={{ stroke: c.grid }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: c.axis }} axisLine={false} tickLine={false} tickFormatter={shortTick} />
              <Tooltip
                formatter={(v) => formatAmount(v)}
                contentStyle={{ borderRadius: 10, border: `1px solid ${c.tooltipBorder}`, background: c.tooltipBg, color: c.tooltipText, fontSize: 12.5 }}
              />
              <Legend wrapperStyle={{ fontSize: 12.5, color: c.axis }} />
              <Bar dataKey="income" name="Income" fill={c.income} radius={[5, 5, 0, 0]} />
              <Bar dataKey="expense" name="Expense" fill={c.expense} radius={[5, 5, 0, 0]} />
            </BarChart>
          ) : (
            <LineChart data={weeklyTrend}>
              <CartesianGrid vertical={false} stroke={c.grid} />
              <XAxis dataKey="label" tick={{ fontSize: 11.5, fill: c.axis }} axisLine={{ stroke: c.grid }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: c.axis }} axisLine={false} tickLine={false} tickFormatter={shortTick} />
              <Tooltip
                formatter={(v) => formatAmount(v)}
                contentStyle={{ borderRadius: 10, border: `1px solid ${c.tooltipBorder}`, background: c.tooltipBg, color: c.tooltipText, fontSize: 12.5 }}
              />
              <Line type="monotone" dataKey="expense" name="Weekly expense" stroke={c.expense} strokeWidth={2.5} dot={{ r: 3.5 }} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
