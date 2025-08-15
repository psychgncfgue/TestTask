'use client';

import React from 'react';
import { Card, CardContent, Box } from '@mui/material';
import styles from '../../styles/dashboard/products/product.item.skeleton.module.css';

export default function ProductItemSkeleton() {
  return (
    <Card className={styles['product-item']}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box className={styles['status-indicator']} />
        <Box className={styles['product-item__media']} />
      </Box>

      <CardContent className={styles['product-item__content']}>
        <Box className={styles['title']} />
        <Box className={styles['status']} />
        <Box className={styles['guarantee']} />
        <Box className={styles['specification']} />
        <Box className={styles['price-box']}>
          <Box className={styles['price']} />
          <Box className={styles['price-usd']} />
        </Box>
        <Box className={styles['date']} />
      </CardContent>

      <Box className={styles['product-item__menu-button']} />
    </Card>
  );
}