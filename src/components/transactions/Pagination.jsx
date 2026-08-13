import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPages, total, pageSize, onPrev, onNext }) {
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className="pagination">
      <span>
        Showing {start}–{end} of {total}
      </span>
      <div className="pg-btns">
        <button
          className="icon-btn"
          disabled={page <= 1}
          style={page <= 1 ? { opacity: 0.4, cursor: "default" } : {}}
          onClick={onPrev}
          aria-label="Previous page"
        >
          <ChevronLeft size={15} />
        </button>
        <button
          className="icon-btn"
          disabled={page >= totalPages}
          style={page >= totalPages ? { opacity: 0.4, cursor: "default" } : {}}
          onClick={onNext}
          aria-label="Next page"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
