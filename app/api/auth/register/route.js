import { NextResponse } from 'next/server';
import { loginCustomer, registerCustomer } from '@/lib/shopify';

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { email, password, firstName, lastName } = body;
  if (!email || !password || !firstName || !lastName) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  try {
    const registerResponse = await registerCustomer(email, password, firstName, lastName);

    if (registerResponse?.customer?.id) {
      const loginResponse = await loginCustomer(email, password);
      const accessToken = loginResponse?.customerAccessToken?.accessToken;
      if (accessToken) {
        return NextResponse.json({ accessToken, email });
      }
      return NextResponse.json({
        created: true,
        message: 'Account created. Please sign in.',
      });
    }

    const errors = registerResponse?.customerUserErrors || [];
    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 422 });
    }

    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 422 }
    );
  } catch (err) {
    console.error('Customer registration failed:', err);
    return NextResponse.json(
      { error: err.message || 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
