import { http, HttpResponse, delay } from 'msw';
import { applyUserQuery, MOCK_USERS, type ShowcaseUser } from '@/mocks/data/users';

function parseListParams(url: URL) {
  const page = Number(url.searchParams.get('page') ?? '1') || 1;
  const pageSize = Number(url.searchParams.get('pageSize') ?? '10') || 10;
  const search = url.searchParams.get('search') ?? '';
  const sortParam = url.searchParams.get('sort');
  const filterParam = url.searchParams.get('filter');
  let sorting: { id: string; desc: boolean }[] = [];
  let filters: Record<string, unknown> = {};
  try {
    sorting = sortParam ? (JSON.parse(sortParam) as { id: string; desc: boolean }[]) : [];
  } catch {
    sorting = [];
  }
  try {
    filters = filterParam ? (JSON.parse(filterParam) as Record<string, unknown>) : {};
  } catch {
    filters = {};
  }
  return { page, pageSize, search, sorting, filters };
}

export const usersHandlers = [
  http.get('/api/users', async ({ request }) => {
    await delay(180);
    const url = new URL(request.url);
    const params = parseListParams(url);
    const result = applyUserQuery(MOCK_USERS, params);
    return HttpResponse.json(result);
  }),

  http.get('/api/users/ids', async ({ request }) => {
    await delay(80);
    const url = new URL(request.url);
    const params = parseListParams(url);
    const result = applyUserQuery(MOCK_USERS, { ...params, page: 1, pageSize: MOCK_USERS.length });
    return HttpResponse.json({ ids: result.rows.map((u) => u.id) });
  }),

  http.patch('/api/users/:id', async ({ params, request }) => {
    await delay(120);
    const id = String(params.id);
    const body = (await request.json()) as Partial<ShowcaseUser>;
    const idx = MOCK_USERS.findIndex((u) => u.id === id);
    if (idx === -1) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 });
    }
    MOCK_USERS[idx] = { ...MOCK_USERS[idx], ...body };
    return HttpResponse.json(MOCK_USERS[idx]);
  }),
];
