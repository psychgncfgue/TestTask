import { redirect } from 'next/navigation';
import { isRefreshTokenValid } from '../../utils/auth';
import AuthPageClient from './AuthClient';

export default async function AuthPage() {
  const verified = await isRefreshTokenValid()
  if (verified) {
    redirect('/dashboard')
  }
  return <AuthPageClient />;
}