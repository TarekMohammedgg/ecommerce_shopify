import { NextResponse } from 'next/server';
import { logoutCustomer } from '@/lib/shopify';

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { accessToken } = body;
  if (!accessToken) {
    return NextResponse.json({ error: 'Missing access token.' }, { status: 400 });
  }

  try {
    await logoutCustomer(accessToken);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.warn('Customer logout failed:', err);
    return NextResponse.json({ success: true });
  }
}
