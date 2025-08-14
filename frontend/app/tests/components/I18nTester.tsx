'use client';

import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

export default function I18nTester() {
  const { t, i18n, ready } = useTranslation('common');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !ready) {
    return <p>Loading translations…</p>;
  }

  return (
    <div style={{ padding: 20, border: '1px solid #ccc' }}>
      <p><strong>Текущий язык:</strong> {i18n.language}</p>
      <p><strong>Перевод ключа menu.home:</strong> {t('menu.home')}</p>
      <button onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'ua' : 'en')}>
        Переключить язык
      </button>
    </div>
  );
}