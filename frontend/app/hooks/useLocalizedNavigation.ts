'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { locales } from '@/app/constants/locales';

export default function useLocalizedNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { i18n } = useTranslation();

  const localePrefixRegex = new RegExp(`^/(${locales.join('|')})`);

  const getKeyFromPath = (path: string) => {
    const cleanPath = path.replace(localePrefixRegex, '');
    return `scrollY:${cleanPath || '/'}`;
  };

  const saveScrollPosition = (path: string) => {
    const key = getKeyFromPath(path);
    sessionStorage.setItem(key, window.scrollY.toString());
  };

  const stripLocale = (path: string) => path.replace(localePrefixRegex, '');

  const push = (targetPath: string) => {
    saveScrollPosition(pathname);
    sessionStorage.setItem('prevPath', stripLocale(pathname));
    router.push(targetPath);
  };

  const back = () => {
    const prevPath = sessionStorage.getItem('prevPath');
    const currentLocale = i18n.language;

    if (prevPath) {
      const localizedPath = `/${currentLocale}${prevPath}`;
      router.push(localizedPath);
    } else {
      router.back();
    }
  };

  const getScrollPositionForCurrentPath = () => {
    const key = getKeyFromPath(pathname);
    const value = sessionStorage.getItem(key);
    return value ? parseInt(value, 10) : 0;
  };

  return {
    push,
    back,
    getScrollPositionForCurrentPath,
  };
}