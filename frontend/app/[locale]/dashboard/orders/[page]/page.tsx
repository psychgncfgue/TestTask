'use client';

import React, { useEffect } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import styles from '../../../../styles/dashboard/orders/order.container.module.css';
import { useAppDispatch, useAppSelector } from '@/app/redux/store';
import { useParams } from 'next/navigation';
import useLocalizedNavigation from '@/app/hooks/useLocalizedNavigation';
import { useTranslation } from 'react-i18next';
import { setCurrentPage, setSelectedModalOrderId, setSelectedSidebarOrderId } from '@/app/redux/slices/ordersSlice';
import { fetchOrders } from '@/app/redux/thunks/ordersThunks';
import OrdersCardsList from '@/app/components/orders/OrdersCardsList';
import { Order } from '@/app/types/orders';
import OrderDetailsSidebar from '@/app/components/orders/OrderDetailsSidebar';
import OrderDetailsModal from '@/app/components/orders/OrderDetailsModal';
import SidebarWrapper from '@/app/components/orders/SidebarWrapper';
import OrderItemSkeleton from '@/app/components/skeletons/OrderItemSkeleton';

export default function OrdersListContainer() {
    const dispatch = useAppDispatch();
    const { orders, isLoading, error, currentPage, totalPages, totalOrders } = useAppSelector(state => state.orders);
    const selectedSidebarOrderId = useAppSelector(state => state.orders.selectedSidebarOrderId);
    const selectedSidebarOrder = orders.find((o: Order) => o.id === selectedSidebarOrderId) || null;
    const selectedModalOrderId = useAppSelector(state => state.orders.selectedModalOrderId);
    const selectedModalOrder = orders.find((o: Order) => o.id === selectedModalOrderId) || null;

    const { push } = useLocalizedNavigation();
    const { i18n, t } = useTranslation();
    const params = useParams() as { page?: string };
    const pageNum = Number(params.page) || 1;
    const locale = i18n.language;
    const isSidebarOpen = selectedSidebarOrder !== null;
    const isModalOpen = selectedModalOrder !== null;

    useEffect(() => {
        if (currentPage !== pageNum) {
            dispatch(setCurrentPage(pageNum));
        }
        dispatch(fetchOrders({ page: pageNum }));
        dispatch(setSelectedSidebarOrderId(null));
        dispatch(setSelectedModalOrderId(null));
    }, [dispatch, pageNum]);

    if (error) {
        return (
            <Box mt={4}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    if (isLoading) {
        return (
            <Box className={styles['orders-list']}>
                <Typography variant="h5" className={styles['orders-list-container__title']}>
                    {t('orders.loading')}
                </Typography>
                <Box className={styles['orders-skeleton-container']}>
                {[...Array(5)].map((_, i) => (
                    <OrderItemSkeleton key={i} />
                ))}
                </Box>
            </Box>
        );
    }

    return (
        <Box className={styles['orders-list']}>
            <Typography variant="h5" className={styles['orders-list-container__title']}>
                {t('orders.orders_with_count', { count: totalOrders })}
            </Typography>
            <Box className={styles['orders-list-container']}>
                <OrdersCardsList
                    totalOrders={totalOrders}
                    orders={orders}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => {
                        dispatch(setCurrentPage(page));
                        push(`/${locale}/dashboard/orders/${page}`);
                    }}
                    selectedSidebarOrderId={selectedSidebarOrderId}
                />
                <SidebarWrapper isOpen={isSidebarOpen}>
                    <OrderDetailsSidebar
                        order={selectedSidebarOrder || ({} as Order)}
                        onClose={() => dispatch(setSelectedSidebarOrderId(null))}
                    />
                </SidebarWrapper>
                <OrderDetailsModal
                    order={selectedModalOrder || ({} as Order)}
                    isOpen={isModalOpen}
                    onClose={() => dispatch(setSelectedModalOrderId(null))}
                />
            </Box>
        </Box>
    );
}