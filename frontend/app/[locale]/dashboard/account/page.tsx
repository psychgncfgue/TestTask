'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Divider,
  Switch,
  Typography,
  IconButton,
  Stack,
  Button,
  CircularProgress,
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import styles from '../../../styles/account/account.client.module.css'
import { useTheme } from '@mui/material/styles';
import useUser from '@/app/hooks/useUser';
import AccountSkeleton from '@/app/components/skeletons/AccountSkeleton';
import ChangePasswordDialog from '@/app/components/account/ChangePasswordDialog';
import { AppDispatch, RootState, useAppSelector } from '@/app/redux/store';
import { useDispatch } from 'react-redux';
import HoverAvatar from '@/app/components/account/HoverAvatar';
import { useTranslation } from 'react-i18next';
import useLocalizedNavigation from '@/app/hooks/useLocalizedNavigation';
import { logoutUser } from '@/app/redux/thunks/authThunks';

export default function AccountClient() {
  const { push, back } = useLocalizedNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isLoading, isError, mutate } = useUser();
  const logoutLoading = useAppSelector((state: RootState) => state.auth.isLoading);
  const theme = useTheme();
  const { t } = useTranslation();
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);

  useEffect(() => {
    if (isError) {
      push('/auth');
    }
  }, [isError, push]);

  const handleToggle2FA = () => {
    setIs2FAEnabled((prev) => !prev);
  };

  const handleOpenPasswordDialog = () => {
    setOpenPasswordDialog(true);
  };

  const handleClosePasswordDialog = () => {
    setOpenPasswordDialog(false);
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    push("/auth");
  };

  return (
    <Box
      className={styles.account}
      sx={{
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
      <Box
        className={styles['account__container']}
        sx={{
          bgcolor: theme.palette.background.paper,
          color: theme.palette.text.primary,
        }}
      >
        {isLoading ? (
          <AccountSkeleton />
        ) : (
          <>
            <Box className={styles['account__header']}>
              <IconButton
                onClick={() => back()}
                sx={{ color: theme.palette.text.primary }}
              >
                <ArrowBackIosNewIcon />
              </IconButton>
              <Typography
                variant="h4"
                component="h1"
                className={styles['account__title']}
              >
                {t('account.title')}
              </Typography>
            </Box>

            <Box className={styles['account__avatar-section']}>
              <HoverAvatar
                src={user?.avatarUrl}
                onUploadSuccess={(newUrl) => {
                  mutate({ user: { ...user!, avatarUrl: newUrl } }, false);
                }}
              >
                {!user?.avatarUrl && user?.username?.[0]?.toUpperCase()}
              </HoverAvatar>
              <Box className={styles['account__user-info']}>
                <Typography variant="h6">
                  {user?.username || t('account.placeholder_username')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user?.email || t('account.placeholder_email')}
                </Typography>
              </Box>
            </Box>

            <Divider
              className={styles['account__divider']}
              sx={{ bgcolor: theme.palette.divider }}
            />

            <Stack spacing={2}>
              <Box className={styles['account__twofa']}>
                <Typography>{t('account.2fa')}</Typography>
                <Switch checked={is2FAEnabled} onChange={handleToggle2FA} />
              </Box>

              <Button
                variant="outlined"
                onClick={handleOpenPasswordDialog}
                className={styles['account__button']}
                sx={{
                  color: theme.palette.text.primary,
                  borderColor: theme.palette.divider,
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                {t('change.password')}
              </Button>

              <Button
                variant="outlined"
                onClick={handleLogout}
                className={styles['account__button']}
                sx={{
                  color: theme.palette.text.primary,
                  borderColor: theme.palette.divider,
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                {t('logout')}
              </Button>
            </Stack>

            {openPasswordDialog && (
              <ChangePasswordDialog open onClose={handleClosePasswordDialog} />
            )}
          </>
        )}
      </Box>

      {logoutLoading && (
        <Box className={styles['account__loading-overlay']}>
          <CircularProgress size={60} color="info" />
        </Box>
      )}
    </Box>
  );
}