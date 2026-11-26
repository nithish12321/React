import { describe, it, expect } from 'vitest';
import { sortData, toggleSort } from '@/components/data-table/utils/sorting';
import type { ColumnConfig, TableSort } from '@/components/data-table/types';

type User = { id: string; name: string; age: number };

const columns: ColumnConfig<User>[] = [
  { id: 'name', header: 'Name', accessorKey: 'name' },
  { id: 'age', header: 'Age', accessorKey: 'age' },
];

const data: User[] = [
  { id: '1', name: 'Alice', age: 30 },
  { id: '2', name: 'Bob', age: 25 },
  { id: '3', name: 'Charlie', age: 35 },
];

describe('sorting utils', () => {
  it('single column asc', () => {
    const sorted = sortData(data, [{ id: 'age', desc: false }], columns);
    expect(sorted.map((d) => d.id)).toEqual(['2', '1', '3']);
  });

  it('single column desc', () => {
    const sorted = sortData(data, [{ id: 'age', desc: true }], columns);
    expect(sorted.map((d) => d.id)).toEqual(['3', '1', '2']);
  });

  it('toggle sort single mode', () => {
    let current: TableSort[] = [];
    current = toggleSort(current, 'age', false);
    expect(current).toEqual([{ id: 'age', desc: false }]);
    current = toggleSort(current, 'age', false);
    expect(current).toEqual([{ id: 'age', desc: true }]);
    current = toggleSort(current, 'age', false);
    expect(current).toEqual([]);
  });

  it('multi-column sort uses later keys as tie-breakers', () => {
    const tied: User[] = [
      { id: '1', name: 'Amy', age: 30 },
      { id: '2', name: 'Bob', age: 30 },
      { id: '3', name: 'Amy', age: 20 },
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

  it('toggle sort multi mode', () => {
    let current: TableSort[] = [];
    current = toggleSort(current, 'age', true);
    expect(current).toEqual([{ id: 'age', desc: false }]);
    current = toggleSort(current, 'name', true);
    expect(current).toEqual([
      { id: 'age', desc: false },
      { id: 'name', desc: false },
    ]);
    // toggle desc for age
    current = toggleSort(current, 'age', true);
    expect(current).toEqual([
      { id: 'age', desc: true },
      { id: 'name', desc: false },
    ]);
    // remove name
    current = toggleSort(current, 'name', true);
    expect(current).toEqual([{ id: 'age', desc: true }]);
  });
});
