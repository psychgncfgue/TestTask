import { NextResponse } from 'next/server';

const BACKEND = process.env.BACKEND_URL;

interface Params {
  params: {
    type: string;
    page: string;
  };
}

export async function GET(request: Request, { params }: Params) {
  const { type, page } = await params;

  if (!BACKEND) {
    console.error("❌ No valid BACKEND_URL in .env");
    return NextResponse.json({ error: 'No backend url' }, { status: 500 });
  }

  try {
    const limit = 10;

    const backendUrl = `${BACKEND}/products?page=${page}&limit=${limit}&type=${type}`;

    const res = await fetch(backendUrl);

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch products from backend' }, { status: res.status });
    }

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}