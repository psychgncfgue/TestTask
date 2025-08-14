import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

const BACKEND = process.env.BACKEND_URL;

export async function GET(req: NextRequest) {
  const cookie = req.headers.get('cookie') ?? ''

  if (!BACKEND) {
      console.error("❌ No valid BACKEND_URL in .env");
      return NextResponse.json({ isAuthenticated: false }, { status: 500 });
  }

  try {
    const { data: user } = await axios.get(
      `${BACKEND}/auth/me`,
      {
        headers: { Cookie: cookie },
        withCredentials: true,
      }
    )
    return NextResponse.json({ user })
  } catch (e) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}