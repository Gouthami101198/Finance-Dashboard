export const FREQUENCIES = ["Monthly", "Quarterly", "Yearly"];

export const DEFAULT_BILLS = [
  { id: 1, name: "House Rent", category: "Bills & Utilities", amount: 18000, dueDay: 3, frequency: "Monthly", autopay: true },
  { id: 2, name: "Electricity", category: "Bills & Utilities", amount: 2100, dueDay: 7, frequency: "Monthly", autopay: false },
  { id: 3, name: "Internet & Mobile", category: "Bills & Utilities", amount: 999, dueDay: 8, frequency: "Monthly", autopay: true },
  { id: 4, name: "Streaming Subscriptions", category: "Entertainment", amount: 649, dueDay: 6, frequency: "Monthly", autopay: true },
  { id: 5, name: "Gym Membership", category: "Health", amount: 1500, dueDay: 12, frequency: "Monthly", autopay: false },
  { id: 6, name: "Car Insurance", category: "Transportation", amount: 8200, dueDay: 18, frequency: "Yearly", autopay: false },
  { id: 7, name: "Health Insurance", category: "Health", amount: 14500, dueDay: 25, frequency: "Yearly", autopay: true },
];

// "Today" in this dummy dataset is treated as the 9th, matching the app's CURRENT_MONTH.
const TODAY_DAY_OF_MONTH = 9;

export function billStatus(dueDay) {
  if (dueDay < TODAY_DAY_OF_MONTH) return "paid";
  if (dueDay - TODAY_DAY_OF_MONTH <= 5) return "due-soon";
  return "upcoming";
}
