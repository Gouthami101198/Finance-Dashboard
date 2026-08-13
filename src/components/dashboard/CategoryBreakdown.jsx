import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useCurrency } from "../../context/CurrencyContext";
import { useTheme } from "../../context/ThemeContext";
import { CHART_COLORS } from "../../utils/chartColors";

export default function CategoryBreakdown({ breakdown, monthLabelText }) {
  const { formatAmount } = useCurrency();
  const { theme } = useTheme();
  const c = CHART_COLORS[theme];
  const sorted = [...breakdown].sort((a, b) => b.value - a.value);

  return (
    <div className="card panel">
      <div className="panel-head">
        <h3>Category breakdown</h3>
      </div>
      {breakdown.length === 0 ? (
        <div className="empty-note">No expenses recorded for {monthLabelText}.</div>
      ) : (
        <>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={breakdown} dataKey="value" nameKey="name" innerRadius={54} outerRadius={82} paddingAngle={2}>
                  {breakdown.map((d, i) => (
                    <Cell key={i} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) => formatAmount(v)}
                  contentStyle={{ borderRadius: 10, border: `1px solid ${c.tooltipBorder}`, background: c.tooltipBg, color: c.tooltipText, fontSize: 12.5 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {sorted.map((d) => (
            <div className="legend-row" key={d.name}>
              <span className="dot" style={{ background: d.color }} /> {d.name}
              <span className="amt">{formatAmount(d.value)}</span>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
