import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Table2,
  BarChart3,
  Wrench,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Palette,
} from 'lucide-react';
import { useAppDispatch } from '@/app/hooks';
import { setActiveSection } from '@/features/ui/uiSlice';
import { SectionA } from './sections/SectionA';
import { SectionB } from './sections/SectionB';
import { SectionC } from './sections/SectionC';
import { SectionD } from './sections/SectionD';
import { SectionF } from './sections/SectionF';
import { PlaceholderSection } from './sections/PlaceholderSection';

export default function ShowcasePage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  // Scroll-spy observer for sections A to G
  useEffect(() => {
    const sectionIds = [
      'section-a',
      'section-b',
      'section-c',
      'section-d',
      'section-e',
      'section-f',
      'section-g',
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) {
          dispatch(setActiveSection(visible.target.id));
        }
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 },
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [dispatch]);

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-soft">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Phase 4A · DataTable core + Users demo live</span>
            </div>
            <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {t('app.title')}
            </h1>
            <p className="mt-2 text-sm text-muted leading-relaxed">
              {t('app.subtitle')}. Built with React 19, TypeScript strict, Redux Toolkit, Tailwind
              CSS v4 tokens, MSW mocked API, and bilingual English & Hindi i18n.
            </p>
          </div>

          {/* Quick Stats Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 shrink-0">
            <div className="rounded-xl border border-border bg-muted-surface/40 p-3 text-center">
              <div className="text-xl font-bold text-foreground">7</div>
              <div className="text-[11px] text-muted font-medium">Sections</div>
            </div>
            <div className="rounded-xl border border-border bg-muted-surface/40 p-3 text-center">
              <div className="text-xl font-bold text-success flex items-center justify-center gap-1">
                <CheckCircle2 className="h-4 w-4" />5 Live
              </div>
              <div className="text-[11px] text-muted font-medium">A, B, C, D, F</div>
            </div>
            <div className="rounded-xl border border-border bg-muted-surface/40 p-3 text-center">
              <div className="text-xl font-bold text-primary flex items-center justify-center gap-1">
                <ShieldCheck className="h-4 w-4" />
                401
              </div>
              <div className="text-[11px] text-muted font-medium">Auto-Refresh</div>
            </div>
            <div className="rounded-xl border border-border bg-muted-surface/40 p-3 text-center">
              <div className="text-xl font-bold text-foreground flex items-center justify-center gap-1">
                <Palette className="h-4 w-4" />8
              </div>
              <div className="text-[11px] text-muted font-medium">Theme Presets</div>
            </div>
          </div>
        </div>
      </div>

      {/* Showcase Sections A–G */}
      <div className="space-y-6">
        {/* Section A: Forms (Live) */}
        <SectionA />

        {/* Section B: Data Table (Phase 4 / next phase) */}
        <SectionB />

        {/* Section C: Overlays & Feedback (Live) */}
        <SectionC />

        {/* Section D: Navigation (Live) */}
        <SectionD />

        {/* Section E: Data Display & Charts (Upcoming) */}
        <PlaceholderSection
          id="section-e"
          letter="E"
          title="Data Display & Charts"
          description="Theme-aware Recharts (line, bar, donut, radar), stat cards, activity timelines, and kanban."
          icon={BarChart3}
          phase="Phase 5"
        />

        {/* Section F: Redux & API (Live) */}
        <SectionF />

        {/* Section G: Utilities (Upcoming) */}
        <PlaceholderSection
          id="section-g"
          letter="G"
          title="Utilities"
          description="Clipboard helpers, debounce/throttle runners, error boundaries, and optimistic updates."
          icon={Wrench}
          phase="Phase 5"
        />
      </div>
    </div>
  );
}
