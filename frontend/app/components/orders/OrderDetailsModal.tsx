'use client';

import React, { useEffect, useState } from 'react';
import {
  Backdrop,
  Fade,
  Modal,
  Paper,
  Typography,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  Box,
  ListItemAvatar,
  Avatar,
  useMediaQuery,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Order } from '@/app/types/orders';
import styles from '../../styles/dashboard/orders/order.details.modal.module.css';
import { useAppDispatch, useAppSelector } from '@/app/redux/store';
import { deleteProductFromOrder } from '@/app/redux/thunks/ordersThunks';
import OverlayLoader from '../loaders/OverlayLoader';
import { Product } from '@/app/types/products';
import ConfirmDeleteProductDialog from './ConfirmDeleteProductDialog.tsx';
import { setSelectedModalOrderId } from '@/app/redux/slices/ordersSlice';
import { useTranslation } from 'react-i18next';

interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
  isOpen?: boolean;
}

export default function OrderDetailsModal({ order, onClose, isOpen = false }: OrderDetailsModalProps) {
  const dispatch = useAppDispatch();
  const { productDeleteLoading } = useAppSelector(state => state.orders);
  const products: Product[] = order.products ?? [];
  const isMobile = useMediaQuery('(max-width:700px)');
  const closeModal = useMediaQuery('(max-width:1200px)');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { t } = useTranslation();
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  useEffect(() => {
    if (!closeModal) {
      dispatch(setSelectedModalOrderId(null));
    }
  }, [closeModal, dispatch]);

  const openConfirm = (product: Product) => {
    setProductToDelete(product);
    setConfirmOpen(true);
  };

  const closeConfirm = () => {
    setConfirmOpen(false);
    setProductToDelete(null);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      dispatch(deleteProductFromOrder(order.id, productToDelete.id, productToDelete.price));
    }
    closeConfirm();
  };

  return (
    <>
      <Modal
        open={isOpen}
        onClose={onClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 300 }}
        className={styles['order-details-modal']}
        aria-labelledby="order-details-modal-title"
        aria-describedby="order-details-modal-description"
      >
        <Fade in={isOpen}>
          <Paper className={styles['order-details-modal__content']} elevation={3} square>
            <Box className={styles['order-details-modal__header']}>
              <Typography id="order-details-modal-title" variant="h6" component="h2">
                {t('orders.details_title', { id: order.id })}
              </Typography>
              <IconButton onClick={onClose} aria-label={t('orders.close_details')}>
                <CloseIcon />
              </IconButton>

            </Box>

            <Typography variant="subtitle1" mb={2} mt={2}>
              {t('orders.date')}: {new Date(order.date).toLocaleDateString()}
            </Typography>
            <Box className={styles['order-details-modal__price']}>
              <Typography variant="subtitle1">
                {t('orders.total_amount')}
              </Typography>
              <Box className={styles['order-details-modal__price-right']}>
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
              {products.map((prod) => (
                <ListItem
                  className={styles['order-details-modal__product-item']}
                  key={prod.id}
                  disableGutters
                >
                  <ListItemAvatar className={styles['product-avatar']}>
                    <Avatar
                      alt={prod.title}
                      src={prod.photo}
                      variant="square"
                      className={styles['product-avatar__image']} />
                  </ListItemAvatar>
                  <ListItemText primary={prod.title} className={styles['product-title']} />
                  {!isMobile && (
                    <Box className={styles['product-status']}>
                      <Typography variant="body2">
                        {t('orders.status')}: {prod.isNew ? t('orders.status_new') : t('orders.status_used')}
                      </Typography>
                    </Box>
                  )}
                  <IconButton
                    edge="end"
                    aria-label={t('orders.delete_product_aria_label', { title: prod.title })}
                    className={styles['product-delete']}
                    onClick={() => openConfirm(prod)}
                    disabled={productDeleteLoading}
                  >
                    <DeleteOutlineIcon sx={{ width: 30, height: 30 }} />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Fade>
      </Modal>
      <ConfirmDeleteProductDialog
        open={confirmOpen}
        onClose={closeConfirm}
        onConfirm={confirmDelete}
        product={productToDelete} />
    </>
  );
}