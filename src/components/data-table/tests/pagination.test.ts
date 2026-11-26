import { describe, expect, it } from 'vitest';
import { clampPage, paginateData } from '@/components/data-table/utils/pagination';

const ids = Array.from({ length: 23 }, (_, i) => ({ id: String(i + 1) }));

describe('pagination utils', () => {
  it('clampPage stays within 1..totalPages', () => {
    expect(clampPage(0, 5)).toBe(1);
    expect(clampPage(9, 5)).toBe(5);
    expect(clampPage(3, 5)).toBe(3);
    expect(clampPage(1, 0)).toBe(1);
  });

  it('paginates a full page', () => {
    const result = paginateData(ids, 2, 10);
    expect(result.rows.map((r) => r.id)).toEqual(
      Array.from({ length: 10 }, (_, i) => String(i + 11)),
    );
    expect(result.total).toBe(23);
    expect(result.totalPages).toBe(3);
    expect(result.startIndex).toBe(11);
    expect(result.endIndex).toBe(20);
    expect(result.page).toBe(2);
  });

  it('returns the remainder on the last page', () => {
    const result = paginateData(ids, 3, 10);
    expect(result.rows).toHaveLength(3);
    expect(result.startIndex).toBe(21);
    expect(result.endIndex).toBe(23);
  });

  it('clamps an out-of-range page', () => {
    const result = paginateData(ids, 99, 10);
    expect(result.page).toBe(3);
    expect(result.rows).toHaveLength(3);
  });

  it('handles empty data', () => {
    const result = paginateData([], 1, 10);
    expect(result.rows).toEqual([]);
    expect(result.total).toBe(0);
    expect(result.startIndex).toBe(0);
    expect(result.endIndex).toBe(0);
    expect(result.totalPages).toBe(1);
  });
});
