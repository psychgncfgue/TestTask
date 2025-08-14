import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const BACKEND = process.env.BACKEND_URL;

export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  if (!BACKEND) {
    console.error("❌ No valid BACKEND_URL in .env");
    return NextResponse.json({ isAuthenticated: false }, { status: 500 });
  }

  if (!accessToken && !refreshToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const cookieHeader = [
    accessToken && `accessToken=${accessToken}`,
    refreshToken && `refreshToken=${refreshToken}`,
  ]
    .filter(Boolean)
    .join('; ');

  try {
    const res = await axios.post(
      `${BACKEND}/auth/change-password`,
      {},
      {
        headers: {
          Cookie: cookieHeader,
        },
        withCredentials: true,
      }
    );
    console.warn(res.data)
    return NextResponse.json(res.data, { status: res.status });
  } catch (err: any) {
    console.error('Ошибка при отправке запроса на смену пароля:', err.response?.data || err.message);
    const status = err.response?.status || 500;
    return NextResponse.json({ error: 'Не удалось отправить запрос на смену пароля' }, { status });
  }
}