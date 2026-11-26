# 0. GOAL
A React showcase app with exactly 2 pages:
  1. /login → dummy login
  2. /app   → "Feature Showcase" (NOT a business dashboard). A live catalogue that
              demonstrates every capability of the project.

# 1. RULES OF ENGAGEMENT (follow strictly)
R1. Never ask me questions. If something is unclear, choose the simplest option that
    satisfies this spec and note it in DECISIONS.md.
R2. Work ONLY on the current phase. Do not start the next phase until I say "next".
R3. No placeholders, TODOs, "lorem" logic, or "implement later" stubs. Everything listed
    in a phase must be working and visible in the UI.
R4. After each phase: run `npm run typecheck && npm run lint && npm run build`.
    Fix all errors before replying. Never reply with a broken build.
R5. TypeScript strict. No `any`, no `@ts-ignore`.
R6. Do not install libraries outside the approved stack (section 2) without a one-line
    justification in DECISIONS.md.
R7. Prefer many small files (<250 lines each) over giant files.
R8. Never hardcode colors, fonts, radius, or spacing in components. Use theme tokens
    (CSS variables) only.
R9. Every component must handle: loading, empty, error, disabled states where relevant.
R10. End every phase reply with this exact format:
     ✅ Completed: (bullets)
     ⚠️ Deviations: (bullets or "none")
     ▶️ How to verify: (exact steps I can click through)
     🔜 Next phase: (name)

# 2. APPROVED STACK (fixed, do not substitute)
Run `npm view <pkg> version` and install the latest stable version of each. Pin exact versions.
- Build/lang:   Vite, React 19, TypeScript (strict)
- Routing:      React Router (data router: createBrowserRouter, lazy routes, loaders, guards)
- State/API:    Redux Toolkit, RTK Query, redux-persist, Axios
- Mock backend: MSW (all APIs are mocked, no real backend)
- UI:           Tailwind CSS v4, shadcn/ui (Radix), lucide-react, class-variance-authority
- Table:        @tanstack/react-table, @tanstack/react-virtual, dnd-kit
- Forms:        react-hook-form, zod, @hookform/resolvers
- Motion:       framer-motion
- Charts:       recharts
- i18n:         i18next, react-i18next (English + Hindi)
- Rich text:    @tiptap/react
- Dates:        date-fns, react-day-picker
- Export:       papaparse (CSV), xlsx (Excel), jspdf + jspdf-autotable (PDF)
- Quality:      ESLint, Prettier, Husky, lint-staged, Vitest, React Testing Library, Playwright

# 3. FOLDER STRUCTURE (create exactly this; add subfolders as needed)
src/
  app/          store.ts, rootReducer.ts, router.tsx, providers.tsx, hooks.ts
  features/
    auth/       LoginPage, authSlice, authApi, ProtectedRoute
    showcase/   ShowcasePage, sections/ (one file per section A–G)
    settings/   settingsSlice, SettingsDrawer, themeEngine.ts, presets.ts
  components/
    ui/         primitives (Button, Input, Select, ...)
    data-table/ DataTable.tsx, types.ts, hooks/, parts/, plugins/
    layout/     AppShell, Sidebar, Topbar, Breadcrumbs, CommandPalette
    feedback/   Toast, Modal, Drawer, Skeleton, EmptyState, ErrorBoundary
  hooks/        useDebounce, useMediaQuery, useClickOutside, useIdleTimer, ...
  lib/          axios.ts, interceptors.ts, utils.ts, formatters.ts, constants.ts
  mocks/        browser.ts, handlers/, data/
  i18n/         index.ts, en.json, hi.json
  styles/       globals.css, tokens.css
  types/        shared types
Alias: "@/" → "src/". Every route and heavy component is lazy-loaded.

# 4. FEATURE PRIORITY (build in this order of priority)
MUST   = required for acceptance. SHOULD = build if time allows. COULD = optional.

## 4.1 Auth (MUST)
- Split-screen login, email + password (show/hide), remember-me, Zod validation,
  button loading state, inline + toast errors.
- Credentials: admin@demo.com / Admin@123 → MSW returns fake accessToken (expires in 60s
  for demo) + refreshToken.
- Tokens stored in authSlice (persisted). ProtectedRoute redirects unauthenticated users.
- "Forgot password", "Google", "GitHub" buttons = UI-only (show a toast).

## 4.2 Redux + Interceptors (MUST)
- Typed hooks, memoized selectors (createSelector).
- Slices: auth, settings, ui, notifications, tableState.
- Custom RTK Query baseQuery that uses the Axios instance.
- Request interceptor: add Bearer token + X-Request-Id; show global top loading bar.
- Response interceptor: on 401, refresh the token ONCE, queue other failed requests,
  retry them after refresh; if refresh fails → logout + redirect to /login.
  Handle 403/404/500 with toasts. Retry network errors with exponential backoff (max 3).
- Listener middleware: auto-logout on token expiry; log every action to an action-log.
- Showcase section "Redux & API" has buttons: Success, Force 401, Force 500, Slow network,
  and a live action-log panel showing interceptors reacting.

## 4.3 Settings & Theme Engine (MUST)
Gear icon in Topbar opens SettingsDrawer. Changes apply instantly via CSS variables on
<html>, persist across refresh, and need no reload. The settings shape is fixed:

type Settings = {
  mode: 'light'|'dark'|'system'; highContrast: boolean;
  colors: { primary; secondary; accent; success; warning; danger; background; surface: string };
  presetId: string;                      // min 8 presets: Ocean, Forest, Sunset, Midnight, Rose, Slate, Violet, Amber
  font: { family: string; size: number /*12-20*/; weight: number; lineHeight: number; letterSpacing: number };
  radius: 'none'|'sm'|'md'|'lg'|'xl'|'full';
  density: 'compact'|'comfortable'|'spacious';
  shadow: 'none'|'soft'|'medium'|'strong';
  layout: { sidebarPosition: 'left'|'right'; sidebarStyle: 'full'|'mini'|'floating'|'topnav';
            contentWidth: 'fluid'|'boxed'; stickyHeader; breadcrumbs; footer: boolean };
  motion: { enabled: boolean; speed: 'slow'|'normal'|'fast'; respectReducedMotion: boolean };
  locale: { language: 'en'|'hi'; direction: 'ltr'|'rtl'; dateFormat: string; timezone: string };
  table: { pageSize: number; density; striped: boolean };
};
Also: Reset, Export JSON, Import JSON. Min 8 font options. Warn if color contrast < 4.5:1.

## 4.4 Layout (MUST)
AppShell: collapsible grouped sidebar, topbar (Ctrl/Cmd+K command palette, notifications,
profile menu, language switcher, theme toggle, settings gear), breadcrumbs, scroll-spy
inside Showcase, scroll-to-top, responsive (mobile drawer / tablet / desktop), page
transitions, skeleton loaders, "?" keyboard-shortcuts modal. 4/8px spacing grid.

## 4.5 Reusable DataTable (MUST, the most important part)
Generic <DataTable<T> />, fully typed, with this public contract:

type DataTableProps<T> = {
  id: string;                              // used for URL/Redux state keys
  columns: ColumnConfig<T>[];
  mode: 'client' | 'server';
  data?: T[];                              // client mode
  fetchData?: (q: TableQuery) => Promise<{ rows: T[]; total: number }>; // server mode
  getRowId: (row: T) => string;
  selection?: 'none'|'single'|'multi';
  bulkActions?: BulkAction<T>[];
  rowActions?: RowAction<T>[];
  drillDown?: DrillDownConfig<T>;
  detailTabs?: DetailTab<T>[];
  detailMode?: 'inline'|'drawer'|'modal'|'route';
  virtualized?: boolean;
  syncToUrl?: boolean;
  exportable?: ('csv'|'xlsx'|'pdf')[];
  pagination?: 'pages' | 'infinite';
};
type DrillDownConfig<T> = {
  getChildren: (row: any, level: number) => Promise<any[]>;
  columnsByLevel: Record<number, ColumnConfig<any>[]>;   // different columns per level
  hasChildren?: (row: any, level: number) => boolean;
  maxLevel?: number;                                      // undefined = unlimited
  persistExpansion?: boolean;
};
type DetailTab<T> = { id: string; label: string; icon?: ReactNode;
  badge?: (row: T) => number|string; render: (row: T) => ReactNode; lazy?: boolean };

Features (all MUST unless marked):
- Pagination: page-size selector, first/prev/next/last, jump-to-page, total count.
- Sorting: single + multi-column. Debounced global search. Per-column filters
  (text, select, date-range, number-range) with removable filter chips.
- Columns: show/hide, drag reorder, resize, pin left/right, sticky header.
- Row selection (multi, select-all across pages) + bulk action bar.
- Row actions menu, inline cell edit, cell renderers (badge, avatar, progress, link,
  currency, date, boolean).
- Density toggle, zebra rows, skeleton/empty/error states.
- Virtualization for 10,000 rows (SHOULD: row grouping + aggregation footer).
- Export CSV/XLSX/PDF for current view or selected rows.
- N-level drill-down: unlimited recursion, lazy fetch on expand with per-row spinner,
  indentation guides, expand-all/collapse-all, persisted expansion.
- Detail tabs under a row: tabs lazy render, remember active tab, keyboard navigable,
  4 display modes (inline panel, drawer, modal, route with deep-link).
- State (page, sort, filters, columns) synced to URL query string.
- Three live demos:
    1. Users: 2 levels (User → Orders), detail tabs: Profile form, Activity timeline, Files
    2. Orders: 3 levels (Order → Items → Shipments), different columns per level
    3. Org chart: unlimited depth (Company → Dept → Team → Person → ...)

## 4.6 Form Elements (MUST, each rendered with ALL states: default, hover, focus,
##     filled, error, success, disabled, read-only, loading; sizes sm/md/lg)
Basic: text, email, password, number, textarea (counter), checkbox, radio, switch,
  select, buttons (all variants + loading + split + group).
Intermediate: multi-select, combobox, async autocomplete, tags input, slider, range slider,
  date picker, date-range picker, time picker, color picker, file upload (drag-drop,
  preview, progress, multiple), OTP input, phone with country code, currency input,
  masked input, rating, segmented control, number stepper.
Advanced: Tiptap rich text editor, markdown editor with preview, dynamic field array,
  multi-step wizard with per-step validation + progress, cascading dropdowns
  (country → state → city), unsaved-changes warning, autosave draft,
  JSON-schema-driven form renderer. (SHOULD: signature pad, code editor.)
Every input supports: label, helper text, error text, required, prefix/suffix icon, clear button.

## 4.7 Other showcase components (build all MUST items, SHOULD if time allows)
Navigation (MUST): tabs (horizontal/vertical/pill), accordion, standalone pagination,
  stepper, dropdown/context menu, tree view.
Overlays (MUST): modal (sizes, nested), confirm dialog, drawer, popover, tooltip, hover card.
Feedback (MUST): stacked toasts with actions, alerts, progress (bar + circular), skeleton,
  spinner, empty state, result pages, badges, notification center, offline banner.
Data display (MUST): cards, stat cards, avatar group, timeline, kanban (drag-drop),
  carousel, calendar, JSON viewer. (SHOULD: diff viewer, QR code, image gallery, lightbox.)
Charts (MUST): line, bar, area, donut, radar, sparkline, combo. (SHOULD: heatmap, gauge.)
  All theme-aware.
Utilities (MUST): copy-to-clipboard, infinite scroll, sortable drag list, resizable
  panes, debounce/throttle demo, error-boundary demo, lazy/Suspense demo,
  optimistic-update demo, mocked live-updates (SSE-style) demo, idle-timeout warning.
  (COULD: PWA, print, fullscreen.)

## 4.8 Showcase page structure
Left in-page nav with sections (scroll-spy):
A Forms · B Data Table · C Overlays & Feedback · D Navigation · E Data Display & Charts
· F Redux & API · G Utilities.
Each demo has a title, short description, and a "View code" toggle.

# 5. QUALITY BAR
- WCAG 2.1 AA: semantic HTML, ARIA, visible focus, keyboard support.
- Memoize heavy parts; lazy-load routes; no console errors/warnings.
- Tests: Vitest for DataTable logic, interceptors, and slices; one Playwright test:
  login → showcase → expand a table row to level 3.
- README: setup, architecture, folder map, "how to add a column / tab / drill-down level /
  theme preset". Also `.env.example`, and scripts: dev, build, preview, lint, typecheck, test, e2e.

# 6. ACCEPTANCE CHECKLIST (final)
[ ] Login works with dummy credentials; protected routes block anonymous users
[ ] Token expiry → refresh → retry flow visible in the Redux & API section
[ ] Changing any setting updates the whole UI instantly and survives refresh
[ ] Table supports 3+ drill-down levels with different columns per level
[ ] Tabs/screens render under a row in all 4 detail modes
[ ] Every form element shows all states
[ ] Build, typecheck, lint, and tests all pass with zero warnings
