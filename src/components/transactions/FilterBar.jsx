import React from "react";
import { Search } from "lucide-react";
import { ALL_CATEGORIES } from "../../data/categories";

export default function FilterBar({ search, setSearch, filterType, setFilterType, filterCategory, setFilterCategory, sortKey, setSortKey }) {
  return (
    <div className="filter-bar" style={{ padding: "0 22px" }}>
      <div className="search-box">
        <Search size={15} />
        <input placeholder="Search by note or category…" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search transactions" />
      </div>
      <select value={filterType} onChange={(e) => setFilterType(e.target.value)} aria-label="Filter by type">
        <option value="all">All types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
      <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} aria-label="Filter by category">
        <option value="all">All categories</option>
        {ALL_CATEGORIES.map((c) => (
          <option key={c.name} value={c.name}>
            {c.name}
          </option>
        ))}
      </select>
      <select value={sortKey} onChange={(e) => setSortKey(e.target.value)} aria-label="Sort transactions" className="sort-btn">
        <option value="date-desc">Newest first</option>
        <option value="date-asc">Oldest first</option>
        <option value="amount-desc">Amount: high to low</option>
        <option value="amount-asc">Amount: low to high</option>
      </select>
    </div>
  );
}
