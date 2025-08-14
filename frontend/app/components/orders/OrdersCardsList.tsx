'use client';

import React from 'react';
import { Box, Stack, Pagination, Typography } from '@mui/material';
import { Order } from '@/app/types/orders';
import OrderItem from './OrderItem';
import styles from '../../styles/dashboard/orders/order.card.list.module.css';

interface OrdersCardsListProps {
    orders: Order[];
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalOrders: number;
    selectedSidebarOrderId: string | number | null;
}

export default function OrdersCardsList({
    orders,
    currentPage,
    totalPages,
    onPageChange,
    selectedSidebarOrderId,
}: OrdersCardsListProps) {
    return (
        <Box className={styles['orders-cards-list']}>
            <Stack spacing={2} className={styles['orders-cards-list__items']}>
                {orders.map(order => (
                    <OrderItem
                        key={order.id}
                        id={order.id}
                        priceUAH={order.totalUAH ?? null}
                        priceUSD={order.totalUSD ?? null}
                        productsCount={order.products.length}
                        date={new Date(order.date).toLocaleDateString()}
                        isSelected={order.id === selectedSidebarOrderId}
                    />
                ))}
            </Stack>

            {totalPages > 1 && (
                <Stack alignItems="center" className={styles['orders-cards-list__pagination']}>
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={(_, page) => onPageChange(page)}
                        color="primary"
                    />
                </Stack>
            )}
        </Box>
    );
}