import AnimatedBoxes from '@/app/components/common/AnimatedBoxes';
import DashboardProductChartWrapper from '@/app/components/dashboard/DashboardProductsChartWrapper';
import { Box, Typography } from '@mui/material';


async function getPricesByType() {
  try {
    const res = await fetch(`${process.env.FRONTEND_URL}/api/products/prices-by-type`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data;
  } catch (err) {
    return null;
  }
}

export default async function DashboardPage() {
  const initialData = await getPricesByType();

  return (
    <Box sx={{ minHeight: '100%', p: 3, mt: 10 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', pt: 10, pb: 10, mb: 10, borderBottom: '1px solid gray' }}>
      <Typography variant="h4" gutterBottom>
        Это пример SSR компонента Chart.js. Запрос данных для графтка в серверном компоненте.
      </Typography>
      </Box>
      <DashboardProductChartWrapper initialData={initialData} />
      <AnimatedBoxes />
    </Box>
  );
}