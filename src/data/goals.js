import { PiggyBank, Plane, Laptop, Heart, Home, GraduationCap, Car, Gift } from "lucide-react";

export const GOAL_ICONS = [
  { key: "piggy", icon: PiggyBank, color: "#2F6F4E" },
  { key: "plane", icon: Plane, color: "#4A6FA5" },
  { key: "laptop", icon: Laptop, color: "#7A5C8E" },
  { key: "heart", icon: Heart, color: "#B5473A" },
  { key: "home", icon: Home, color: "#B8862E" },
  { key: "grad", icon: GraduationCap, color: "#2E8B8B" },
  { key: "car", icon: Car, color: "#A0623D" },
  { key: "gift", icon: Gift, color: "#8A8F86" },
];

export const goalIconMeta = (key) => GOAL_ICONS.find((g) => g.key === key) || GOAL_ICONS[0];

export const DEFAULT_GOALS = [
  { id: 1, name: "Emergency Fund", iconKey: "piggy", target: 300000, saved: 184000, targetDate: "2026-12-31" },
  { id: 2, name: "Goa Vacation", iconKey: "plane", target: 60000, saved: 37500, targetDate: "2026-11-01" },
  { id: 3, name: "New Laptop", iconKey: "laptop", target: 120000, saved: 45000, targetDate: "2027-02-01" },
  { id: 4, name: "Wedding Fund", iconKey: "heart", target: 800000, saved: 210000, targetDate: "2027-06-15" },
];
