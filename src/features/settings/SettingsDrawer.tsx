import { useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { closeSettings, pushToast } from '@/features/ui/uiSlice';
import {
  setMode,
  setHighContrast,
  setColor,
  applyPreset,
  setFont,
  setRadius,
  setDensity,
  setShadow,
  setLayout,
  setMotion,
  setLocale,
  setTable,
  importSettings,
  resetSettings,
} from './settingsSlice';
import { THEME_PRESETS } from './presets';
import { FONT_FAMILIES } from './fontFamilies';
import { lowContrastColors, contrastRatio, resolveMode } from './themeEngine';
import { activePalette } from './palette';
import {
  Row,
  SectionTitle,
  SelectControl,
  SwitchControl,
  NumberStepper,
  ColorSwatch,
} from './controls';
import { X, RotateCcw, Download, Upload, AlertTriangle } from 'lucide-react';
import type { Settings } from './types';

function downloadJson(data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'showcase-settings.json';
  a.click();
  URL.revokeObjectURL(url);
}

export function SettingsDrawer() {
  const open = useAppSelector((s) => s.ui.settingsOpen);
  const settings = useAppSelector((s) => s.settings.value);
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resolvedMode = resolveMode(settings.mode);
  const palette = activePalette(settings, resolvedMode);
  const lowContrast = lowContrastColors(settings);

  const s: Settings = settings;

  return (
    <div className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={() => dispatch(closeSettings())}
      />
      <aside
        role="dialog"
        aria-label="Settings"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-surface shadow-strong transition-transform duration-200 ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <header className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-base font-semibold">Settings</h2>
          <button
            type="button"
            aria-label="Close settings"
            onClick={() => dispatch(closeSettings())}
            className="rounded-md p-1 hover:bg-muted-surface"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          {lowContrast.length > 0 && (
            <div
              className="mb-3 flex items-start gap-2 rounded-md bg-warning/10 p-2 text-xs text-warning"
              role="alert"
            >
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <span>
                Low contrast (below 4.5:1): {lowContrast.join(', ')}. Text may be hard to read.
              </span>
            </div>
          )}

          <SectionTitle>Theme</SectionTitle>
          <Row label="Mode">
            <SelectControl
              value={s.mode}
              options={['light', 'dark', 'system'] as const}
              onChange={(v) => dispatch(setMode(v))}
            />
          </Row>
          <Row label="High contrast">
            <SwitchControl
              checked={s.highContrast}
              onChange={(v) => dispatch(setHighContrast(v))}
              label="High contrast"
            />
          </Row>

          <SectionTitle>Color preset</SectionTitle>
          <div className="grid grid-cols-4 gap-2 py-2">
            {THEME_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => dispatch(applyPreset(p))}
                aria-pressed={s.presetId === p.id}
                className={`rounded-lg border p-2 text-center text-xs transition-all ${
                  s.presetId === p.id
                    ? 'border-primary ring-2 ring-ring'
                    : 'border-border hover:border-primary'
                }`}
              >
                <span className="mx-auto mb-1 flex h-6 w-6 overflow-hidden rounded-full ring-1 ring-border">
                  <span className="w-1/2" style={{ background: palette.primary }} />
                  <span className="w-1/2" style={{ background: palette.accent }} />
                </span>
                {p.name}
              </button>
            ))}
          </div>

          <SectionTitle>Colors</SectionTitle>
          <div className="flex flex-wrap justify-between gap-2 py-2">
            {(Object.keys(palette) as string[]).map((key) => (
              <ColorSwatch
                key={key}
                name={key}
                value={palette[key as keyof typeof palette]}
                onChange={(value) =>
                  dispatch(setColor({ key: key as keyof Settings['colors'], value }))
                }
              />
            ))}
          </div>
          <p className="text-xs text-muted">
            Background/text contrast ratio:{' '}
            {contrastRatio(palette.primary, palette.background).toFixed(2)} (primary vs bg)
          </p>

          <SectionTitle>Typography</SectionTitle>
          <Row label="Font family">
            <SelectControl
              value={s.font.family}
              options={FONT_FAMILIES}
              onChange={(v) => dispatch(setFont({ family: v }))}
            />
          </Row>
          <Row label="Font size" hint="12–20px">
            <NumberStepper
              value={s.font.size}
              min={12}
              max={20}
              onChange={(v) => dispatch(setFont({ size: v }))}
            />
          </Row>
          <Row label="Font weight">
            <SelectControl
              value={String(s.font.weight)}
              options={['300', '400', '500', '600', '700']}
              onChange={(v) => dispatch(setFont({ weight: Number(v) }))}
            />
          </Row>
          <Row label="Line height">
            <NumberStepper
              value={s.font.lineHeight}
              min={1}
              max={2}
              step={0.1}
              onChange={(v) => dispatch(setFont({ lineHeight: Math.round(v * 10) / 10 }))}
            />
          </Row>
          <Row label="Letter spacing" hint="-0.05 to 0.1em">
            <NumberStepper
              value={s.font.letterSpacing}
              min={-0.05}
              max={0.1}
              step={0.01}
              onChange={(v) => dispatch(setFont({ letterSpacing: Math.round(v * 100) / 100 }))}
            />
          </Row>

          <SectionTitle>Appearance</SectionTitle>
          <Row label="Corner radius">
            <SelectControl
              value={s.radius}
              options={['none', 'sm', 'md', 'lg', 'xl', 'full'] as const}
              onChange={(v) => dispatch(setRadius(v))}
            />
          </Row>
          <Row label="Density">
            <SelectControl
              value={s.density}
              options={['compact', 'comfortable', 'spacious'] as const}
              onChange={(v) => dispatch(setDensity(v))}
            />
          </Row>
          <Row label="Shadow">
            <SelectControl
              value={s.shadow}
              options={['none', 'soft', 'medium', 'strong'] as const}
              onChange={(v) => dispatch(setShadow(v))}
            />
          </Row>

          <SectionTitle>Layout</SectionTitle>
          <Row label="Sidebar position">
            <SelectControl
              value={s.layout.sidebarPosition}
              options={['left', 'right'] as const}
              onChange={(v) => dispatch(setLayout({ sidebarPosition: v }))}
            />
          </Row>
          <Row label="Sidebar style">
            <SelectControl
              value={s.layout.sidebarStyle}
              options={['full', 'mini', 'floating', 'topnav'] as const}
              onChange={(v) => dispatch(setLayout({ sidebarStyle: v }))}
            />
          </Row>
          <Row label="Content width">
            <SelectControl
              value={s.layout.contentWidth}
              options={['fluid', 'boxed'] as const}
              onChange={(v) => dispatch(setLayout({ contentWidth: v }))}
            />
          </Row>
          <Row label="Sticky header">
            <SwitchControl
              checked={s.layout.stickyHeader}
              onChange={(v) => dispatch(setLayout({ stickyHeader: v }))}
              label="Sticky header"
            />
          </Row>
          <Row label="Breadcrumbs">
            <SwitchControl
              checked={s.layout.breadcrumbs}
              onChange={(v) => dispatch(setLayout({ breadcrumbs: v }))}
              label="Breadcrumbs"
            />
          </Row>
          <Row label="Footer">
            <SwitchControl
              checked={s.layout.footer}
              onChange={(v) => dispatch(setLayout({ footer: v }))}
              label="Footer"
            />
          </Row>

          <SectionTitle>Motion</SectionTitle>
          <Row label="Animations">
            <SwitchControl
              checked={s.motion.enabled}
              onChange={(v) => dispatch(setMotion({ enabled: v }))}
              label="Animations"
            />
          </Row>
          <Row label="Speed">
            <SelectControl
              value={s.motion.speed}
              options={['slow', 'normal', 'fast'] as const}
              onChange={(v) => dispatch(setMotion({ speed: v }))}
            />
          </Row>
          <Row label="Respect reduced motion">
            <SwitchControl
              checked={s.motion.respectReducedMotion}
              onChange={(v) => dispatch(setMotion({ respectReducedMotion: v }))}
              label="Respect reduced motion"
            />
          </Row>

          <SectionTitle>Locale</SectionTitle>
          <Row label="Language">
            <SelectControl
              value={s.locale.language}
              options={[
                { value: 'en' as const, label: 'English' },
                { value: 'hi' as const, label: 'हिन्दी' },
              ]}
              onChange={(v) => dispatch(setLocale({ language: v }))}
            />
          </Row>
          <Row label="Direction">
            <SelectControl
              value={s.locale.direction}
              options={['ltr', 'rtl'] as const}
              onChange={(v) => dispatch(setLocale({ direction: v }))}
            />
          </Row>
          <Row label="Date format">
            <SelectControl
              value={s.locale.dateFormat}
              options={['yyyy-MM-dd', 'dd/MM/yyyy', 'MM/dd/yyyy', 'PPP']}
              onChange={(v) => dispatch(setLocale({ dateFormat: v }))}
            />
          </Row>
          <Row label="Timezone">
            <SelectControl
              value={s.locale.timezone}
              options={['UTC', 'America/New_York', 'Europe/London', 'Asia/Kolkata']}
              onChange={(v) => dispatch(setLocale({ timezone: v }))}
            />
          </Row>

          <SectionTitle>Tables</SectionTitle>
          <Row label="Page size">
            <SelectControl
              value={String(s.table.pageSize)}
              options={['10', '25', '50', '100']}
              onChange={(v) => dispatch(setTable({ pageSize: Number(v) }))}
            />
          </Row>
          <Row label="Table density">
            <SelectControl
              value={s.table.density}
              options={['compact', 'comfortable', 'spacious'] as const}
              onChange={(v) => dispatch(setTable({ density: v }))}
            />
          </Row>
          <Row label="Striped rows">
            <SwitchControl
              checked={s.table.striped}
              onChange={(v) => dispatch(setTable({ striped: v }))}
              label="Striped rows"
            />
          </Row>
        </div>

        <footer className="flex items-center gap-2 border-t border-border px-4 py-3">
          <button
            type="button"
            onClick={() => dispatch(resetSettings())}
            className="flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted-surface"
          >
            <RotateCcw className="h-4 w-4" aria-hidden /> Reset
          </button>
          <button
            type="button"
            onClick={() => downloadJson(s)}
            className="flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted-surface"
          >
            <Download className="h-4 w-4" aria-hidden /> Export
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted-surface"
          >
            <Upload className="h-4 w-4" aria-hidden /> Import
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => {
                try {
                  const parsed = JSON.parse(String(reader.result)) as Settings;
                  dispatch(importSettings(parsed));
                  dispatch(pushToast({ title: 'Settings imported', variant: 'success' }));
                } catch {
                  dispatch(
                    pushToast({
                      title: 'Import failed',
                      description: 'Invalid settings file',
                      variant: 'error',
                    }),
                  );
                }
              };
              reader.readAsText(file);
              e.target.value = '';
            }}
          />
        </footer>
      </aside>
    </div>
  );
}
