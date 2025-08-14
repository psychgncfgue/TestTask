export const locales = ['en', 'uk', 'ru'];
export const defaultLocale = 'en';
export type Locale = typeof locales[number];

export const WEEKDAY_KEYS = [
  'weekdays.sunday',
  'weekdays.monday',
  'weekdays.tuesday',
  'weekdays.wednesday',
  'weekdays.thursday',
  'weekdays.friday',
  'weekdays.saturday',
] as const;

export const localeLabels: Record<Locale, string> = {
  en: 'English',
  uk: 'Українська',
  ru: 'Русский',
};