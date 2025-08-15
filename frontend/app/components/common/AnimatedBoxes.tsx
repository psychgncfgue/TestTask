'use client';

import { Box, Typography } from '@mui/material';
import { Variants, motion } from 'framer-motion';
import LazyLeafletMap from '../maps/LazyLeafMap';
import { useTranslation } from 'react-i18next';

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

export default function AnimatedBoxes() {
  const { t } = useTranslation();

  return (
    <Box> 
      <motion.div
        variants={revealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            pt: 10,
            pb: 10,
            mt: 10,
            mb: 10,
            borderTop: '1px solid gray',
            borderBottom: '1px solid gray',
          }}
        >
          <Typography variant="h4">
            {t('animatedBoxes.scroll_message')}
          </Typography>
        </Box>
      </motion.div>

      <motion.div
        variants={revealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            flexDirection: 'row',
          }}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <Typography key={i} variant="h4">
              ↓
            </Typography>
          ))}
        </Box>
      </motion.div>

      <motion.div
        variants={revealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            pt: 10,
            pb: 10,
            mt: 10,
            mb: 10,
            borderTop: '1px solid gray',
            borderBottom: '1px solid gray',
          }}
        >
          <Typography variant="h4">
            {t('animatedBoxes.lazyload_message')}
          </Typography>
        </Box>
      </motion.div>

      <motion.div
        variants={revealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <LazyLeafletMap />
      </motion.div>
    </Box>
  );
}