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

describe('filtering utils', () => {
  it('matchText is case-insensitive substring', () => {
    expect(matchText('Alice', 'ali')).toBe(true);
    expect(matchText('Alice', 'bob')).toBe(false);
    expect(matchText(null, 'a')).toBe(false);
  });

  it('matchSelect supports scalar and arrays', () => {
    expect(matchSelect('admin', 'admin')).toBe(true);
    expect(matchSelect('admin', 'staff')).toBe(false);
    expect(matchSelect('staff', ['admin', 'staff'])).toBe(true);
    expect(matchSelect('guest', '')).toBe(true);
  });

  it('matchNumberRange inclusive bounds', () => {
    expect(matchNumberRange(25, { min: 20, max: 30 })).toBe(true);
    expect(matchNumberRange(19, { min: 20, max: 30 })).toBe(false);
    expect(matchNumberRange(30, { min: null, max: 30 })).toBe(true);
    expect(matchNumberRange(10, { min: null, max: null })).toBe(true);
  });

  it('matchDateRange includes the end date', () => {
    expect(matchDateRange('2024-01-10', { from: '2024-01-01', to: '2024-01-10' })).toBe(true);
    expect(matchDateRange('2023-12-01', { from: '2024-01-01' })).toBe(false);
  });

  it('isFilterActive ignores empty ranges', () => {
    expect(isFilterActive('')).toBe(false);
    expect(isFilterActive({ min: null, max: null })).toBe(false);
    expect(isFilterActive({ from: '', to: '' })).toBe(false);
    expect(isFilterActive({ min: 1, max: null })).toBe(true);
  });

  it('global search across filterable columns', () => {
    const result = filterData(data, 'ali', {}, columns);
    expect(result.map((r) => r.id)).toEqual(['1']);
  });

  it('applies text + select + number-range together', () => {
    const result = filterData(
      data,
      '',
      {
        name: 'a',
        role: 'staff',
        age: { min: 30, max: 50 },
      },
      columns,
    );
    expect(result.map((r) => r.id)).toEqual(['3']);
  });
});
