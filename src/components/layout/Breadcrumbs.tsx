import { useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ChevronRight } from 'lucide-react';
import { useAppSelector } from '@/app/hooks';

const LABELS: Record<string, string> = {
  '/app': 'nav.showcase',
};

export function Breadcrumbs() {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const enabled = useAppSelector((s) => s.settings.value.layout.breadcrumbs);
  if (!enabled) return null;

  const parts = pathname.split('/').filter(Boolean);
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-muted">
      {parts.map((part, i) => {
        const to = '/' + parts.slice(0, i + 1).join('/');
        const isLast = i === parts.length - 1;
        return (
          <span key={to} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="h-3 w-3" aria-hidden />}
            <span
              aria-current={isLast ? 'page' : undefined}
              className={isLast ? 'font-medium text-foreground' : ''}
            >
              {t(LABELS[to] ?? part)}
            </span>
          </span>
        );
      })}
    </nav>
  );
}
