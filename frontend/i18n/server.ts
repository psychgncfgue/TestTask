import { createInstance } from 'i18next';
import Backend from 'i18next-fs-backend';
import path from 'path';

export async function initServerI18n(locale: string, namespaces = ['common']) {
  const i18nInstance = createInstance();

  await i18nInstance
    .use(Backend)
    .init({
      lng: locale,
      fallbackLng: 'en',
      ns: namespaces,
      defaultNS: 'common',
      backend: {
        loadPath: path.resolve('./public/locales/{{lng}}/{{ns}}.json'),
      },
      interpolation: {
        escapeValue: false,
      },
    });

  return i18nInstance;
}