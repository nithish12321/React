import { describe, it, expect } from 'vitest';
import { compareValues, sortData, toggleSort } from '@/components/data-table/utils/sorting';
import type { ColumnConfig } from '@/components/data-table/types';

type User = { id: string; name: string; age: number; active: boolean; joined: string };

const columns: ColumnConfig<User>[] = [
  { id: 'name', header: 'Name', accessorKey: 'name' },
  { id: 'age', header: 'Age', accessorKey: 'age' },
  { id: 'active', header: 'Active', accessorKey: 'active' },
  { id: 'joined', header: 'Joined', accessorKey: 'joined' },
];

const data: User[] = [
  { id: '1', name: 'Alice', age: 30, active: true, joined: '2024-01-10' },
  { id: '2', name: 'Bob', age: 25, active: false, joined: '2023-12-01' },
  { id: '3', name: 'Charlie', age: 35, active: true, joined: '2024-06-01' },
];

describe('compareValues', () => {
  it('numbers compare numerically', () => {
    expect(compareValues(1, 2)).toBeLessThan(0);
    expect(compareValues(2, 1)).toBeGreaterThan(0);
    expect(compareValues(5, 5)).toBe(0);
  });

  it('booleans: false < true', () => {
    expect(compareValues(false, true)).toBeLessThan(0);
    expect(compareValues(true, false)).toBeGreaterThan(0);
    expect(compareValues(true, true)).toBe(0);
  });

  it('strings compare case-insensitively via localeCompare', () => {
    expect(compareValues('apple', 'Banana')).toBeLessThan(0);
    expect(compareValues('Zebra', 'apple')).toBeGreaterThan(0);
  });

  it('parses ISO date strings', () => {
    expect(compareValues('2024-01-01', '2024-06-01')).toBeLessThan(0);
    expect(compareValues('2024-06-01', '2024-01-01')).toBeGreaterThan(0);
  });

  it('nulls sort last regardless of direction caller', () => {
    expect(compareValues(null, 'a')).toBe(1);
    expect(compareValues('a', null)).toBe(-1);
    expect(compareValues(null, null)).toBe(0);
  });
});

describe('sorting utils', () => {
  it('single column asc by age', () => {
    const sorted = sortData(data, [{ id: 'age', desc: false }], columns);
    expect(sorted.map((d) => d.id)).toEqual(['2', '1', '3']);
  });

  it('single column desc by age', () => {
    const sorted = sortData(data, [{ id: 'age', desc: true }], columns);
    expect(sorted.map((d) => d.id)).toEqual(['3', '1', '2']);
  });

  it('sorts booleans', () => {
    const sorted = sortData(data, [{ id: 'active', desc: false }], columns);
    expect(sorted.map((d) => d.id)).toEqual(['2', '1', '3']);
  });

  it('sorts date strings chronologically', () => {
    const sorted = sortData(data, [{ id: 'joined', desc: false }], columns);
    expect(sorted.map((d) => d.id)).toEqual(['2', '1', '3']);
  });

  it('does not mutate the input array', () => {
    const copy = [...data];
    sortData(data, [{ id: 'age', desc: false }], columns);
    expect(data.map((d) => d.id)).toEqual(copy.map((d) => d.id));
  });

  it('empty sorting returns a shallow copy', () => {
    const sorted = sortData(data, [], columns);
    expect(sorted).not.toBe(data);
    expect(sorted.map((d) => d.id)).toEqual(['1', '2', '3']);
  });

  it('toggle sort single mode cycles asc→desc→off', () => {
    let current = toggleSort([], 'age', false);
    expect(current).toEqual([{ id: 'age', desc: false }]);
    current = toggleSort(current, 'age', false);
    expect(current).toEqual([{ id: 'age', desc: true }]);
    current = toggleSort(current, 'age', false);
    expect(current).toEqual([]);
  });

  it('single mode toggle replaces previous column', () => {
    let current = toggleSort([], 'age', false);
    current = toggleSort(current, 'name', false);
    expect(current).toEqual([{ id: 'name', desc: false }]);
  });

  it('multi-column sort uses later keys as tie-breakers', () => {
    const tied: User[] = [
      { id: '1', name: 'Amy', age: 30, active: true, joined: '2024-01-01' },
      { id: '2', name: 'Bob', age: 30, active: true, joined: '2024-01-01' },
      { id: '3', name: 'Amy', age: 20, active: true, joined: '2024-01-01' },
    ];
    const sorted = sortData(
      tied,
      [
        { id: 'name', desc: false },
        { id: 'age', desc: true },
      ],
      columns,
    );
    expect(sorted.map((d) => d.id)).toEqual(['1', '3', '2']);
  });

  it('toggle sort multi mode cycles per column independently', () => {
    let current = toggleSort([], 'age', true);
    expect(current).toEqual([{ id: 'age', desc: false }]);
    current = toggleSort(current, 'name', true);
    expect(current).toEqual([
      { id: 'age', desc: false },
      { id: 'name', desc: false },
    ]);
    current = toggleSort(current, 'age', true);
    expect(current).toEqual([
      { id: 'age', desc: true },
      { id: 'name', desc: false },
    ]);
    current = toggleSort(current, 'name', true);
    expect(current).toEqual([
      { id: 'age', desc: true },
      { id: 'name', desc: true },
    ]);
    current = toggleSort(current, 'name', true);
    expect(current).toEqual([{ id: 'age', desc: true }]);
  });

  it('accessorFn is used when present', () => {
    const cols: ColumnConfig<User>[] = [
      { id: 'double', header: 'Double', accessorFn: (r) => r.age * 2 },
    ];
    const sorted = sortData(data, [{ id: 'double', desc: false }], cols);
    expect(sorted.map((d) => d.id)).toEqual(['2', '1', '3']);
  });
});
