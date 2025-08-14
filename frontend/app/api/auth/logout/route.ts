import axios from 'axios';
import { NextResponse } from 'next/server';

const BACKEND = process.env.BACKEND_URL;

export async function POST(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';

  if (!BACKEND) {
      console.error("❌ No valid BACKEND_URL in .env");
      return NextResponse.json({ isAuthenticated: false }, { status: 500 });
  }

  try {
    const response = await axios.post(
      `${BACKEND}/auth/logout`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookieHeader,
        },
        withCredentials: true,
      }
    );

    const setCookieHeaders = response.headers['set-cookie'];
    const headers = new Headers();
    if (setCookieHeaders) {
      setCookieHeaders.forEach((cookie: string) => {
        headers.append('Set-Cookie', cookie);
      });
    }

    return new NextResponse(
      JSON.stringify({ success: true, message: response.data?.message }),
      { status: 200, headers }
    );
  } catch (error: any) {
    console.error('Logout error:', error);
    const status = error.response?.status || 500;
    const message = error.response?.data?.error || 'Ошибка при выходе';
    return new NextResponse(
      JSON.stringify({ success: false, message }),
      { status }
    );
  }
}