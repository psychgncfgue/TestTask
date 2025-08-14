'use client';

import React, { useEffect } from 'react';
import styles from '../../styles/dashboard/orders/order.item.module.css';
import { Card, CardContent, Stack, Typography, Divider, Box, Tooltip, useMediaQuery } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useAppDispatch } from '@/app/redux/store';
import { setSelectedModalOrderId, setSelectedSidebarOrderId } from '@/app/redux/slices/ordersSlice';

type OrderItemProps = {
    id: string | number;
    productsCount: number;
    date: string;
    priceUAH: number | null;
    priceUSD: number | null;
    isSelected?: boolean;
};

export default function OrderItem({
    id,
    productsCount,
    date,
    priceUAH,
    priceUSD,
    isSelected = false,
}: OrderItemProps) {
    const dispatch = useAppDispatch();
    const isMobile = useMediaQuery('(max-width:1200px)');

    const openSidebar = () => {
        dispatch(setSelectedSidebarOrderId(id));
    };
    const openModal = () => {
        dispatch(setSelectedModalOrderId(id));
    };

    return (
        <Card
            className={`${styles['order-item']} ${isSelected ? styles['order-item--selected'] : ''}`}
            {...(isMobile ? { onClick: openModal } : {})}
            style={isMobile ? { cursor: 'pointer' } : {}}
        >
            <CardContent className={`${styles['order-item__content']} ${isSelected ? styles['order-item__content--selected'] : ''}`}>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={4}
                    className={styles['order-item__row']}
                >
                    <Box className={styles['order-item__title']}>
                        <Typography variant="subtitle1" fontWeight={600} className={styles['order-item__title']}>
                            Заказ №{id}
                        </Typography>
                    </Box>

                    {!isMobile && (
                        <>
                            <Tooltip title="Открыть детали" arrow>
                                <Box className={styles['order-item__menu-sidebar']} onClick={openSidebar}>
                                    <MenuIcon />
                                </Box>
                            </Tooltip>
                        </>
                    )}

                    <Box className={styles['order-item__products']}>
                        <Box className={styles['order-item__products-count']}>
                            <ShoppingCartIcon fontSize="small" color="action" />
                            <Typography variant="body1" color="text.secondary">
                                {productsCount}
                            </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                            {productsCount === 1 ? 'товар' : 'товара'}
                        </Typography>
                    </Box>

                    <Typography variant="body2" color="text.secondary" className={styles['order-item__date']}>
                        {date}
                    </Typography>

                    <Box className={styles['order-item__prices']}>
                        <Typography variant="subtitle2" fontWeight={600}>
                            {priceUSD} $
                        </Typography>
                        <Typography variant="subtitle1" fontWeight={600}>
                            {priceUAH} ₴
                        </Typography>
                    </Box>
                    <DeleteOutlineIcon className={`${styles['order-item__delete']} ${isSelected ? styles['order-item__delete--selected'] : ''}`} />
                    {isSelected && <Box className={styles['order-item__selected-arrow']}>▶</Box>}
                </Stack>
            </CardContent>
            <Divider />
        </Card>
    );
}