'use client';

import { Box, Divider, Skeleton, Stack } from '@mui/material';

export default function AccountSkeleton() {
    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} animation="wave" />
                <Skeleton variant="text" width={180} height={40} animation="wave" />
            </Box><Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Skeleton variant="circular" width={64} height={64} sx={{ mr: 2 }} animation="wave" />
                <Box>
                    <Skeleton variant="text" width={120} height={30} animation="wave" />
                    <Skeleton variant="text" width={180} height={20} animation="wave" />
                </Box>
            </Box><Divider sx={{ mb: 3 }} /><Stack spacing={2}>
                <Skeleton variant="rectangular" height={56} animation="wave" />
                <Skeleton variant="rectangular" height={56} animation="wave" />
                <Skeleton variant="rectangular" height={56} animation="wave" />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Skeleton variant="text" width={200} height={30} animation="wave" />
                    <Skeleton variant="circular" width={40} height={40} animation="wave" />
                </Box>

                <Skeleton variant="rectangular" height={40} animation="wave" />
            </Stack>
        </>
    );
}