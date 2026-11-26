import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router';
import { parseTableUrlState, writeTableUrlState, type TableUrlSnapshot } from '../utils/urlState';

export function useTableUrlSync(
  tableId: string,
  enabled: boolean,
  state: TableUrlSnapshot,
  apply: (partial: Partial<TableUrlSnapshot>) => void,
  defaultPageSize: number,
) {
  const [params, setParams] = useSearchParams();
  const hydrated = useRef(false);

  useEffect(() => {
    if (!enabled || hydrated.current) return;
    hydrated.current = true;
    const parsed = parseTableUrlState(params, tableId);
    if (Object.keys(parsed).length) apply(parsed);
  }, [apply, enabled, params, tableId]);

  useEffect(() => {
    if (!enabled || !hydrated.current) return;
    const next = writeTableUrlState(params, tableId, state, { pageSize: defaultPageSize });
    if (next.toString() !== params.toString()) {
      setParams(next, { replace: true });
    }
  }, [defaultPageSize, enabled, params, setParams, state, tableId]);
}
