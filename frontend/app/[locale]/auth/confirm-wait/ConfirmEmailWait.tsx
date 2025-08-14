"use client";

import { useAppSelector } from "../../../redux/store";
import { Box, Typography, Paper } from "@mui/material";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export default function ConfirmEmailWaitComponent() {
  const message = useAppSelector(state => state.auth.message);
  const displayMessage = message || "Сообщение о подтверждении аккаунта отправлено на указанный email";

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f7f9fc' }}>
      <Paper
        elevation={4}
        sx={{
          maxWidth: 500,
          p: 4,
          borderRadius: 4,
          border: '1px solid #d0d7de',
          bgcolor: '#ffffff',
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        }}
      >
        <CheckCircleOutlineIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Подтверждение отправлено
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {displayMessage}
        </Typography>
      </Paper>
    </Box>
  );
}