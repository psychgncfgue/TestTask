import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import axios from 'axios';

export async function GET(req: NextRequest) {
  const cookieStore = req.cookies;
  const refreshToken = cookieStore.get('refreshToken')?.value;
  const accessToken = cookieStore.get('accessToken')?.value;

  const JWT_SECRET = process.env.JWT_SECRET;
  const BACKEND = process.env.BACKEND_URL;
  if (!JWT_SECRET) {
    console.error("JWT_SECRET не определён");
    return NextResponse.json({ isAuthenticated: false }, { status: 500 });
  }

  if (!BACKEND) {
    console.error("❌ No valid BACKEND_URL in .env");
    return NextResponse.json({ isAuthenticated: false }, { status: 500 });
  }

  const verifyLocalToken = (token: string) => {
    try {
      const decoded = jwt.decode(token) as { exp: number, sub: string, username: string, email: string } | null;
      if (!decoded || !decoded.exp) {
        return null;
      }
      if (decoded.exp * 1000 < Date.now()) {
        console.warn('Access token expired');
        return null;
      }
      const verified = jwt.verify(token, JWT_SECRET) as any;
      return verified;
    } catch (e) {
      console.error('Ошибка проверки токена:', e);
      return null;
    }
  };

  if (accessToken) {
    const decoded = verifyLocalToken(accessToken);
    if (decoded) {
      return NextResponse.json({
        isAuthenticated: true,
      });
    }
  }

  if (refreshToken) {
    try {
      const refreshResponse = await axios.get(`${BACKEND}/auth/check`, {
        headers: {
          Cookie: `refreshToken=${refreshToken}`,
        },
        withCredentials: true,
      });
      const newAccessToken = refreshResponse.data.accessToken;
      if (newAccessToken) {
        const decoded = verifyLocalToken(newAccessToken);
        if (decoded) {
          const res = NextResponse.json({
            isAuthenticated: true,
          });
          res.cookies.set('accessToken', newAccessToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 60, 
          });
          return res;
        }
      }
    } catch (error) {
      console.error('Ошибка обновления токена через refreshToken:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        const res = NextResponse.json({ isAuthenticated: false }, { status: 401 });
        res.cookies.set('refreshToken', '', {
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          expires: 0,
        });
        res.cookies.set('accessToken', '', {
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          expires: 0,
        });
        return res;
      }
    }
  }
  return NextResponse.json({ isAuthenticated: false }, { status: 401 });
}