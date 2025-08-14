import React from 'react';
import {
  Modal,
  Backdrop,
  Fade,
  Paper,
  Avatar,
  Typography,
  Button,
  Box
} from '@mui/material';
import { Product } from '@/app/types/products';
import styles from '../../styles/dashboard/orders/confirm.delete.product.dialog.module.css';
import { useTranslation } from 'react-i18next';

interface ConfirmDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  product?: Product | null;
}

export default function ConfirmDeleteProductDialog({
  open,
  onClose,
  onConfirm,
  product
}: ConfirmDeleteDialogProps) {
  const { t } = useTranslation();

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      aria-labelledby="confirm-delete-title"
      aria-describedby="confirm-delete-description"
      className={styles['confirm-delete__modal']}
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
    >
      <Fade in={open}>
        <Paper
          className={styles['confirm-delete__container']}
          elevation={3}
          square
        >
          <Typography id="confirm-delete-title" variant="h6" component="h2" className={styles['confirm-delete__title']}>
            {t('orders.confirm_delete_title', 'Подтверждение удаления')}
          </Typography>

          {product && (
            <Box className={styles['confirm-delete__product']}>
              <Avatar
                src={product.photo}
                alt={product.title}
                variant="square"
                className={styles['confirm-delete__avatar']}
              />
              <Box className={styles['confirm-delete__info']}>
                <Typography variant="subtitle1" className={styles['confirm-delete__product-title']}>
                  {product.title}
                </Typography>
                <Typography variant="subtitle1" className={styles['confirm-delete__product-serial']}>
                  {product.serialNumber}
                </Typography>
              </Box>
              <Typography variant="body2" className={styles['confirm-delete__product-status']}>
                {t('orders.status')}: {product.isNew ? t('orders.status_new') : t('orders.status_used')}
              </Typography>
            </Box>
          )}

          <Typography id="confirm-delete-description" className={styles['confirm-delete__description']}>
            {t('orders.confirm_delete_description', 'Вы уверены, что хотите удалить этот товар из заказа?')}
          </Typography>

          <Box className={styles['confirm-delete__actions']}>
            <Button onClick={onClose} color="inherit" variant="outlined" className={styles['confirm-delete__button']}>
              {t('common.cancel', 'Отмена')}
            </Button>
            <Button onClick={onConfirm} color="error" variant="contained" className={styles['confirm-delete__button']}>
              {t('orders.delete', 'Удалить')}
            </Button>
          </Box>
        </Paper>
      </Fade>
    </Modal>
  );
}