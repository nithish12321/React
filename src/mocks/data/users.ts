export type UserRole = 'admin' | 'manager' | 'staff' | 'guest';
export type UserStatus = 'active' | 'pending' | 'inactive';

export interface ShowcaseUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  avatarUrl?: string;
  progress: number;
  salary: number;
  verified: boolean;
}

const ROLES: UserRole[] = ['admin', 'manager', 'staff', 'guest'];
const STATUSES: UserStatus[] = ['active', 'pending', 'inactive'];
const FIRST = ['Ava', 'Noah', 'Mia', 'Liam', 'Zoe', 'Owen', 'Ivy', 'Eli', 'Nia', 'Kai'];
const LAST = ['Shah', 'Patel', 'Kim', 'Chen', 'Singh', 'Lopez', 'Khan', 'Ng', 'Das', 'Reed'];

export const USERS_TOTAL = 10_000;

export function createShowcaseUser(index: number): ShowcaseUser {
  const i = index + 1;
  const first = FIRST[index % FIRST.length];
  const last = LAST[Math.floor(index / FIRST.length) % LAST.length];
  return {
    id: `user-${i}`,
    name: `${first} ${last} ${i}`,
    email: `user${i}@demo.com`,
    role: ROLES[index % ROLES.length],
    status: STATUSES[index % STATUSES.length],
    createdAt: new Date(Date.UTC(2024, 0, 1) + index * 36e5).toISOString(),
    progress: (index * 7) % 101,
    salary: 42000 + (index % 80) * 750,
    verified: index % 3 !== 2,
  };
}

export const MOCK_USERS: ShowcaseUser[] = Array.from({ length: USERS_TOTAL }, (_, i) =>
  createShowcaseUser(i),
);

export function applyUserQuery(
  source: ShowcaseUser[],
  params: {
    page: number;
    pageSize: number;
    search: string;
    sorting: { id: string; desc: boolean }[];
    filters: Record<string, unknown>;
  },
): { rows: ShowcaseUser[]; total: number } {
  const q = params.search.trim().toLowerCase();
  let filtered = source.filter((u) => {
    if (q && !u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) {
      return false;
    }
    for (const [col, raw] of Object.entries(params.filters)) {
      if (!matchesUserFilter(u, col, raw)) return false;
    }
    return true;
  });

  if (params.sorting.length) {
    filtered = [...filtered].sort((a, b) => {
      for (const sort of params.sorting) {
        const av = (a as unknown as Record<string, unknown>)[sort.id];
        const bv = (b as unknown as Record<string, unknown>)[sort.id];
        if (av === bv) continue;
        if (av == null) return 1;
        if (bv == null) return -1;
        if (av < bv) return sort.desc ? 1 : -1;
        if (av > bv) return sort.desc ? -1 : 1;
      }
      return 0;
    });
  }

  const total = filtered.length;
  const start = Math.max(0, (params.page - 1) * params.pageSize);
  return { rows: filtered.slice(start, start + params.pageSize), total };
}

function matchesUserFilter(user: ShowcaseUser, col: string, raw: unknown): boolean {
  if (raw == null || raw === '') return true;
  const record = user as unknown as Record<string, unknown>;
  const cell = record[col];

  if (typeof raw === 'object' && !Array.isArray(raw)) {
    const obj = raw as Record<string, unknown>;
    if ('from' in obj || 'to' in obj) {
      const time = new Date(String(cell)).getTime();
      if (obj.from && time < new Date(String(obj.from)).getTime()) return false;
      if (obj.to) {
        const to = new Date(String(obj.to));
        to.setHours(23, 59, 59, 999);
        if (time > to.getTime()) return false;
      }
      return true;
    }
    if ('min' in obj || 'max' in obj) {
      const num = Number(cell);
      if (obj.min != null && obj.min !== '' && num < Number(obj.min)) return false;
      if (obj.max != null && obj.max !== '' && num > Number(obj.max)) return false;
      return true;
    }
  }

  if (Array.isArray(raw)) return raw.includes(String(cell));
  if (col === 'role' || col === 'status' || col === 'verified') {
    return String(cell) === String(raw);
  }
  return String(cell).toLowerCase().includes(String(raw).toLowerCase());
}
