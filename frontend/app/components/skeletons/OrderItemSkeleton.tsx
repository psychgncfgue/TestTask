'use client';

import React from 'react';
import styles from '../../styles/dashboard/orders/order.item.skeleton.module.css';
import { Card, CardContent, Stack, Typography, Divider, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

export default function OrderItemSkeleton() {
  return (
    <Card className={styles['order-item']}>
      <CardContent className={styles['order-item__content']}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={4}
          className={styles['order-item__row']}
        >
          <Typography
            variant="subtitle1"
            fontWeight={600}
            className={`${styles['order-item__title']} ${styles['skeleton-block']}`}
            style={{ width: 100, height: 24, borderRadius: 4 }}
          >
            &nbsp;
          </Typography>

          <Box className={`${styles['order-item__menu-sidebar']} ${styles['skeleton-block']}`} style={{ width: 36, height: 36 }}>
            <MenuIcon style={{ visibility: 'hidden' }} />
          </Box>
          <Box className={`${styles['order-item__menu-modal']} ${styles['skeleton-block']}`} style={{ width: 36, height: 36 }}>
            <MenuIcon style={{ visibility: 'hidden' }} />
          </Box>

          <Box className={styles['order-item__products']}>
            <Box className={styles['order-item__products-count']}>
              <ShoppingCartIcon fontSize="small" color="action" style={{ visibility: 'hidden' }} />
              <Typography className={styles['skeleton-block']} style={{ width: 20, height: 20, borderRadius: 4 }}>
                &nbsp;
              </Typography>
            </Box>
            <Typography className={styles['skeleton-block']} style={{ width: 40, height: 16, borderRadius: 4 }}>
              &nbsp;
            </Typography>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            className={`${styles['order-item__date']} ${styles['skeleton-block']}`}
            style={{ width: 80, height: 16, borderRadius: 4 }}
          >
            &nbsp;
          </Typography>

          <Box className={styles['order-item__prices']}>
            <Typography
              variant="subtitle2"
              fontWeight={600}
              className={styles['skeleton-block']}
              style={{ width: 40, height: 20, borderRadius: 4 }}
            >
              &nbsp;
            </Typography>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              className={styles['skeleton-block']}
              style={{ width: 50, height: 24, borderRadius: 4 }}
            >
              &nbsp;
            </Typography>
          </Box>

          <Box className={`${styles['order-item__delete']} ${styles['skeleton-block']}`} style={{ width: 24, height: 24, borderRadius: 12 }} />
        </Stack>
      </CardContent>
      <Divider />
    </Card>
  );
}