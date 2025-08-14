import React from 'react';
import { redirect } from 'next/navigation';
import { isRefreshTokenValid } from '@/app/utils/auth';
import DashboardClient from './DashboardClient';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const verified = await isRefreshTokenValid();
  if (!verified) {
    redirect('/auth');
  }


  return (
    <DashboardClient>
      {children}
    </DashboardClient>
  );
}