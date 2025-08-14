'use client';

import useSWR from 'swr';
import { Price } from '@/app/types/products';
import ProductPricesChart from '@/app/components/charts/ProductPricesChart';
import FallbackChameleon from '../common/FallbackChameleon';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
};

interface Props {
  initialData: { type: string; prices: Price[] }[] | null;
}

export default function DashboardProductChartWrapper({ initialData }: Props) {
  const { data, error, isLoading, mutate } = useSWR<
    { type: string; prices: Price[] }[]
  >(`/api/products/prices-by-type`, fetcher, {
    fallbackData: initialData || undefined,
    revalidateOnFocus: false,
  });

  if (error) {
    return <FallbackChameleon onRetry={mutate} />;
  }

  if (!data) {
    return <FallbackChameleon isLoading={isLoading} onRetry={mutate} />;
  }

  return <ProductPricesChart productsByType={data} />;
}