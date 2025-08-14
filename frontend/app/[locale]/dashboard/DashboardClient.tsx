'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  CssBaseline,
  Divider,
  Drawer,
  Toolbar,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { usePathname } from 'next/navigation';
import useUser from '../../hooks/useUser';
import NavigationMenu from '../../components/dashboard/NavigationMenu';
import useLocalizedNavigation from '@/app/hooks/useLocalizedNavigation';
import TopMenu from '@/app/components/dashboard/TopMenu';
import FullPageLoader from '@/app/components/loaders/FullPageLoader';

interface DashboardClientProps {
  children: React.ReactNode;
}

export default function DashboardClient({ children }: DashboardClientProps) {
  const { isLoading, isError } = useUser();
  const theme = useTheme();
  const pathname = usePathname();
  const { push, back } = useLocalizedNavigation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerWidth = 150;


  useEffect(() => {
    if (isError) {
      push('/auth');
    }
  }, [isError, push]);


  const handleRouteMenu = (targetPath: string) => {
    push(targetPath);
  };

  return (
    <Box sx={{ display: 'flex', backgroundColor: theme.palette.background.default }}>
      <CssBaseline />

      {isLoading && <FullPageLoader />}

      <TopMenu onDrawerOpen={() => setDrawerOpen(true)} />

      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            height: '100vh',
          },
        }}
      >
        <Box sx={{ width: drawerWidth }} onClick={() => setDrawerOpen(false)}>
          <Toolbar />
          <Divider />
          <NavigationMenu
            pathname={pathname}
            onNavigate={handleRouteMenu}
          />
        </Box>
      </Drawer>

      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Divider />
        <NavigationMenu
          pathname={pathname}
          onNavigate={handleRouteMenu}
        />
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: { xs: 0, sm: `${drawerWidth}px` },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}