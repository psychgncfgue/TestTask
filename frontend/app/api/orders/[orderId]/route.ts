import { NextResponse } from 'next/server';

const BACKEND = process.env.BACKEND_URL;

// Get Order
export async function GET(request: Request, { params }: { params: { orderId: string } }) {
  if (!BACKEND) {
    return NextResponse.json({ error: 'No backend url' }, { status: 500 });
  }
  const { orderId } = params;
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') ?? 'all';
  const page = searchParams.get('page') ?? '1';
  const limit = searchParams.get('limit') ?? '10';

  try {
    const res = await fetch(`${BACKEND}/orders/${orderId}?type=${type}&page=${page}&limit=${limit}`);
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Delete Order
export async function DELETE(_: Request, { params }: { params: { orderId: string } }) {
  if (!BACKEND) {
    return NextResponse.json({ error: 'No backend url' }, { status: 500 });
  }
  const { orderId } = params;

  try {
    const res = await fetch(`${BACKEND}/orders/${orderId}`, { method: 'DELETE' });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}