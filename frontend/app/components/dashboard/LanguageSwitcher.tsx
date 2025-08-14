import React from 'react';
import LanguageIcon from '@mui/icons-material/Language';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import { useTranslation } from 'react-i18next';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { locales, localeLabels } from '@/app/constants/locales';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const currentLocale = i18n.language;

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const changeLocaleInPath = (path: string, newLocale: string) => {
    return path.replace(/^\/(en|uk|ru)/, `/${newLocale}`);
  };

  const handleSelectLocale = (locale: string) => {
    if (locale === currentLocale) {
      handleClose();
      return;
    }

    i18n.changeLanguage(locale);
    Cookies.set('NEXT_LOCALE', locale, { path: '/' });
    const newPath = changeLocaleInPath(pathname, locale);

    router.push(newPath);
    handleClose();
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleOpen}>
        <LanguageIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {locales.map((code) => (
          <MenuItem
            key={code}
            disabled={code === currentLocale}
            onClick={() => handleSelectLocale(code)}
            sx={code === currentLocale ? { opacity: 0.5, pointerEvents: 'none' } : undefined}
          >
            {localeLabels[code]}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}