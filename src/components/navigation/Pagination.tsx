import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  totalItems?: number;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  totalItems,
  className,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Show window of pages around current page
  const visiblePages = pages.filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1,
  );

  return (
    <div className={cn('flex flex-wrap items-center justify-between gap-4 text-xs', className)}>
      {totalItems !== undefined && (
        <span className="text-muted">
          Showing <span className="font-semibold text-foreground">{totalItems}</span> results
        </span>
      )}

      <div className="flex items-center gap-1.5">
        {/* First & Prev */}
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(1)}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface text-muted hover:bg-muted-surface hover:text-foreground disabled:opacity-40 disabled:pointer-events-none"
          aria-label="First page"
        >
          <ChevronsLeft className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface text-muted hover:bg-muted-surface hover:text-foreground disabled:opacity-40 disabled:pointer-events-none"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>

        {/* Page numbers */}
        {visiblePages.map((page, idx) => {
          const prev = visiblePages[idx - 1];
          const hasGap = prev && page - prev > 1;
          const isActive = page === currentPage;
          return (
            <div key={page} className="flex items-center gap-1">
              {hasGap && <span className="px-1 text-muted">…</span>}
              <button
                type="button"
                onClick={() => onPageChange(page)}
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-md border text-xs font-semibold transition-colors',
                  isActive
                    ? 'border-primary bg-primary text-primary-fg shadow-soft'
                    : 'border-border bg-surface text-foreground hover:bg-muted-surface',
                )}
              >
                {page}
              </button>
            </div>
          );
        })}

        {/* Next & Last */}
        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface text-muted hover:bg-muted-surface hover:text-foreground disabled:opacity-40 disabled:pointer-events-none"
          aria-label="Next page"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(totalPages)}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface text-muted hover:bg-muted-surface hover:text-foreground disabled:opacity-40 disabled:pointer-events-none"
          aria-label="Last page"
        >
          <ChevronsRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {pageSize && onPageSizeChange && (
        <div className="flex items-center gap-2">
          <span className="text-muted">Per page:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="h-8 rounded-md border border-border bg-surface px-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {pageSizeOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
