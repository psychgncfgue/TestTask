'use client';

import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  TextField,
  Stack,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useAppDispatch, useAppSelector } from '@/app/redux/store';
import {
  changePasswordFailure,
  changePasswordRequest,
  changePasswordSuccess,
  confirmCodeFailure,
  confirmCodeRequest,
  confirmCodeSuccess,
} from '@/app/redux/slices/authSlice';
import { fetcherWithCheck } from '@/app/utils/fetcherWithCheck';
import { useTranslation } from 'react-i18next';

interface ChangePasswordDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function ChangePasswordDialog({ open, onClose }: ChangePasswordDialogProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);

  const [step, setStep] = useState<'send' | 'confirm'>('send');
  const [isSuccess, setIsSuccess] = useState(false);

  const [codeDigits, setCodeDigits] = useState<string[]>(['', '', '', '', '', '']);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const resetAll = () => {
    setStep('send');
    setCodeDigits(['', '', '', '', '', '']);
    setNewPassword('');
    setConfirmPassword('');
    onClose();
  };

  const handleSendEmail = async () => {
    dispatch(changePasswordRequest());
    try {
      const res = await fetcherWithCheck('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      dispatch(changePasswordSuccess(res.data));
      setStep('confirm');
      setTimeout(() => inputsRef.current[0]?.focus(), 100);
    } catch (err: any) {
      dispatch(changePasswordFailure({ status: err.status, message: err.message }));
    }
  };

  const handleConfirmAndReset = async () => {
    if (newPassword !== confirmPassword) {
      dispatch(confirmCodeFailure({ status: 400, message: t('account.passwords_not_match') }));
      return;
    }
    const fullCode = codeDigits.join('');
    dispatch(confirmCodeRequest());
    try {
      const res = await fetcherWithCheck('/api/auth/change-password-confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: { code: fullCode, newPassword },
      });
      dispatch(confirmCodeSuccess(res.data));
      setIsSuccess(true);
      setTimeout(resetAll, 2000);
    } catch (err: any) {
      dispatch(confirmCodeFailure({ status: err.status, message: err.message }));
    }
  };

  const handleCodeChange = (idx: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const arr = [...codeDigits];
    arr[idx] = val;
    setCodeDigits(arr);
    if (val && idx < 5) inputsRef.current[idx + 1]?.focus();
  };

  if (isSuccess) {
    return (
      <Dialog open={open}>
        <Box
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <CircularProgress size={60} color="success" />
          <CheckCircleIcon sx={{ fontSize: 48, color: 'success.main' }} />
          <Typography>{t('account.password_changed_successfully')}</Typography>
        </Box>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={resetAll}>
      {isLoading && (
        <Box
          sx={(theme) => ({
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            bgcolor:
              theme.palette.mode === 'light' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
            zIndex: 1300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          })}
        >
          <CircularProgress size={60} color="info" />
        </Box>
      )}

      {step === 'send' ? (
        <>
          <DialogTitle>{t('account.password_change')}</DialogTitle>
          <DialogContent>
            <Typography>{t('account.password_change_confirm')}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={resetAll}>{t('common.cancel')}</Button>
            <Button onClick={handleSendEmail} autoFocus>
              {t('account.send_email_message')}
            </Button>
          </DialogActions>
        </>
      ) : (
        <>
          <DialogTitle>{t('account.password_confirm_and_set')}</DialogTitle>
          <DialogContent>
            <Typography sx={{ mb: 2 }}>{t('account.enter_code_and_new_password')}</Typography>
            <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 3 }}>
              {codeDigits.map((d, i) => (
                <TextField
                  key={i}
                  inputRef={(el) => (inputsRef.current[i] = el)}
                  value={d}
                  onChange={(e) => handleCodeChange(i, e.target.value)}
                  inputProps={{
                    maxLength: 1,
                    style: { textAlign: 'center', fontSize: '1.5rem' },
                  }}
                  sx={{ width: 40 }}
                />
              ))}
            </Stack>
            <Stack spacing={2}>
              <TextField
                fullWidth
                type="password"
                label={t('account.new_password')}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <TextField
                fullWidth
                type="password"
                label={t('account.password.confirm')}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={resetAll}>{t('common.cancel')}</Button>
            <Button
              onClick={handleConfirmAndReset}
              disabled={
                codeDigits.some((d) => d === '') || !newPassword || newPassword !== confirmPassword
              }
              autoFocus
            >
              {t('account.password.save')}
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}