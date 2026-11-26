import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface TablePaginationProps {
  page: number;
  pageSize: number;
  totalPages: number;
  total: number;
  startIndex: number;
  endIndex: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newSize: number) => void;
  pageSizeOptions?: number[];
}

export function TablePagination({
  page,
  pageSize,
  totalPages,
  total,
  startIndex,
  endIndex,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
}: TablePaginationProps) {
  const [jumpInput, setJumpInput] = useState(String(page));

  useEffect(() => {
    setJumpInput(String(page));
  }, [page]);

  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseInt(jumpInput, 10);
    if (!isNaN(target)) {
      const clamped = Math.max(1, Math.min(target, totalPages));
      onPageChange(clamped);
      setJumpInput(String(clamped));
    } else {
      setJumpInput(String(page));
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border px-4 py-3 bg-surface/50">
      <div className="flex items-center gap-3 text-xs text-muted">
        <span>
          Showing <span className="font-semibold text-foreground">{startIndex}</span> to{' '}
          <span className="font-semibold text-foreground">{endIndex}</span> of{' '}
          <span className="font-semibold text-foreground">{total}</span> results
        </span>

        <div className="flex items-center gap-1.5 ml-2">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="h-7 rounded-md border border-border bg-surface px-2 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <form onSubmit={handleJumpSubmit} className="flex items-center gap-1.5 text-xs text-muted">
          <span>Go to:</span>
          <input
            type="number"
            min={1}
            max={totalPages}
            value={jumpInput}
            onChange={(e) => setJumpInput(e.target.value)}
            onBlur={handleJumpSubmit}
            className="h-7 w-12 rounded-md border border-border bg-surface px-1.5 text-center text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <span>/ {totalPages}</span>
        </form>

        <div className="flex items-center gap-1 ml-2">
          <button
            type="button"
            onClick={() => onPageChange(1)}
            disabled={page <= 1}
            className="rounded-lg p-1.5 text-muted hover:text-foreground hover:bg-surface-hover disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="First page"
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="rounded-lg p-1.5 text-muted hover:text-foreground hover:bg-surface-hover disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="px-2 text-xs font-semibold text-foreground">
            {page} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="rounded-lg p-1.5 text-muted hover:text-foreground hover:bg-surface-hover disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onPageChange(totalPages)}
            disabled={page >= totalPages}
            className="rounded-lg p-1.5 text-muted hover:text-foreground hover:bg-surface-hover disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Last page"
          >
            <ChevronsRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
