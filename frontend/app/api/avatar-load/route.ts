import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export const config = {
  api: {
    bodyParser: false, 
  },
};

const BACKEND = process.env.BACKEND_URL;

export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  if (!BACKEND) {
      console.error("❌ No valid BACKEND_URL in .env");
      return NextResponse.json({ isAuthenticated: false }, { status: 500 });
  }

  if (!accessToken && !refreshToken) {
    return NextResponse.json(
      { error: 'Unauthorized: отсутствуют токены в куки' },
      { status: 401 }
    );
  }

  try {
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('multipart/form-data')) {
      return NextResponse.json(
        { error: 'Неверный Content-Type. Ожидается multipart/form-data' },
        { status: 400 }
      );
    }

    const arrayBuffer = await request.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const cookieHeader = [accessToken && `accessToken=${accessToken}`, refreshToken && `refreshToken=${refreshToken}`]
      .filter(Boolean)
      .join('; ');

    const res = await axios.post(`${BACKEND}/auth/avatar`, buffer, {
      headers: {
        'Content-Type': contentType,
        'Cookie': cookieHeader,
      },
      withCredentials: true,
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (err: any) {
    console.error('Ошибка загрузки аватара:', err.response?.data || err.message);
    const status = err.response?.status || 500;
    return NextResponse.json({ error: 'Не удалось загрузить аватар' }, { status });
  }
}