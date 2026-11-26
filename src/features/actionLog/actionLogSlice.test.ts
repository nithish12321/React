import { describe, it, expect } from 'vitest';
import actionLogReducer, { logEntry, clearLog } from './actionLogSlice';

describe('actionLogSlice', () => {
  const initial = actionLogReducer(undefined, { type: '@@INIT' });

  it('starts with empty log', () => {
    expect(initial.entries).toEqual([]);
    expect(initial.nextId).toBe(1);
  });

  it('prepends new entries', () => {
    const s1 = actionLogReducer(initial, logEntry({ text: 'action-1', kind: 'action' }));
    expect(s1.entries).toHaveLength(1);
    expect(s1.entries[0].text).toBe('action-1');
    expect(s1.entries[0].kind).toBe('action');

    const s2 = actionLogReducer(s1, logEntry({ text: 'auth-2', kind: 'auth' }));
    expect(s2.entries).toHaveLength(2);
    expect(s2.entries[0].text).toBe('auth-2');
    expect(s2.entries[1].text).toBe('action-1');
  });

  it('clears log', () => {
    const s1 = actionLogReducer(initial, logEntry({ text: 'test', kind: 'http' }));
    const s2 = actionLogReducer(s1, clearLog());
    expect(s2.entries).toHaveLength(0);
  });
});
