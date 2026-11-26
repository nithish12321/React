# Phase 1 decisions

- **Supabase not used**: the spec mandates an MSW-mocked backend with no real backend; all
  data is fake by design. The project's default "always use Supabase" rule is overridden by
  this explicit user spec.
- **`react-router` (v8) instead of `react-router-dom`**: v8 merged the DOM package into
  `react-router`; `react-router-dom` is a legacy re-export shim.
- **`Settings` reducer keeps both `value.presetId` and a top-level `presetId`** so the
  drawer can distinguish "custom colors" from a named preset without duplicating user
  colors into every preset.
- **Placeholder login (Phase 1)** sets demo credentials directly in the store instead of
  calling MSW; the real split-screen login with Zod validation and MSW handlers is Phase 2
  (Auth). MSW is installed, started in dev, and already serves `/api/auth/login`,
  `/api/auth/refresh`, and `/api/ping`.
- **i18n packages installed but not yet initialized**: Phase 1 scope covers the theme
  engine; the language selector changes `document.documentElement.lang`/`dir` now and is
  wired to i18next when the i18n phase lands.
- **Husky**: this environment has no git repo, so the pre-commit hook file is created but
  cannot be installed; `lint-staged` config is in `package.json` and will activate once a
  repo exists. The build script still runs full typecheck.
- **Density/shadow/radius/motion are exposed as CSS variables** (`--density-*`,
  `--shadow-current`, `--radius-base`, `--transition-duration`) so later phases never
  hardcode values (spec R8). Tailwind v4 maps them via `@theme inline` in `tokens.css`.
- **`settings` and `auth` slices are persisted**; `ui` (toasts, drawer state) is not.

# Phase 2 decisions

- **Full AppShell integration**: Sidebar, Topbar, Breadcrumbs, CommandPalette (`Ctrl+K`), ShortcutsModal (`?`), ScrollToTop, and page transitions via `framer-motion` (respecting `settings.motion.enabled` and `respectReducedMotion`).
- **Axios single-flight 401 refresh queue**: In `src/lib/interceptors.ts`, on 401 response, `isRefreshing` locks and queues concurrent requests in `failedQueue`. Once `/api/auth/refresh` returns a fresh token, all queued requests retry with the updated Bearer token. If refresh fails, `onAuthFailure` triggers auto-logout and redirect to `/login`.
- **MSW Scenario 401 Handler**: `/api/scenario` returns 401 on initial attempt to trigger the Axios interceptor and auto-refresh flow, and on retry with the refreshed token, returns 200 OK so that the full recovery flow is visible in Section F.
- **Bilingual i18n (EN/HI) with RTL support**: Topbar and Command Palette support instant language switching between English and Hindi via i18next, and direction switching between LTR and RTL (`dir="rtl"` on `<html>`).
- **Scroll-spy navigation**: In-page IntersectionObserver tracks visible sections A through G, keeping the active section indicator in the sidebar reactive in real time.

# Phase 3 decisions

- **Modular file sizing (<250 lines rule R7)**: Section A and Section C showcases are broken into small, single-responsibility files (`SectionABasic`, `SectionAIntermediate`, `SectionAAdvanced`, `SectionCOverlays`, `SectionCFeedback`) to keep each file readable, maintainable, and strictly within the 250-line guideline.
- **Form states simulator (Section 4.6)**: Section A includes a reactive top control bar enabling live switching across all 9 states (`default`, `hover`, `focus`, `filled`, `error`, `success`, `disabled`, `read-only`, `loading`) and sizes (`sm`, `md`, `lg`) across inputs, buttons, and selects.
- **Tiptap rich text & live markdown preview**: Uses installed `@tiptap/react` and `@tiptap/starter-kit` with themed action toolbar for rich text editing, paired with a dual-pane live markdown editor.
- **Overlay & feedback components**: Radix-compatible modals, confirm dialogs, multi-edge drawers, popovers, tooltips, hover cards, alerts, circular/linear progress, badges, and offline simulation banner built in `src/components/ui` and `src/components/feedback`.
- **Navigation primitives**: Tabs with spring-animated active indicator, single/multi accordion, standalone pagination with page sizing, horizontal/vertical steppers, dropdowns, contextual right-click menus, and recursive tree views implemented in `src/components/navigation`.
