import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export function ScrollToTop() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 250);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label={t('common.backToTop')}
      className={cn(
        'fixed bottom-6 end-6 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-foreground shadow-medium transition-all hover:bg-muted-surface hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      )}
    >
      <ArrowUp className="h-4 w-4" aria-hidden />
    </button>
  );
}
