import { NextResponse } from 'next/server';

const BACKEND = process.env.BACKEND_URL;

// Create Order
export async function POST(request: Request) {
  if (!BACKEND) {
    return NextResponse.json({ error: 'No backend url' }, { status: 500 });
  }
  try {
    const body = await request.json();
    const res = await fetch(`${BACKEND}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Get All Orders
export async function GET(request: Request) {
  if (!BACKEND) {
    return NextResponse.json({ error: 'No backend url' }, { status: 500 });
  }
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') ?? '1';
  const limit = searchParams.get('limit') ?? '10';

  try {
    const res = await fetch(`${BACKEND}/orders?page=${page}&limit=${limit}`);
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}