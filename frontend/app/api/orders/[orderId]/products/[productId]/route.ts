import { NextResponse } from 'next/server';

const BACKEND = process.env.BACKEND_URL;

interface Params {
  params: {
    orderId: string;
    productId: string;
  };
}

// Remove Product
export async function DELETE(_: Request, { params }: Params) {
  const { orderId, productId } = await params;

  if (!BACKEND) {
    console.error("❌ No valid BACKEND_URL in .env");
    return NextResponse.json({ error: 'No backend url' }, { status: 500 });
  }

  try {
    const res = await fetch(`${BACKEND}/orders/${orderId}/products/${productId}`, { method: 'DELETE' });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}