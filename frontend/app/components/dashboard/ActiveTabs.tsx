import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import styles from '../../styles/dashboard/top-menu/active.tabs.module.css';
import { useSocket } from '@/app/hooks/useSocket';


export default function ActiveTabs() {
  const activeTabs = useSocket();
  return (
    <Paper className={styles['active-tabs']}>
      <Box className={styles['active-tabs__content']}>
        <Typography variant="h6" component="div" noWrap className={styles['active-tabs__title']}>
          Активные вкладки
        </Typography>
        <Typography
          variant="h4"
          component="div"
          className={styles['active-tabs__count']}
        >
          {activeTabs}
        </Typography>
      </Box>
    </Paper>
  );
}