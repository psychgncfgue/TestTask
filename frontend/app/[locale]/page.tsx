'use client';

import { Box, Button, Typography } from '@mui/material';
import useLocalizedNavigation from '@/app/hooks/useLocalizedNavigation';

export default function Page() {
  const { push } = useLocalizedNavigation();

  const handleGetStarted = () => {
    push('/auth');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        bgcolor: 'background.default',
        p: 3,
      }}
    >
      <Typography variant="h2" gutterBottom>
        Welcome!
      </Typography>
      <Typography variant="h5" gutterBottom>
        Start your journey with our app
      </Typography>
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={handleGetStarted}
        sx={{ mt: 4 }}
      >
        Get Started
      </Button>
    </Box>
  );
}