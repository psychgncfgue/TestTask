'use client';

import React from 'react';
import { Box } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Price } from '@/app/types/products';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ProductPricesChartProps {
  productsByType: { type: string; prices: Price[] }[];
}

const ProductPricesChart: React.FC<ProductPricesChartProps> = ({ productsByType }) => {
  const labels: string[] = productsByType.map(p => p.type);

  const data: ChartData<'bar'> = {
    labels,
    datasets: [
      {
        label: 'Средняя цена (в дефолтной валюте)',
        data: productsByType.map(({ prices }) => {
          const defaultPrices = prices.filter(pr => pr.isDefault);
          const avg =
            defaultPrices.reduce((sum, p) => sum + p.value, 0) /
            (defaultPrices.length || 1);
          return Math.round(avg * 100) / 100;
        }),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Средняя цена продуктов по типам' },
    },
  };

  return (
    <Box>
      <Bar options={options} data={data} />
    </Box>
  );
};

export default ProductPricesChart;