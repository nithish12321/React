import { useCallback, useMemo, useState } from 'react';
import { Code2, Table2 } from 'lucide-react';
import { DataTable } from '@/components/data-table/DataTable';
import { useAppDispatch } from '@/app/hooks';
import { pushToast } from '@/features/ui/uiSlice';
import { MOCK_USERS, type ShowcaseUser } from '@/mocks/data/users';
import { fetchShowcaseUsers, patchShowcaseUser } from '../api/usersApi';
import {
  createUserBulkActions,
  createUserColumns,
  createUserRowActions,
} from './usersTableConfig';

export function SectionB() {
  const dispatch = useAppDispatch();
  const [mode, setMode] = useState<'client' | 'server'>('server');
  const [virtualized, setVirtualized] = useState(true);
  const [pagination, setPagination] = useState<'pages' | 'infinite'>('pages');
  const [showCode, setShowCode] = useState(false);
  const [clientUsers, setClientUsers] = useState<ShowcaseUser[]>(() => MOCK_USERS.slice());

  const toast = useCallback(
    (title: string, variant: 'success' | 'default' = 'success') => {
      dispatch(pushToast({ title, variant }));
    },
    [dispatch],
  );

  const onNameEdit = useCallback(
    async (row: ShowcaseUser, name: string) => {
      setClientUsers((prev) => prev.map((u) => (u.id === row.id ? { ...u, name } : u)));
      const idx = MOCK_USERS.findIndex((u) => u.id === row.id);
      if (idx !== -1) MOCK_USERS[idx] = { ...MOCK_USERS[idx], name };
      if (mode === 'server') await patchShowcaseUser(row.id, { name });
      toast(`Updated ${name}`);
    },
    [mode, toast],
  );

  const columns = useMemo(() => createUserColumns(onNameEdit), [onNameEdit]);
  const bulkActions = useMemo(
    () =>
      createUserBulkActions((kind, rows) =>
        toast(`${kind === 'activate' ? 'Activated' : 'Queued removal for'} ${rows.length} users`),
      ),
    [toast],
  );
  const rowActions = useMemo(
    () =>
      createUserRowActions((kind, row) =>
        toast(`${kind === 'view' ? 'Opened' : 'Removed'} ${row.name}`, 'default'),
      ),
    [toast],
  );

  return (
    <section
      id="section-b"
      className="scroll-mt-20 rounded-xl border border-border bg-surface p-6 shadow-soft"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-border">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-fg font-bold text-sm shadow-soft">
            B
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Table2 className="h-4 w-4 text-primary" aria-hidden />
              <h2 className="text-lg font-bold text-foreground">B · Data Table</h2>
            </div>
            <p className="mt-1 text-xs text-muted max-w-2xl">
              Flat Users demo (10,000 rows). Client or mocked server mode, with sort, search,
              filters, column tools, selection, inline edit, export, and URL sync. Drill-down lands
              in 4B.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowCode((v) => !v)}
          className="flex items-center gap-1.5 self-start sm:self-center rounded-md border border-border bg-muted-surface px-2.5 py-1 text-xs font-medium text-foreground hover:bg-surface"
        >
          <Code2 className="h-3.5 w-3.5 text-muted" />
          {showCode ? 'Hide code' : 'View code'}
        </button>
      </div>

      {showCode && (
        <div className="mt-4 rounded-lg border border-border bg-muted-surface/70 p-3 font-mono text-[11px] overflow-x-auto">
          <pre>{`<DataTable<User>
  id="users-table"
  mode="${mode}"
  fetchData={fetchShowcaseUsers}
  selection="multi"
  virtualized
  syncToUrl
  exportable={['csv','xlsx','pdf']}
/>`}</pre>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
        <label className="flex items-center gap-1.5 font-medium">
          Mode
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as 'client' | 'server')}
            className="rounded-md border border-border bg-surface px-2 py-1"
          >
            <option value="client">Client</option>
            <option value="server">Server (MSW)</option>
          </select>
        </label>
        <label className="flex items-center gap-1.5 font-medium">
          Pagination
          <select
            value={pagination}
            onChange={(e) => setPagination(e.target.value as 'pages' | 'infinite')}
            className="rounded-md border border-border bg-surface px-2 py-1"
          >
            <option value="pages">Pages</option>
            <option value="infinite">Infinite</option>
          </select>
        </label>
        <label className="flex items-center gap-1.5 font-medium">
          <input
            type="checkbox"
            checked={virtualized}
            onChange={() => setVirtualized((v) => !v)}
            className="h-4 w-4 rounded border-border text-primary"
          />
          Virtualize rows
        </label>
      </div>

      <div className="mt-4">
        <DataTable<ShowcaseUser>
          id="users-table"
          columns={columns}
          mode={mode}
          data={mode === 'client' ? clientUsers : undefined}
          fetchData={mode === 'server' ? fetchShowcaseUsers : undefined}
          getRowId={(r) => r.id}
          selection="multi"
          bulkActions={bulkActions}
          rowActions={rowActions}
          virtualized={virtualized}
          syncToUrl
          exportable={['csv', 'xlsx', 'pdf']}
          pagination={pagination}
        />
      </div>
    </section>
  );
}
