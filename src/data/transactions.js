import { MONTHS } from "./categories";

/**
 * Builds a deterministic set of sample transactions across MONTHS.
 * Recurring items (salary, rent, bills) repeat each month with small
 * variation; a few categories only appear on some months for realism.
 */
export function buildTransactions() {
  let id = 1;
  const tx = [];

  MONTHS.forEach((m, i) => {
    tx.push({ id: id++, type: "income", category: "Income", amount: 85000 + i * 1500, date: `${m}-01`, note: "Monthly Salary" });
    if (i % 2 === 0) tx.push({ id: id++, type: "income", category: "Income", amount: 12000 + i * 800, date: `${m}-15`, note: "Freelance Project Payment" });

    tx.push({ id: id++, type: "expense", category: "Bills & Utilities", amount: 18000, date: `${m}-03`, note: "House Rent" });
    tx.push({ id: id++, type: "expense", category: "Bills & Utilities", amount: 1800 + i * 50, date: `${m}-07`, note: "Electricity Bill" });
    tx.push({ id: id++, type: "expense", category: "Bills & Utilities", amount: 999, date: `${m}-08`, note: "Internet & Mobile Recharge" });

    tx.push({ id: id++, type: "expense", category: "Groceries", amount: 3200 + (i % 3) * 400, date: `${m}-05`, note: "Weekly Groceries" });
    tx.push({ id: id++, type: "expense", category: "Groceries", amount: 2800 + (i % 2) * 300, date: `${m}-19`, note: "Weekly Groceries" });

    tx.push({ id: id++, type: "expense", category: "Food & Dining", amount: 850, date: `${m}-10`, note: "Dinner with Friends" });
    tx.push({ id: id++, type: "expense", category: "Food & Dining", amount: 420, date: `${m}-16`, note: "Coffee & Snacks" });
    tx.push({ id: id++, type: "expense", category: "Food & Dining", amount: 1200, date: `${m}-24`, note: "Weekend Brunch" });

    tx.push({ id: id++, type: "expense", category: "Transportation", amount: 2500, date: `${m}-04`, note: "Fuel" });
    tx.push({ id: id++, type: "expense", category: "Transportation", amount: 600 + (i % 4) * 100, date: `${m}-14`, note: "Cab Rides" });

    if (i % 2 === 1) tx.push({ id: id++, type: "expense", category: "Shopping", amount: 3400 + i * 200, date: `${m}-20`, note: "Clothing & Accessories" });

    tx.push({ id: id++, type: "expense", category: "Entertainment", amount: 649, date: `${m}-06`, note: "Streaming Subscriptions" });
    if (i % 3 === 0) tx.push({ id: id++, type: "expense", category: "Entertainment", amount: 900, date: `${m}-22`, note: "Movie Night" });

    if (i % 2 === 0) tx.push({ id: id++, type: "expense", category: "Health", amount: 1500 + i * 100, date: `${m}-12`, note: "Pharmacy & Checkup" });

    if (i === 4) tx.push({ id: id++, type: "expense", category: "Other", amount: 2200, date: `${m}-27`, note: "Gift for a Friend" });
  });

  return tx.sort((a, b) => (a.date < b.date ? 1 : -1));
}
