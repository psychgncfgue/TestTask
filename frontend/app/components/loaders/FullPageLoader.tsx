'use client';

import React from 'react';
import { Box, CircularProgress } from '@mui/material';

export default function FullPageLoader() {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        bgcolor: 'rgba(155, 150, 150, 0.24)',
        zIndex: 1300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CircularProgress color="inherit" />
    </Box>
  );
}