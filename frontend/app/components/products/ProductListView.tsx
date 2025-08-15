'use client';

import React from 'react';
import styles from '../../styles/dashboard/products/products.module.css';
import {
  Box,
  Typography,
  Alert,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import ProductItem from '@/app/components/products/ProductItem';
import ProductItemSkeleton from '@/app/components/skeletons/ProductItemSkeleton';
import { useTranslation } from 'react-i18next';

interface ProductListViewProps {
  products: any[];
  isLoading: boolean;
  error: string | null;
  totalProducts: number;
  currentType: string;
  productTypes: string[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onTypeChange: (type: string) => void;
}

export default function ProductListView({
  products,
  isLoading,
  error,
  totalProducts,
  currentType,
  productTypes,
  currentPage,
  totalPages,
  onPageChange,
  onTypeChange,
}: ProductListViewProps) {
  const { t } = useTranslation();

  if (error) {
    return (
      <Box mt={4}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box className={styles.products}>
        <Typography variant="h5" align="left" className={styles['products-skeleton__title']}>
          {t('product.loading')}
        </Typography>
        <Box className={styles.products__list}>
          {Array.from({ length: 10 }).map((_, idx) => (
            <Box key={`skeleton-${idx}`} className={styles.products__item}>
              <ProductItemSkeleton />
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

  return (
    <Box className={styles.products}>
      <Box className={styles['products__top-controls']}>
        <Typography variant="h5" align="left" className={styles.products__title}>
          {t('product.products_with_count', { count: totalProducts })}
        </Typography>
        <FormControl fullWidth sx={{ maxWidth: 200 }} className={styles['products__type-select']}>
          <InputLabel id="type-select-label">{t('product.type_label')}</InputLabel>
          <Select
            labelId="type-select-label"
            value={currentType}
            label={t('product.type_label')}
            onChange={(e: SelectChangeEvent<string>) => onTypeChange(e.target.value)}
          >
            <MenuItem value="all">{t('product.type_all')}</MenuItem>
            {productTypes
              .filter(type => type !== 'all')
              .map(type => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Box>

      <Box className={styles.products__list}>
        {products.map(product => (
          <Box key={product.id} className={styles.products__item}>
            <ProductItem {...product} />
          </Box>
        ))}
      </Box>

      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(_e, value) => onPageChange(value)}
          color="primary"
          shape="rounded"
        />
      </Box>
    </Box>
  );
}