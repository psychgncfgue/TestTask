'use client';

import React, { useState, useMemo, useEffect } from 'react';
import createEmotionCache from './utils/emotionCache';
import { CacheProvider } from '@emotion/react';
import { useServerInsertedHTML } from 'next/navigation';
import { useAppSelector } from './redux/store';
import type { RootState } from './redux/store';
import {
  ThemeProvider,
  CssBaseline,
  createTheme,
  PaletteMode,
} from '@mui/material';
import { setScrollbarColors } from './utils/setScrollbarColors';

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const mode = useAppSelector((state: RootState) => state.theme.mode);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode as PaletteMode,
          primary: { main: '#1976d2' },
          secondary: { main: '#dc004e' },
        },
      }),
    [mode]
  );

  const [{ cache, flush }] = useState(() => {
    const cache = createEmotionCache();
    cache.compat = true;
    const originalInsert = cache.insert;
    let insertedNames: string[] = [];

    cache.insert = (...args) => {
      const serialized = args[1];
      if (cache.inserted[serialized.name] === undefined) {
        insertedNames.push(serialized.name);
      }
      return originalInsert(...args);
    };

    const flushFn = () => {
      const names = insertedNames;
      insertedNames = [];
      return names;
    };

    return { cache, flush: flushFn };
  });

  useServerInsertedHTML(() => {
    const names = flush();
    if (!names.length) return null;
    let styles = '';
    for (const name of names) {
      styles += cache.inserted[name];
    }
    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${names.join(' ')}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  useEffect(() => {
    setScrollbarColors(theme);
  }, [theme]);

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}