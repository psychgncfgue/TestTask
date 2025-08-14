'use client';

import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { mutate } from 'swr';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function OAuthRedirect() {
  const { data: session } = useSession();
  const { t } = useTranslation();
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    if (!session) return;
    const payload = (session as any).oauthPayload;
    if (!payload) return;

    axios
      .post('/api/auth/login-google', payload, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      })
      .then((res) => {
        if (res.data.success) {
          mutate('/api/auth/me', { user: res.data.data }, false);
          router.replace('/dashboard');
        } else {
          router.replace('/auth');
        }
      })
      .catch(() => {
        router.replace('/auth');
      });
  }, [session, router]);

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.primary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          bgcolor:
            theme.palette.mode === 'light'
              ? 'rgba(255,255,255,0.6)'
              : 'rgba(0,0,0,0.6)',
          zIndex: 1,
        }}
      />
      <Paper
        elevation={4}
        sx={{
          position: 'relative',
          zIndex: 2,
          p: 4,
          maxWidth: 400,
          width: '100%',
          textAlign: 'center',
          bgcolor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="h5" gutterBottom>
          {t('auth.oauth_redirect_title')}
        </Typography>
        <Box sx={{ my: 3 }}>
          <CircularProgress size={48} color="primary" />
        </Box>
        <Typography variant="body2" color="text.secondary">
          {t('auth.oauth_redirect_message')}
        </Typography>
      </Paper>
    </Box>
  );
}