'use client';

import { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  IconButton,
  Paper,
} from "@mui/material";
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import Link from "next/link";
import { signIn } from 'next-auth/react';
import { useAppSelector, useAppDispatch } from '../../redux/store';
import { loginFailure, loginRequest, loginSuccess } from "../../redux/slices/authSlice";
import { setMode } from "../../redux/slices/themeSlice";
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from "@/app/components/dashboard/LanguageSwitcher";
import useLocalizedNavigation from "@/app/hooks/useLocalizedNavigation";

export default function AuthPageClient() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isLoading } = useAppSelector(state => state.auth);
  const mode = useAppSelector(state => state.theme.mode);
  const dispatch = useAppDispatch();
  const { push } = useLocalizedNavigation();

  const handleLogin = async () => {
    dispatch(loginRequest());
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || t('auth.loginError'));

      dispatch(loginSuccess(data));

      push('/dashboard');
    } catch (error: any) {
      dispatch(loginFailure(error.message));
    }
  };

  const handleGoogleLogin = async () => {
    dispatch(loginRequest());
    await signIn("google", { callbackUrl: "/auth/oauth-redirect" });
  };

  const handleToggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    dispatch(setMode(newMode));
    Cookies.set('themeMode', newMode, { path: '/' });
  };

  return (
    <Box
      sx={{
        pt: 4,
        px: 1,
        minHeight: '100vh',
        bgcolor: theme => theme.palette.background.default,
        color: theme => theme.palette.text.primary,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100vw'
      }}
    >
      {isLoading && (
        <Box
          sx={(theme) => ({
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            bgcolor:
              theme.palette.mode === 'light'
                ? 'rgba(255, 255, 255, 0.5)'
                : 'rgba(0, 0, 0, 0.5)',
            zIndex: 1300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          })}
        >
          <CircularProgress size={60} color="info" />
        </Box>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 6, gap: 3 }}>
        <Box>
          <IconButton onClick={handleToggleTheme} sx={{ color: 'text.primary' }}>
            {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
        </Box>
        <LanguageSwitcher />
      </Box>

      <Paper
        elevation={3}
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          bgcolor: theme => theme.palette.background.paper,
          color: theme => theme.palette.text.primary,
          border: theme => `1px solid ${theme.palette.divider}`,
          width: '100%',
          maxWidth: "sm"
        }}
      >
        <Typography variant="h4" gutterBottom>
          {t('auth.title')}
        </Typography>

        <TextField
          label={t('auth.email')}
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          label={t('auth.password')}
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleLogin}
        >
          {t('auth.login')}
        </Button>

        <Button
          variant="contained"
          color="secondary"
          fullWidth
          sx={{ mt: 1 }}
          onClick={handleGoogleLogin}
        >
          {t('auth.loginGoogle')}
        </Button>

        <Button
          component={Link}
          href="/register"
          variant="text"
          fullWidth
          sx={{ mt: 1 }}
        >
          {t('auth.register')}
        </Button>
      </Paper>
    </Box>
  );
}
