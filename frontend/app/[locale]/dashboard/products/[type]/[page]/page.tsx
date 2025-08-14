'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/redux/store';
import { fetchProducts } from '@/app/redux/thunks/productsThunks';
import { setCurrentPage, setCurrentType } from '@/app/redux/slices/productsSlice';
import { useParams } from 'next/navigation';
import useLocalizedNavigation from '@/app/hooks/useLocalizedNavigation';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import ProductListView from '@/app/components/products/ProductListView';


export default function ProductList() {
  const dispatch = useAppDispatch();
  const {
    products,
    isLoading,
    error,
    currentPage,
    totalPages,
    totalProducts,
    currentType,
    productTypes,
  } = useAppSelector(state => state.products);

  const { push } = useLocalizedNavigation();
  const { i18n } = useTranslation();

  const params = useParams() as { type?: string; page?: string };
  const urlType = params.type || 'all';
  const pageNum = Number(params.page) || 1;

  const locale = i18n.language;


  useEffect(() => {
    if (currentType !== urlType) {
      dispatch(setCurrentType(urlType));
    }
    if (currentPage !== pageNum) {
      dispatch(setCurrentPage(pageNum));
    }
    dispatch(fetchProducts({ page: pageNum, type: urlType }));
  }, [dispatch, urlType, pageNum]);

  const handleTypeChange = (newType: string) => {
    if (newType === currentType) return;
    dispatch(setCurrentType(newType));
    dispatch(setCurrentPage(1));
    const newPath = `/${locale}/dashboard/products/${newType}/1`;
    push(newPath);
  };

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
    const newPath = `/${locale}/dashboard/products/${currentType}/${page}`;
    push(newPath);
  };

  return (
    <ProductListView
      products={products}
      isLoading={isLoading}
      error={error}
      totalProducts={totalProducts}
      currentType={currentType}
      productTypes={productTypes}
      currentPage={pageNum}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      onTypeChange={handleTypeChange}
    />
  );
}