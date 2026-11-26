import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/app/hooks';

/** Keeps i18next and the document direction in sync with the persisted locale setting. */
export function useAppLanguage(): void {
  const language = useAppSelector((s) => s.settings.value.locale.language);
  const direction = useAppSelector((s) => s.settings.value.locale.direction);
  const { i18n } = useTranslation();

  useEffect(() => {
    if (i18n.language !== language) void i18n.changeLanguage(language);
  }, [language, i18n]);

  useEffect(() => {
    document.documentElement.dir = direction;
  }, [direction]);
}
