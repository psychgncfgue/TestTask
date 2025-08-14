import axios from 'axios';
import { NextResponse } from 'next/server';

const BACKEND = process.env.BACKEND_URL;

export async function POST(request: Request) {
  const { token } = await request.json();

  if (!BACKEND) {
      console.error("❌ No valid BACKEND_URL in .env");
      return NextResponse.json({ isAuthenticated: false }, { status: 500 });
  }

  try {
    const response = await axios.post(`${BACKEND}/auth/confirm-email`, { token }, { withCredentials: true });

    const cookies = response.headers["set-cookie"];
    const userData = response.data;

    const headers: HeadersInit = new Headers();
    cookies?.forEach((cookieStr: string) => {
      headers.append('Set-Cookie', cookieStr);
    });

    return new NextResponse(JSON.stringify({
      success: true,
      message: 'Email успешно подтвержден',
      userData: userData,
    }), { headers });

  } catch (error: any) {
    console.error("Confirmation error:", error);


    if (axios.isAxiosError(error) && error.response?.status === 409) {
      return new NextResponse(JSON.stringify({
        success: false,
        message: error.response.data?.message || 'Email уже подтвержден',
      }), { status: 409 });
    }

    return new NextResponse(JSON.stringify({
      success: false,
      message: 'Ошибка подтверждения email',
    }), {
      status: 500
    });
  }
}