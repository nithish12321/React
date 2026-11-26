import { describe, expect, it } from 'vitest';
import {
  filterData,
  isFilterActive,
  matchDateRange,
  matchNumberRange,
  matchSelect,
  matchText,
} from '@/components/data-table/utils/filtering';
import type { ColumnConfig } from '@/components/data-table/types';

type Row = { id: string; name: string; role: string; age: number; joined: string };

const columns: ColumnConfig<Row>[] = [
  { id: 'name', header: 'Name', accessorKey: 'name', filterType: 'text' },
  {
    id: 'role',
    header: 'Role',
    accessorKey: 'role',
    filterType: 'select',
    filterOptions: [
      { label: 'Admin', value: 'admin' },
      { label: 'Staff', value: 'staff' },
    ],
  },
  { id: 'age', header: 'Age', accessorKey: 'age', filterType: 'number-range' },
  { id: 'joined', header: 'Joined', accessorKey: 'joined', filterType: 'date-range' },
];

const data: Row[] = [
  { id: '1', name: 'Alice', role: 'admin', age: 30, joined: '2024-01-10' },
  { id: '2', name: 'Bob', role: 'staff', age: 25, joined: '2024-06-01' },
  { id: '3', name: 'Charlie', role: 'staff', age: 40, joined: '2023-12-01' },
];

describe('matchText', () => {
  it('is case-insensitive substring', () => {
    expect(matchText('Alice', 'ali')).toBe(true);
    expect(matchText('Alice', 'ALI')).toBe(true);
    expect(matchText('Alice', 'bob')).toBe(false);
  });
  it('returns false for null/undefined', () => {
    expect(matchText(null, 'a')).toBe(false);
    expect(matchText(undefined, 'a')).toBe(false);
  });
  it('trims the query', () => {
    expect(matchText('Alice', '  ali  ')).toBe(true);
  });
});

describe('matchSelect', () => {
  it('matches scalars', () => {
    expect(matchSelect('admin', 'admin')).toBe(true);
    expect(matchSelect('admin', 'staff')).toBe(false);
  });
  it('matches arrays (OR)', () => {
    expect(matchSelect('staff', ['admin', 'staff'])).toBe(true);
    expect(matchSelect('guest', ['admin', 'staff'])).toBe(false);
  });
  it('empty target matches all', () => {
    expect(matchSelect('admin', '')).toBe(true);
    expect(matchSelect('anything', null)).toBe(true);
  });
});

describe('matchNumberRange', () => {
  it('inclusive bounds', () => {
    expect(matchNumberRange(25, { min: 20, max: 30 })).toBe(true);
    expect(matchNumberRange(20, { min: 20, max: 30 })).toBe(true);
    expect(matchNumberRange(30, { min: 20, max: 30 })).toBe(true);
    expect(matchNumberRange(19, { min: 20, max: 30 })).toBe(false);
    expect(matchNumberRange(31, { min: 20, max: 30 })).toBe(false);
  });
  it('open-ended ranges', () => {
    expect(matchNumberRange(100, { min: 10, max: null })).toBe(true);
    expect(matchNumberRange(5, { min: 10, max: null })).toBe(false);
    expect(matchNumberRange(5, { min: null, max: 30 })).toBe(true);
    expect(matchNumberRange(40, { min: null, max: 30 })).toBe(false);
  });
  it('no bounds matches all', () => {
    expect(matchNumberRange(10, { min: null, max: null })).toBe(true);
  });
  it('rejects non-numeric values', () => {
    expect(matchNumberRange('abc', { min: 1, max: 10 })).toBe(false);
    expect(matchNumberRange(null, { min: 1, max: 10 })).toBe(false);
  });
});

describe('matchDateRange', () => {
  it('includes the end date up to end of day', () => {
    expect(matchDateRange('2024-01-10', { from: '2024-01-01', to: '2024-01-10' })).toBe(true);
    expect(matchDateRange('2024-01-10T20:00:00', { from: '2024-01-01', to: '2024-01-10' })).toBe(
      true,
    );
  });
  it('rejects before the from date', () => {
    expect(matchDateRange('2023-12-01', { from: '2024-01-01' })).toBe(false);
  });
  it('rejects after the to date', () => {
    expect(matchDateRange('2024-07-01', { from: undefined, to: '2024-06-01' })).toBe(false);
  });
  it('no range matches all', () => {
    expect(matchDateRange('2024-01-01', {})).toBe(true);
  });
  it('rejects invalid dates', () => {
    expect(matchDateRange('not-a-date', { from: '2024-01-01' })).toBe(false);
  });
});

describe('isFilterActive', () => {
  it('ignores empty strings and nulls', () => {
    expect(isFilterActive('')).toBe(false);
    expect(isFilterActive(null)).toBe(false);
    expect(isFilterActive(undefined)).toBe(false);
  });
  it('ignores empty ranges', () => {
    expect(isFilterActive({ min: null, max: null })).toBe(false);
    expect(isFilterActive({ from: '', to: '' })).toBe(false);
    expect(isFilterActive({ from: undefined, to: undefined })).toBe(false);
  });
  it('detects partial ranges', () => {
    expect(isFilterActive({ min: 1, max: null })).toBe(true);
    expect(isFilterActive({ from: '2024-01-01', to: undefined })).toBe(true);
  });
  it('detects non-empty arrays', () => {
    expect(isFilterActive(['a'])).toBe(true);
    expect(isFilterActive([])).toBe(false);
  });
});

describe('filterData', () => {
  it('global search across filterable columns', () => {
    expect(filterData(data, 'ali', {}, columns).map((r) => r.id)).toEqual(['1']);
    expect(filterData(data, 'staff', {}, columns).map((r) => r.id)).toEqual(['2', '3']);
  });

  it('search is case-insensitive and trims', () => {
    expect(filterData(data, '  ALI  ', {}, columns).map((r) => r.id)).toEqual(['1']);
  });

  it('empty search returns all rows', () => {
    expect(filterData(data, '', {}, columns)).toHaveLength(3);
  });

  it('applies text + select + number-range together', () => {
    const result = filterData(
      data,
      '',
      { name: 'a', role: 'staff', age: { min: 30, max: 50 } },
      columns,
    );
    expect(result.map((r) => r.id)).toEqual(['3']);
  });

  it('date-range filter narrows rows', () => {
    const result = filterData(
      data,
      '',
      { joined: { from: '2024-01-01', to: '2024-12-31' } },
      columns,
    );
    expect(result.map((r) => r.id)).toEqual(['1', '2']);
  });

  it('combines search + column filters', () => {
    const result = filterData(data, 'charlie', { role: 'staff' }, columns);
    expect(result.map((r) => r.id)).toEqual(['3']);
  });

  it('inactive filters are ignored', () => {
    const result = filterData(
      data,
      '',
      { name: '', role: null, age: { min: null, max: null } },
      columns,
    );
    expect(result).toHaveLength(3);
  });
});
