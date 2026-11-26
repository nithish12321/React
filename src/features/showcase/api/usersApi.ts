import { axiosInstance } from '@/lib/axios';
import type { FetchResult, TableQuery } from '@/components/data-table/types';
import type { ShowcaseUser } from '@/mocks/data/users';

export async function fetchShowcaseUsers(q: TableQuery): Promise<FetchResult<ShowcaseUser>> {
  const { data } = await axiosInstance.get<FetchResult<ShowcaseUser>>('/users', {
    params: {
      page: q.page,
      pageSize: q.pageSize,
      search: q.search ?? '',
      sort: q.sorting?.length ? JSON.stringify(q.sorting) : undefined,
      filter: q.filters && Object.keys(q.filters).length ? JSON.stringify(q.filters) : undefined,
    },
  });
  return data;
}

export async function patchShowcaseUser(
  id: string,
  body: Partial<ShowcaseUser>,
): Promise<ShowcaseUser> {
  const { data } = await axiosInstance.patch<ShowcaseUser>(`/users/${id}`, body);
  return data;
}
