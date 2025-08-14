import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

export async function isRefreshTokenValid(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get('refreshToken')?.value
  const secret = process.env.JWT_SECRET

  if (!token || !secret) {
    return false
  }

  try {
    const verified = jwt.verify(token, secret)
    if (verified) {
        return true
    } else {
        return false
    }
  } catch {
    return false
  }
}