'use client';

import React, { useState } from 'react';
import { Box, Button, CircularProgress, Typography } from '@mui/material';

interface FallbackChameleonProps {
  width?: string | number;
  height?: string | number;
  onRetry: () => void | Promise<unknown>;
  isLoading?: boolean;
}

const FallbackChameleon: React.FC<FallbackChameleonProps> = ({
  width = '100%',
  height = '100%',
  onRetry,
  isLoading = false
}) => {
  const [loading, setLoading] = useState(isLoading);

  const handleRetry = async () => {
    setLoading(true);
    try {
      await onRetry();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width,
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px dashed gray',
        borderRadius: 2,
        flexDirection: 'column',
        gap: 2,
      }}
    >
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Typography variant="body2" color="text.secondary">
            Something went wrong
          </Typography>
          <Button variant="outlined" onClick={handleRetry}>
            Retry
          </Button>
        </>
      )}
    </Box>
  );
};

export default FallbackChameleon;