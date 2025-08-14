import { redirect } from 'next/navigation'
import { isRefreshTokenValid } from '../../utils/auth'
import RegisterForm from './RegisterClient'

export default async function RegisterPage() {
  const verified = await isRefreshTokenValid()
  if (verified) {
    redirect('/dashboard')
  }
  return <RegisterForm />
}