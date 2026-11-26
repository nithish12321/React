import { describe, expect, it } from 'vitest';
import { clampPage, paginateData } from '@/components/data-table/utils/pagination';

const ids = Array.from({ length: 23 }, (_, i) => ({ id: String(i + 1) }));

describe('clampPage', () => {
  it('stays within 1..totalPages', () => {
    expect(clampPage(0, 5)).toBe(1);
    expect(clampPage(9, 5)).toBe(5);
    expect(clampPage(3, 5)).toBe(3);
  });
  it('defaults to 1 when no pages', () => {
    expect(clampPage(1, 0)).toBe(1);
    expect(clampPage(99, 0)).toBe(1);
  });
});

describe('paginateData', () => {
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

  it('first page of first 10', () => {
    const result = paginateData(ids, 1, 10);
    expect(result.rows.map((r) => r.id)).toEqual(
      Array.from({ length: 10 }, (_, i) => String(i + 1)),
    );
    expect(result.startIndex).toBe(1);
    expect(result.endIndex).toBe(10);
  });

  it('clamps an out-of-range page to the last page', () => {
    const result = paginateData(ids, 99, 10);
    expect(result.page).toBe(3);
    expect(result.rows).toHaveLength(3);
  });

  it('clamps a zero/negative page to page 1', () => {
    const result = paginateData(ids, 0, 10);
    expect(result.page).toBe(1);
    expect(result.rows).toHaveLength(10);
  });

  it('handles empty data', () => {
    const result = paginateData([], 1, 10);
    expect(result.rows).toEqual([]);
    expect(result.total).toBe(0);
    expect(result.startIndex).toBe(0);
    expect(result.endIndex).toBe(0);
    expect(result.totalPages).toBe(1);
  });

  it('handles a single page (fewer rows than page size)', () => {
    const small = ids.slice(0, 5);
    const result = paginateData(small, 1, 10);
    expect(result.rows).toHaveLength(5);
    expect(result.totalPages).toBe(1);
    expect(result.startIndex).toBe(1);
    expect(result.endIndex).toBe(5);
  });

  it('page size larger than total returns all rows', () => {
    const result = paginateData(ids, 1, 100);
    expect(result.rows).toHaveLength(23);
    expect(result.totalPages).toBe(1);
  });

  it('does not mutate the input array', () => {
    const copy = [...ids];
    paginateData(ids, 2, 10);
    expect(ids.map((r) => r.id)).toEqual(copy.map((r) => r.id));
  });
});
