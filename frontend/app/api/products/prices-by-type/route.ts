import { NextResponse } from 'next/server';

const BACKEND = process.env.BACKEND_URL;

export async function GET() {
  if (!BACKEND) {
    console.error('❌ No valid BACKEND_URL in .env');
    return NextResponse.json({ error: 'No backend url' }, { status: 500 });
  }

  try {
    const backendUrl = `${BACKEND}/products/prices-by-type`;
    const res = await fetch(backendUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch prices by type from backend' },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Error fetching prices by type:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}