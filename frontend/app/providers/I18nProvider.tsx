'use client';

import { I18nextProvider } from 'react-i18next';
import { useEffect, useState } from 'react';
import i18n from '@/i18n/client';

export default function I18nProvider({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    i18n.changeLanguage(locale).then(() => setReady(true));
  }, [locale]);

  if (!ready) return null;

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}