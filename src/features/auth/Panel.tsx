import { Palette, Table2, Zap, Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function Panel() {
  const { t } = useTranslation();
  const highlights = [
    { icon: Palette, label: t('app.title') },
    { icon: Table2, label: 'DataTable' },
    { icon: Zap, label: 'Redux + RTK' },
    { icon: Languages, label: 'EN / HI' },
  ];
  return (
    <div className="relative hidden flex-col justify-between bg-primary p-10 text-primary-fg lg:flex">
      <div className="text-lg font-semibold">{t('app.title')}</div>
      <div>
        <h2 className="max-w-sm text-3xl font-bold leading-tight">{t('login.brandTitle')}</h2>
        <p className="mt-3 max-w-sm text-sm opacity-80">{t('login.brandBody')}</p>
        <div className="mt-8 grid grid-cols-2 gap-3">
          {highlights.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 rounded-lg bg-black/10 px-3 py-2 text-sm"
            >
              <Icon className="h-4 w-4" aria-hidden />
              {label}
            </div>
          ))}
        </div>
      </div>
      <div className="text-xs opacity-70">© 2026 Feature Showcase</div>
    </div>
  );
}
