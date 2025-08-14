'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import PhoneInput, { CountryData } from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  IconButton,
  Paper,
  Container,
  useTheme,
  FormControl,
} from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import {
  registerRequest,
  registerSuccess,
  registerFailure,
} from '../../redux/slices/authSlice';
import { setMode } from '../../redux/slices/themeSlice';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/app/components/dashboard/LanguageSwitcher';

const phonePatterns: Record<string, RegExp> = {
  us: /^\d{10}$/,
  ru: /^\d{10}$/,  
  de: /^\d{11}$/,  
  in: /^\d{10}$/, 
  ua: /^\d{12}$/,   
};

const schema = yup.object({
  email: yup.string().email('Неверный email').required('Email обязателен'),
  username: yup
    .string()
    .matches(/^[a-zA-Z0-9]{3,20}$/, '3–20 латинских букв или цифр')
    .required('Username обязателен'),
  password: yup.string().min(6, 'Не менее 6 символов').required('Пароль обязателен'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Пароли не совпадают')
    .required('Подтвердите пароль'),
  country: yup.string().required(),
  phone: yup
    .string()
    .required('Телефон обязателен')
    .test('valid-phone', 'Неверный номер телефона', function (val) {
      const country: string = this.parent.country;
      return phonePatterns[country]?.test(val || '');
    }),
});

type FormData = yup.InferType<typeof schema>;

export default function RegisterForm() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector(s => s.auth);
  const mode = useAppSelector(s => s.theme.mode);
  const router = useRouter();
  const theme = useTheme();

  const {
    control,
    watch,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      country: 'us',
      phone: '',
    },
  });

  const selectedCountry = watch('country');

  const onSubmit = async (data: FormData) => {
    dispatch(registerRequest());
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, provider: 'local' }),
      });
      const result = await res.json();

      if (!res.ok) {
        setError('email', { message: result.message || t('register.networkError') });
        dispatch(registerFailure(result.message));
      } else {
        dispatch(registerSuccess(result.message));
        router.push('/auth/confirm-wait');
      }
    } catch (err: any) {
      setError('email', { message: t('register.networkError') });
      dispatch(registerFailure(err.message));
    }
  };

  const handleToggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    dispatch(setMode(newMode));
    Cookies.set('themeMode', newMode, { path: '/' });
  };

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={t => ({
        minHeight: '100vh',
        bgcolor: t.palette.background.default,
        color: t.palette.text.primary,
        p: 4,
      })}
    >
      {isLoading && (
        <Box
          sx={t => ({
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            bgcolor: t.palette.mode === 'light' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1300,
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
        sx={t => ({
          maxWidth: 500,
          mx: 'auto',
          p: 4,
          bgcolor: t.palette.background.paper,
          color: t.palette.text.primary,
          border: `1px solid ${t.palette.divider}`,
        })}
      >
        <Typography variant="h4" gutterBottom>
          {t('register.title')}
        </Typography>
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('register.email')}
                fullWidth
                margin="normal"
                error={!!errors.email}
                helperText={errors.email?.message || ''}
              />
            )}
          />
          <Controller
            name="username"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('register.username')}
                fullWidth
                margin="normal"
                error={!!errors.username}
                helperText={errors.username?.message || ''}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('register.password')}
                type="password"
                fullWidth
                margin="normal"
                error={!!errors.password}
                helperText={errors.password?.message || ''}
              />
            )}
          />
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('register.confirmPassword')}
                type="password"
                fullWidth
                margin="normal"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message || ''}
              />
            )}
          />
          <Controller name="country" control={control} render={({ field }) => <input type="hidden" {...field} />} />
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth margin="normal">
                <Typography variant="subtitle2" sx={{ mb: 1, color: theme.palette.text.primary }}>
                  {t('register.phone')}
                </Typography>
                <PhoneInput
                  country={selectedCountry}
                  value={field.value || ''}
                  specialLabel=""
                  onChange={(value, data) => {
                    const d = data as CountryData;
                    field.onChange(value);
                    setValue('country', d.countryCode);
                  }}
                  placeholder=""
                  containerStyle={{ width: '100%' }}
                  inputStyle={{
                    width: '100%',
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 4,
                  }}
                  buttonStyle={{
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                  dropdownClass="my-phone-dropdown"
                  dropdownStyle={{
                    position: 'absolute',
                    top: 'auto',
                    bottom: '100%',
                    left: 0,
                    marginBottom: 4,
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    border: `1px solid ${theme.palette.divider}`,
                    maxHeight: 200,
                    overflowY: 'auto',
                    zIndex: 1400,
                  }}
                />
                {errors.phone && (
                  <Typography color="error" variant="caption" sx={{ mt: 0.5 }}>
                    {errors.phone.message || t('register.invalidPhone')}
                  </Typography>
                )}
              </FormControl>
            )}
          />

          <Button variant="contained" color="primary" fullWidth type="submit" sx={{ mt: 2 }}>
            {t('register.registerButton')}
          </Button>

          <Button component={Link} href="/auth" variant="text" color="secondary" fullWidth sx={{ mt: 1 }}>
            {t('register.alreadyHaveAccount')}
          </Button>
        </form>
      </Paper>
    </Container>
  );
}