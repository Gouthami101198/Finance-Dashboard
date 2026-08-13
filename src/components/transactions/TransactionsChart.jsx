import React, { useMemo } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";
import { useCurrency } from "../../context/CurrencyContext";
import { useTheme } from "../../context/ThemeContext";
import { CHART_COLORS } from "../../utils/chartColors";
import { CATEGORIES } from "../../data/categories";

export default function TransactionsChart({ transactions }) {
  const { formatAmount } = useCurrency();
  const { theme } = useTheme();
  const c = CHART_COLORS[theme];

  const data = useMemo(() => {
    return CATEGORIES.map((cat) => ({
      name: cat.name,
      color: cat.color,
      value: transactions.filter((t) => t.type === "expense" && t.category === cat.name).reduce((s, t) => s + t.amount, 0),
    }))
      .filter((d) => d.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  if (data.length === 0) return null;

  return (
    <div className="card panel" style={{ marginBottom: 18 }}>
      <div className="panel-head">
        <h3>Spending by category</h3>
        <span style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>
          {transactions.length} filtered transaction{transactions.length === 1 ? "" : "s"}
        </span>
      </div>
      <div style={{ height: Math.max(160, data.length * 36) }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24, top: 4, bottom: 4 }}>
            <CartesianGrid horizontal={false} stroke={c.grid} />
            <XAxis type="number" tick={{ fontSize: 11, fill: c.axis }} axisLine={false} tickLine={false} tickFormatter={(v) => formatAmount(v)} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: c.axis }} axisLine={false} tickLine={false} width={122} />
            <Tooltip
              formatter={(v) => formatAmount(v)}
              contentStyle={{ borderRadius: 10, border: `1px solid ${c.tooltipBorder}`, background: c.tooltipBg, color: c.tooltipText, fontSize: 12.5 }}
            />
            <Bar dataKey="value" radius={[0, 5, 5, 0]} barSize={18}>
              {data.map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
