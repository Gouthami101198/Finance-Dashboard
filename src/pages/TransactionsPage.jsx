import React from "react";
import FilterBar from "../components/transactions/FilterBar";
import TransactionRow from "../components/transactions/TransactionRow";
import Pagination from "../components/transactions/Pagination";
import TransactionsChart from "../components/transactions/TransactionsChart";

export default function TransactionsPage({
  search, setSearch, filterType, setFilterType, filterCategory, setFilterCategory,
  sortKey, setSortKey, filteredTransactions, pageItems, filteredCount, page, totalPages, pageSize,
  onPrevPage, onNextPage, onEdit, onDelete,
}) {
  return (
    <>
      <TransactionsChart transactions={filteredTransactions} />

      <div className="card panel" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <FilterBar
          search={search} setSearch={setSearch}
          filterType={filterType} setFilterType={setFilterType}
          filterCategory={filterCategory} setFilterCategory={setFilterCategory}
          sortKey={sortKey} setSortKey={setSortKey}
        />

        {filteredCount === 0 ? (
          <div className="empty-state">
            <h4>No transactions found</h4>
            <p>Try a different search term or clear your filters.</p>
          </div>
        ) : (
          <>
            <div className="t-head-row">
              <span>Description</span>
              <span>Date</span>
              <span>Category</span>
              <span>Amount</span>
              <span></span>
            </div>
            {pageItems.map((t) => (
              <TransactionRow key={t.id} t={t} onEdit={onEdit} onDelete={onDelete} />
            ))}
            <Pagination page={page} totalPages={totalPages} total={filteredCount} pageSize={pageSize} onPrev={onPrevPage} onNext={onNextPage} />
          </>
        )}
      </div>
    </>
  );
}
