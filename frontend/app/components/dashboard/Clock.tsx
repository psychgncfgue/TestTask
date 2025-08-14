'use client';

import { useEffect, useState } from 'react';
import { Typography, Stack } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useTranslation } from 'react-i18next';
import { WEEKDAY_KEYS } from '@/app/constants/locales';

export default function Clock() {
    const { t, i18n } = useTranslation();
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    const dayName = t(WEEKDAY_KEYS[now.getDay()]);
    const dateString = now.toLocaleDateString(i18n.language, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
    const timeString = now.toLocaleTimeString(i18n.language, {
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <Stack spacing={0.5}>
            <Typography variant="body1" sx={{ display: { xs: 'none', sm: 'block', }}}>
                {dayName}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block', }}}>{dateString}</Typography>
                <AccessTimeIcon sx={{ color: 'green', fontSize: 18 }} />
                <Typography variant="body2">{timeString}</Typography>
            </Stack>
        </Stack>
    );
}