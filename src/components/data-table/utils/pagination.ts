export interface PaginationResult<T> {
  rows: T[];
  page: number;
  pageSize: number;
  totalPages: number;
  total: number;
  startIndex: number;
  endIndex: number;
}

export function clampPage(page: number, totalPages: number): number {
  if (totalPages <= 0) return 1;
  if (page < 1) return 1;
  if (page > totalPages) return totalPages;
  return page;
}

export function paginateData<T>(data: T[], page: number, pageSize: number): PaginationResult<T> {
  const total = data.length;
  const safePageSize = Math.max(1, pageSize);
  const totalPages = Math.max(1, Math.ceil(total / safePageSize));
  const validPage = clampPage(page, totalPages);

  const startIndex = total === 0 ? 0 : (validPage - 1) * safePageSize + 1;
  const endIndex = Math.min(validPage * safePageSize, total);

  const startOffset = total === 0 ? 0 : (validPage - 1) * safePageSize;
  const rows = data.slice(startOffset, startOffset + safePageSize);

  return {
    rows,
    page: validPage,
    pageSize: safePageSize,
    totalPages,
    total,
    startIndex,
    endIndex,
  };
}
