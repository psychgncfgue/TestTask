'use client';

import {
    AppBar,
    Box,
    IconButton,
    Toolbar,
    Typography,
} from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';
import styles from '../../styles/dashboard/top-menu/top.menu.module.css'
import Cookies from 'js-cookie';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { setMode } from '../../redux/slices/themeSlice';
import LanguageSwitcher from './LanguageSwitcher';
import Clock from './Clock';
import ActiveTabs from './ActiveTabs';

interface TopMenuProps {
    onDrawerOpen: () => void;
}

export default function TopMenu({ onDrawerOpen}: TopMenuProps) {
    const mode = useAppSelector((s) => s.theme.mode);
    const dispatch = useAppDispatch();
    const theme = useTheme();

    const handleToggleTheme = () => {
        const newMode = mode === 'light' ? 'dark' : 'light';
        dispatch(setMode(newMode));
        Cookies.set('themeMode', newMode, { path: '/' });
    };

    return (
<AppBar
  position="fixed"
  className={styles['top-menu']}
  style={{ zIndex: theme.zIndex.drawer + 1 }}
  sx={{
    bgcolor: mode === 'light' ? '#fff' : undefined,
    boxShadow:
      mode === 'light'
        ? '0 4px 12px rgba(0, 0, 0, 0.2)'
        : undefined,
    color: mode === 'light' ? 'text.primary' : undefined,
  }}
>
  <Toolbar className={styles['top-menu__toolbar']}>
    <Box className={styles['top-menu__left']}>
      <IconButton
        color="inherit"
        edge="start"
        onClick={onDrawerOpen}
        className={styles['top-menu__menu-button']}
      >
        <MenuIcon />
      </IconButton>
      <Typography variant="h6" noWrap>
        Our Logo
      </Typography>
    </Box>

    <Box className={styles['top-menu__center']}>
      <Clock />
        <Box className={styles['top-menu__backend']}>
          <ActiveTabs/>
        </Box>
    </Box>

    <Box className={styles['top-menu__right']}>
      <LanguageSwitcher />
      <IconButton color="inherit" onClick={handleToggleTheme}>
        {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
      </IconButton>
    </Box>
  </Toolbar>
</AppBar>
    );
}
