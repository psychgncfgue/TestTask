import { Theme } from '@mui/material/styles';

export const setScrollbarColors = (theme: Theme) => {
  const root = document.documentElement;
  root.style.setProperty('--scrollbar-track-color', theme.palette.background.paper);
  root.style.setProperty('--scrollbar-thumb-color', theme.palette.primary.main);
};