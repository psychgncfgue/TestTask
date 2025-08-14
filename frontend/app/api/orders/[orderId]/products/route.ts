import { NextResponse } from 'next/server';

const BACKEND = process.env.BACKEND_URL;

// Add Products
export async function POST(request: Request, { params }: { params: { orderId: string } }) {
  if (!BACKEND) {
    return NextResponse.json({ error: 'No backend url' }, { status: 500 });
  }
  const { orderId } = params;
  const body = await request.json();

  try {
    const res = await fetch(`${BACKEND}/orders/${orderId}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}