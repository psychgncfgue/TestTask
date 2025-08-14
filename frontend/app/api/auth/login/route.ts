import axios from 'axios';
import { NextResponse } from 'next/server';

const BACKEND = process.env.BACKEND_URL;

export async function POST(request: Request) {
  const { login, password } = await request.json();

  if (!BACKEND) {
      console.error("❌ No valid BACKEND_URL in .env");
      return NextResponse.json({ isAuthenticated: false }, { status: 500 });
  }

  try {
    const response = await axios.post(
      `${BACKEND}/auth/login`,
      { login, password },
      { withCredentials: true }
    );

    const cookies = response.headers['set-cookie'];
    const userData = response.data;

    const headers: HeadersInit = new Headers();
    cookies?.forEach((cookieStr: string) => {
      headers.append('Set-Cookie', cookieStr);
    });

    return new NextResponse(JSON.stringify({
      success: true,
      message: 'Успешный вход в систему',
      userData,
    }), { headers });
  } catch (error: any) {
    console.error('Login error:', error);

    const status = error.response?.status || 500;
    const message = error.response?.data?.message || 'Ошибка входа';

    return new NextResponse(JSON.stringify({
      success: false,
      message,
    }), { status });
  }
}