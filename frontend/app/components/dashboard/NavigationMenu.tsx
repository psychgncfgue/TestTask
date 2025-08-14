'use client';

import React from 'react';
import NextLink from 'next/link';
import { List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { menuItems } from '../../constants/menuItems';
import { useTranslation } from 'react-i18next';
import { locales } from '@/app/constants/locales';
import { useAppSelector } from '@/app/redux/store';


interface NavigationMenuProps {
    pathname: string;
    onNavigate: (path: string) => void;
}

export default function NavigationMenu({ pathname, onNavigate }: NavigationMenuProps) {
    const { t } = useTranslation();
    const { currentPage, productTypes, currentType } = useAppSelector(state => state.products);
    const { currentPage: ordersPage } = useAppSelector(state => state.orders);

    const localeRegex = new RegExp(`^/(${locales.join('|')})(?=/|$)`, 'i');

    const stripLocale = (p: string | undefined) => {
        if (!p) return '/';
        return p.replace(localeRegex, '') || '/';
    };

    const normalize = (p: string | undefined) => {
        const s = stripLocale(p);
        return (s.replace(/\/+$/, '') || '/') as string;
    };

    const current = normalize(pathname);

    const buildProductsPath = () => {
        const type = currentType && productTypes.includes(currentType) ? currentType : 'all';
        const page = currentPage || 1;
        return `/dashboard/products/${type}/${page}`;
    };

    const buildOrdersPath = () => {
        const page = ordersPage || 1;
        return `/dashboard/orders/${page}`;
    };

    return (
        <List>
            {menuItems.map(({ key, href }) => {
                const hrefNormalized = normalize(href);
                const isProductsMenu = href === '/dashboard/products';
                const isOrdersMenu = href === '/dashboard/orders';

                const finalHref = isProductsMenu
                    ? buildProductsPath()
                    : isOrdersMenu
                        ? buildOrdersPath()
                        : href;

                const selected = isProductsMenu
                    ? current.startsWith('/dashboard/products')
                    : isOrdersMenu
                        ? current.startsWith('/dashboard/orders')
                        : hrefNormalized === current;

                return (
                    <ListItem disablePadding key={href}>
                        <ListItemButton
                            component={selected ? 'div' : NextLink}
                            href={selected ? undefined : finalHref}
                            disabled={selected}
                            selected={selected}
                            onClick={selected ? undefined : () => onNavigate(finalHref)}
                            sx={{
                                color: 'text.primary',
                                borderLeft: selected ? '4px solid #7CFC00' : '4px solid transparent',
                                pl: 2,
                                '&.Mui-disabled': {
                                    opacity: 1,
                                    cursor: 'default',
                                },
                            }}
                        >
                            <ListItemText primary={t(key)} />
                        </ListItemButton>
                    </ListItem>
                );
            })}
        </List>
    )
}