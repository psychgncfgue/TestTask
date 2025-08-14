'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';
import { Guarantee, Price } from '@/app/types/products';

interface ProductModalInfoProps {
  open: boolean;
  onClose: () => void;
  title: string;
  isNew: boolean;
  guarantee: Guarantee;
  specification: string;
  price: Price[];
  date: string;
}

export default function ProductModalInfo({
  open,
  onClose,
  title,
  isNew,
  guarantee,
  specification,
  price,
  date,
}: ProductModalInfoProps) {
  const defaultPrice = price.find(p => p.isDefault);
  const priceUSD = price.find(p => p.symbol === 'USD');

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom sx={{ borderBottom: '1px solid gray', pb: 2 }}>
          <strong>Статус:</strong> {isNew ? 'Новое' : 'Б/у'}
        </Typography>
        <Typography gutterBottom sx={{ borderBottom: '1px solid gray', pb: 2, pt: 2 }}>
          <strong>Гарантия:</strong> {guarantee.start} — {guarantee.end}
        </Typography>
        <Typography gutterBottom sx={{ borderBottom: '1px solid gray', pb: 2, pt: 2 }}>
          <strong>Спецификация:</strong> {specification}
        </Typography>
        <Typography gutterBottom sx={{ borderBottom: '1px solid gray', pb: 2, pt: 2 }}>
          <strong>Цена:</strong> {defaultPrice?.value} {defaultPrice?.symbol}{' '}
          {priceUSD && defaultPrice?.symbol !== 'USD' && `(~${priceUSD.value} USD)`}
        </Typography>
        <Typography gutterBottom sx={{  pt: 2 }}>
          <strong>Дата:</strong> {date}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          Закрыть
        </Button>
      </DialogActions>
    </Dialog>
  );
}