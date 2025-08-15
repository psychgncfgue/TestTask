'use client';

import React, { useEffect, useState } from 'react';
import {
  Paper,
  Typography,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Box,
  useMediaQuery,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Snackbar, Alert } from '@mui/material';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { Order } from '@/app/types/orders';
import { Product } from '@/app/types/products';
import { useAppDispatch, useAppSelector } from '@/app/redux/store';
import { deleteProductFromOrder } from '@/app/redux/thunks/ordersThunks';
import OverlayLoader from '../loaders/OverlayLoader';
import ConfirmDeleteProductDialog from './ConfirmDeleteProductDialog.tsx';
import { setSelectedSidebarOrderId } from '@/app/redux/slices/ordersSlice';
import { useTranslation } from 'react-i18next';
import styles from '../../styles/dashboard/orders/order.details.sidebar.module.css';

interface OrderDetailsSidebarProps {
  order: Order;
  onClose: () => void;
  isOpen?: boolean;
}

const itemVariants: Variants = {
  visible: { opacity: 1, x: 0 },
  removed: { opacity: 0, x: 800, transition: { duration: 0.5, ease: "easeInOut" } },
};

export default function OrderDetailsSidebar({ order, onClose, isOpen = false }: OrderDetailsSidebarProps) {
  const { productDeleteLoading } = useAppSelector(state => state.orders);
  const dispatch = useAppDispatch();
  const products: Product[] = order.products ?? [];
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [animatedProducts, setAnimatedProducts] = useState<Product[]>(products);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:1200px)');
  const { t } = useTranslation();

  useEffect(() => {
    if (isMobile) {
      dispatch(setSelectedSidebarOrderId(null));
    }
  }, [isMobile, dispatch]);

  useEffect(() => {
    setAnimatedProducts(products);
  }, []);

  useEffect(() => {
    setAnimatedProducts(products);
  }, [order.id]);

  const openConfirm = (product: Product) => {
    setProductToDelete(product);
    setConfirmOpen(true);
  };

  const closeConfirm = () => {
    setConfirmOpen(false);
    setProductToDelete(null);
  };

  const confirmDelete = () => {
    if (!productToDelete) return;

    closeConfirm();

    setTimeout(() => {
      setAnimatedProducts(prev =>
        prev.filter(p => p.id !== productToDelete.id)
      );

      setTimeout(() => {
        dispatch(deleteProductFromOrder(order.id, productToDelete.id, productToDelete.price));

        setSnackbarOpen(true);

        setTimeout(() => setSnackbarOpen(false), 3500);
      }, 500);
    }, 1000);
  };

  return (
    <>
      <Paper
        className={`${styles['order-details-sidebar']} ${isOpen ? styles['order-details-sidebar--open'] : ''}`}
        elevation={2}
        square={false}
        tabIndex={isOpen ? 0 : -1}
        aria-hidden={!isOpen}
        sx={{ p: 2 }}
      >
        <Box className={styles['order-details-sidebar__header']}>
          <Typography variant="h6" component="h2">
            {t('orders.details_title', { id: order.id })}
          </Typography>
          <IconButton onClick={onClose} aria-label={t('orders.close_details')}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Typography variant="subtitle1" mb={2} mt={2}>
          {t('orders.date')}: {new Date(order.date).toLocaleDateString()}
        </Typography>

        <Box className={styles['order-details-sidebar__price']}>
          <Typography variant="subtitle1">{t('orders.total_amount')}</Typography>
          <Box className={styles['order-details-sidebar__price-right']}>
            <Typography variant="subtitle2" fontWeight={600}>
              {order.totalUSD ?? '—'} $
            </Typography>
            <Typography variant="subtitle1" fontWeight={600}>
              {order.totalUAH ?? '—'} ₴
            </Typography>
          </Box>
        </Box>

        <Divider />

        <Typography variant="subtitle2" mt={2} mb={1}>
          {t('orders.products_in_order')}
        </Typography>

        <OverlayLoader visible={productDeleteLoading} />
        <List>
          <AnimatePresence>
          {animatedProducts.map(prod => (
            <motion.div
              key={prod.id}
              initial="visible"
              animate="visible"
              exit="removed"
              variants={itemVariants}
              onAnimationComplete={(definition) => {
                if (definition === "removed") {
                  setAnimatedProducts(prev => prev.filter(p => p.id !== prod.id));
                }
              }}
            >
              <ListItem
                className={styles['order-details-sidebar__product-item']}
                disableGutters
              >
                <ListItemAvatar className={styles['product-avatar']}>
                  <Avatar
                    alt={prod.title}
                    src={prod.photo}
                    variant="square"
                    className={styles['product-avatar__image']}
                  />
                </ListItemAvatar>
                <ListItemText primary={prod.title} />
                <Typography variant="body2" mr={2}>
                  {t('orders.status')}: {prod.isNew ? t('orders.status_new') : t('orders.status_used')}
                </Typography>
                <IconButton
                  edge="end"
                  aria-label={t('orders.delete_product_aria_label', { title: prod.title })}
                  className={styles['product-delete']}
                  onClick={() => openConfirm(prod)}
                >
                  <DeleteOutlineIcon />
                </IconButton>
              </ListItem>
            </motion.div>
          ))}
          </AnimatePresence>
        </List>
      </Paper>
      <Snackbar
        open={snackbarOpen}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          {t('orders.product_deleted_success')}
        </Alert>
      </Snackbar>
      <ConfirmDeleteProductDialog
        open={confirmOpen}
        onClose={closeConfirm}
        onConfirm={confirmDelete}
        product={productToDelete}
      />
    </>
  );
}