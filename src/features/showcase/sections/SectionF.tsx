import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Zap,
  CheckCircle2,
  AlertCircle,
  Clock,
  Trash2,
  Code2,
  RefreshCw,
  Server,
  Radio,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { clearLog, type ActionLogEntry } from '@/features/actionLog/actionLogSlice';
import { runScenario, type ScenarioResponse } from '../api/scenarios';
import { cn } from '@/lib/utils';

export function SectionF() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const entries = useAppSelector((s) => s.actionLog.entries);

  const [loadingScenario, setLoadingScenario] = useState<string | null>(null);
  const [result, setResult] = useState<ScenarioResponse | null>(null);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);
  const [showCode, setShowCode] = useState(false);
  const [filterKind, setFilterKind] = useState<'all' | ActionLogEntry['kind']>('all');

  const handleRun = async (scenario: string) => {
    setLoadingScenario(scenario);
    setErrorStatus(null);
    try {
      const res = await runScenario(scenario);
      setResult(res);
    } catch (err: unknown) {
      const errObj = err as { response?: { status?: number }; status?: number };
      const status = errObj.response?.status ?? errObj.status ?? 500;
      setErrorStatus(status);
      setResult(null);
    } finally {
      setLoadingScenario(null);
    }
  };

  const filteredEntries =
    filterKind === 'all' ? entries : entries.filter((e) => e.kind === filterKind);

  const badgeColor: Record<ActionLogEntry['kind'], string> = {
    auth: 'bg-primary/10 text-primary border-primary/20',
    http: 'bg-success/10 text-success border-success/20',
    action: 'bg-warning/10 text-warning border-warning/20',
  };

  return (
    <section
      id="section-f"
      className="scroll-mt-20 rounded-xl border border-border bg-surface p-6 shadow-soft transition-all"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-border">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-fg font-bold text-sm shadow-soft">
            F
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" aria-hidden />
              <h2 className="text-lg font-bold text-foreground">{t('sectionF.title')}</h2>
            </div>
            <p className="mt-1 text-xs text-muted max-w-2xl">{t('sectionF.description')}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowCode((v) => !v)}
          className="flex items-center gap-1.5 self-start sm:self-center rounded-md border border-border bg-muted-surface px-2.5 py-1 text-xs font-medium text-foreground hover:bg-surface transition-colors"
        >
          <Code2 className="h-3.5 w-3.5 text-muted" />
          <span>{showCode ? 'Hide code' : 'View code'}</span>
        </button>
      </div>

      {/* Code Toggle Drawer */}
      {showCode && (
        <div className="mt-4 rounded-lg border border-border bg-muted-surface/70 p-3 font-mono text-[11px] text-foreground overflow-x-auto">
          <div className="text-muted mb-1 font-sans font-semibold">
            // Axios 401 Single-Flight Refresh & Queue:
          </div>
          <pre>{`if (status === 401 && !config._retry) {
  config._retry = true;
  if (isRefreshing) {
    return new Promise((resolve, reject) => failedQueue.push({ resolve, reject }))
      .then(token => { config.headers.Authorization = \`Bearer \${token}\`; return axiosInstance(config); });
  }
  isRefreshing = true;
  return refreshAndRetry(config); // calls /api/auth/refresh -> retries queued requests
}`}</pre>
        </div>
      )}

      {/* Interactive Scenario Buttons */}
      <div className="mt-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">
          API Scenarios (Axios Interceptors & Mock MSW)
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            type="button"
            disabled={loadingScenario !== null}
            onClick={() => handleRun('success')}
            className="flex flex-col items-start gap-1 rounded-lg border border-border bg-surface p-3.5 text-start hover:border-success/50 hover:bg-success/5 disabled:opacity-50 transition-colors"
          >
            <div className="flex items-center gap-2 text-xs font-semibold text-success">
              <CheckCircle2 className="h-4 w-4" />
              <span>{t('sectionF.success')}</span>
            </div>
            <p className="text-[11px] text-muted">200 OK · Normal authenticated flow</p>
          </button>

          <button
            type="button"
            disabled={loadingScenario !== null}
            onClick={() => handleRun('401')}
            className="flex flex-col items-start gap-1 rounded-lg border border-border bg-surface p-3.5 text-start hover:border-warning/50 hover:bg-warning/5 disabled:opacity-50 transition-colors"
          >
            <div className="flex items-center gap-2 text-xs font-semibold text-warning">
              <RefreshCw className="h-4 w-4" />
              <span>{t('sectionF.force401')}</span>
            </div>
            <p className="text-[11px] text-muted">401 → Refresh token → Queue & retry</p>
          </button>

          <button
            type="button"
            disabled={loadingScenario !== null}
            onClick={() => handleRun('500')}
            className="flex flex-col items-start gap-1 rounded-lg border border-border bg-surface p-3.5 text-start hover:border-danger/50 hover:bg-danger/5 disabled:opacity-50 transition-colors"
          >
            <div className="flex items-center gap-2 text-xs font-semibold text-danger">
              <AlertCircle className="h-4 w-4" />
              <span>{t('sectionF.force500')}</span>
            </div>
            <p className="text-[11px] text-muted">500 Server error → Global toast alert</p>
          </button>

          <button
            type="button"
            disabled={loadingScenario !== null}
            onClick={() => handleRun('slow')}
            className="flex flex-col items-start gap-1 rounded-lg border border-border bg-surface p-3.5 text-start hover:border-primary/50 hover:bg-primary/5 disabled:opacity-50 transition-colors"
          >
            <div className="flex items-center gap-2 text-xs font-semibold text-primary">
              <Clock className="h-4 w-4" />
              <span>{t('sectionF.slow')}</span>
            </div>
            <p className="text-[11px] text-muted">2.5s delay → Top loading progress bar</p>
          </button>
        </div>
      </div>

      {/* Results and Live Action Log Grid */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Request Status / Result Card */}
        <div className="lg:col-span-1 rounded-lg border border-border bg-muted-surface/30 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <span className="text-xs font-semibold text-foreground">{t('sectionF.results')}</span>
              {loadingScenario && (
                <span className="flex items-center gap-1.5 text-xs text-primary font-medium">
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>In flight…</span>
                </span>
              )}
            </div>

            <div className="mt-3">
              {result ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted">Status:</span>
                    <span className="inline-flex items-center gap-1 rounded bg-success/15 px-2 py-0.5 text-xs font-bold text-success">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      200 OK
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted">Scenario:</span>
                    <span className="font-mono font-semibold">{result.scenario}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted">{t('sectionF.latency')}:</span>
                    <span className="font-mono">{result.latencyMs} ms</span>
                  </div>
                  {result.refreshed && (
                    <div className="rounded-md bg-warning/10 border border-warning/20 p-2 text-[11px] text-warning flex items-center gap-1.5">
                      <RefreshCw className="h-3.5 w-3.5 shrink-0" />
                      <span>{t('sectionF.refreshed')}</span>
                    </div>
                  )}
                  <p className="text-xs text-muted bg-surface rounded p-2 border border-border">
                    {result.message}
                  </p>
                </div>
              ) : errorStatus ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted">Status:</span>
                    <span className="inline-flex items-center gap-1 rounded bg-danger/15 px-2 py-0.5 text-xs font-bold text-danger">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {errorStatus} Error
                    </span>
                  </div>
                  <p className="text-xs text-danger bg-danger/5 rounded p-2 border border-danger/20">
                    Handled by Axios response interceptor → Dispatched error toast.
                  </p>
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-muted">
                  <Server className="h-8 w-8 mx-auto text-muted/50 mb-2" />
                  {t('sectionF.emptyResults')}
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-border text-[11px] text-muted flex items-center gap-1.5">
            <Radio className="h-3.5 w-3.5 text-success animate-pulse" />
            <span>Axios interceptors & RTK listener active</span>
          </div>
        </div>

        {/* Live Action Log Panel */}
        <div className="lg:col-span-2 rounded-lg border border-border bg-surface p-4 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-foreground">
                {t('sectionF.actionLog')}
              </span>
              <span className="rounded-full bg-muted-surface border border-border px-2 py-0.5 text-[10px] text-muted font-mono">
                {filteredEntries.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Category Filter */}
              <div className="flex items-center gap-1 bg-muted-surface p-0.5 rounded-md border border-border">
                {(['all', 'auth', 'http', 'action'] as const).map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setFilterKind(k)}
                    className={cn(
                      'rounded px-2 py-0.5 text-[10px] font-medium capitalize transition-colors',
                      filterKind === k
                        ? 'bg-surface text-foreground shadow-xs font-bold'
                        : 'text-muted hover:text-foreground',
                    )}
                  >
                    {k}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => dispatch(clearLog())}
                title={t('sectionF.clearLog')}
                className="rounded p-1 text-muted hover:bg-muted-surface hover:text-danger"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="mt-3 flex-1 max-h-64 overflow-y-auto space-y-1.5 pr-1">
            {filteredEntries.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted">{t('sectionF.noResults')}</div>
            ) : (
              filteredEntries.map((e) => (
                <div
                  key={e.id}
                  className="flex items-center justify-between gap-2 rounded-md bg-muted-surface/40 px-2.5 py-1.5 text-[11px] font-mono hover:bg-muted-surface transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={cn(
                        'shrink-0 rounded border px-1.5 py-0.2 text-[9px] font-semibold uppercase tracking-wider',
                        badgeColor[e.kind],
                      )}
                    >
                      {e.kind}
                    </span>
                    <span className="truncate text-foreground">{e.text}</span>
                  </div>
                  <span className="shrink-0 text-[10px] text-muted">
                    {new Date(e.time).toLocaleTimeString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
