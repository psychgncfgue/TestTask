import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

const BACKEND = process.env.BACKEND_URL;

export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value

  if (!BACKEND) {
    console.error("❌ No valid BACKEND_URL in .env");
    return NextResponse.json({ isAuthenticated: false }, { status: 500 });
  }

  if (!accessToken && !refreshToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const cookieHeader = [
    accessToken && `accessToken=${accessToken}`,
    refreshToken && `refreshToken=${refreshToken}`,
  ]
    .filter(Boolean)
    .join('; ')

  let body: { code?: string; newPassword?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  try {
    const res = await axios.post(
      `${BACKEND}/auth/change-password-confirm`,
      {
        code: body.code,
        newPassword: body.newPassword,
      },
      {
        headers: { Cookie: cookieHeader },
        withCredentials: true,
      }
    )
    return NextResponse.json(res.data, { status: res.status })
  } catch (err: any) {
    // распечатаем в логе полный ответ бэка
    console.error('Backend error payload:', err.response?.data, 'status:', err.response?.status)
    const payload = err.response?.data ?? { error: 'Unknown error' }
    const status = err.response?.status || 500
    // и вернём точно эту же ошибку клиенту
    return NextResponse.json(payload, { status })
  }
}