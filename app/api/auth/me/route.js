import { NextResponse } from 'next/server';
import { getCustomerDetails } from '@/lib/shopify';

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
    const customer = await getCustomerDetails(accessToken);
    if (!customer) {
      return NextResponse.json({ error: 'Invalid or expired session.' }, { status: 401 });
    }
    return NextResponse.json({ customer });
  } catch (err) {
    console.error('Customer profile fetch failed:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to load profile.' },
      { status: 500 }
    );
  }
}
