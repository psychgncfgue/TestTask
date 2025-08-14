'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Box, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import styles from '../../styles/dashboard/products/product.item.module.css';
import { Guarantee, Price } from '@/app/types/products';
import ProductModalInfo from './ProductModalInfo';
import { useTranslation } from 'react-i18next';

interface ProductItemProps {
    id: number;
    photo: string;
    title: string;
    isNew: boolean;
    guarantee: Guarantee;
    specification: string;
    price: Price[];
    date: string;
}

export default function ProductItem({
    id,
    photo,
    title,
    isNew,
    guarantee,
    specification,
    price,
    date,
}: ProductItemProps) {
    const theme = useTheme();
    const { t } = useTranslation();

    const [menuOpen, setMenuOpen] = useState(false);

    const indicatorColor = !isNew
        ? theme.palette.mode === 'dark'
            ? '#a0522d'
            : 'brown'
        : theme.palette.mode === 'dark'
            ? '#dad8d8ff'
            : 'black';

    const defaultPrice = price.find(p => p.isDefault);
    const priceUSD = price.find(p => p.symbol === 'USD');

    return (
        <Card className={styles['product-item']} key={id}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <span
                    className={styles['status-indicator']}
                    style={{ backgroundColor: indicatorColor }}
                />
                <CardMedia
                    component="img"
                    image={photo}
                    alt={title}
                    className={styles['product-item__media']}
                />
            </Box>
            <CardContent className={styles['product-item__content']}>
                <Typography variant="subtitle1" className={styles['product-item__title']} noWrap>
                    {title}
                </Typography>

                <Typography variant="body2" className={styles['product-item__status']} noWrap>
                    {t('product.status')}: {isNew ? t('product.status_new') : t('product.status_used')}
                </Typography>

                <Typography variant="body2" className={styles['product-item__guarantee']} noWrap>
                    {t('product.guarantee')}: {guarantee.start} — {guarantee.end}
                </Typography>

                <Typography variant="body2" className={styles['product-item__specification']} noWrap>
                    {t('product.specification')}: {specification}
                </Typography>

                <Box className={styles['product-item__price-box']}>
                    <Typography variant="subtitle1" className={styles['product-item__price']} noWrap>
                        {t('product.price')}: {defaultPrice?.value} {defaultPrice?.symbol}
                    </Typography>
                    {priceUSD && defaultPrice?.symbol !== 'USD' && (
                        <Typography variant="caption" className={styles['product-item__price-usd']}>
                            (~{priceUSD.value} USD)
                        </Typography>
                    )}
                </Box>

                <Typography variant="body2" className={styles['product-item__date']} noWrap>
                    {t('product.date')}: {date}
                </Typography>
            </CardContent>
            <IconButton
                className={styles['product-item__menu-button']}
                onClick={() => setMenuOpen(prev => !prev)}
                aria-label={t('product.open_menu')}
                size="large"
            >
                <MenuIcon />
            </IconButton>
            <ProductModalInfo
                open={menuOpen}
                onClose={() => setMenuOpen(false)}
                title={title}
                isNew={isNew}
                guarantee={guarantee}
                specification={specification}
                price={price}
                date={date}
            />
        </Card>
    );
}