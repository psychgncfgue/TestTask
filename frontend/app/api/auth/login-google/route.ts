import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import type { AuthPayload } from "../../../types/auth";

const BACKEND = process.env.BACKEND_URL;

export async function POST(req: NextRequest) {
  const body: AuthPayload = await req.json();

  if (!BACKEND) {
      console.error("❌ No valid BACKEND_URL in .env");
      return NextResponse.json({ isAuthenticated: false }, { status: 500 });
  }

  try {
    const response = await axios.post(`${BACKEND}/auth/oauth/google`, body, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const cookies = response.headers["set-cookie"];
    const userData = response.data;
    console.warn(userData)
    const headers: HeadersInit = new Headers();
    cookies?.forEach((cookieStr: string) => {
      headers.append('Set-Cookie', cookieStr);
    });

    return new NextResponse(JSON.stringify({
      success: true,
      data: userData,
    }), { headers });

  } catch (error: any) {
    console.error("OAuth login error:", error?.response?.data);

    return new NextResponse(JSON.stringify({
      success: false,
      message: error?.response?.data || "Ошибка OAuth авторизации",
    }), { status: 500 });
  }
}