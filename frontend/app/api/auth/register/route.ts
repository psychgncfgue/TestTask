import axios, { AxiosError } from 'axios';
import { NextResponse } from 'next/server';

const BACKEND = process.env.BACKEND_URL;

export async function POST(request: Request) {
  const { email, username, password, confirmPassword, country, provider } = await request.json();

  if (!BACKEND) {
      console.error("❌ No valid BACKEND_URL in .env");
      return NextResponse.json({ isAuthenticated: false }, { status: 500 });
  }

  try {
    const response = await axios.post(`${BACKEND}/auth/register`, {
      email, username, password, confirmPassword, country, provider
    });


    return new NextResponse(JSON.stringify({
      success: true,
      message: response.data.message
    }));
  } catch (error: unknown) {
    const axiosError = error as AxiosError;
    console.error("Registration error:", axiosError?.response?.data);
    return new NextResponse(JSON.stringify({
      success: false,
      message: axiosError?.response?.data || "Ошибка регистрации"
    }), {
      status: 500
    });
  }
}