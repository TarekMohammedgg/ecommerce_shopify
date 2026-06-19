import { NextResponse } from 'next/server';
import { loginCustomer } from '@/lib/shopify';

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { email, password } = body;
  if (!email || !password) {
    return NextResponse.json({ error: 'Missing email or password.' }, { status: 400 });
  }

  try {
    const loginResponse = await loginCustomer(email, password);
    const accessToken = loginResponse?.customerAccessToken?.accessToken;

    if (accessToken) {
      return NextResponse.json({ accessToken, email });
    }

    const errors = loginResponse?.customerUserErrors || [];
    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 401 });
    }

    return NextResponse.json(
      { error: 'Invalid email or password.' },
      { status: 401 }
    );
  } catch (err) {
    console.error('Customer login failed:', err);
    return NextResponse.json(
      { error: err.message || 'Sign in failed. Please try again.' },
      { status: 500 }
    );
  }
}
