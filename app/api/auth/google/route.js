import { NextResponse } from 'next/server';
import { syncGoogleCustomerWithShopify } from '@/lib/google-shopify-sync';

const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo';

/**
 * POST /api/auth/google
 * Body: { code?: string, credential?: string, accessToken?: string }
 *
 * Verifies Google OAuth server-side (auth-code preferred), then login-or-registers
 * the customer in Shopify. Requires GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET for code flow.
 */
export async function POST(request) {
  const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId) {
    return NextResponse.json(
      { error: 'Google OAuth is not configured.' },
      { status: 503 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { code, credential, accessToken } = body;

  let email;
  let profile = {};

  try {
    if (code) {
      if (!clientSecret) {
        return NextResponse.json(
          { error: 'GOOGLE_CLIENT_SECRET is required for Google sign-in.' },
          { status: 503 }
        );
      }
      const tokens = await exchangeAuthCode(code, clientId, clientSecret);
      const tokenInfo = await verifyAccessToken(tokens.access_token, clientId);
      email = tokenInfo.email;
      const userInfo = await fetchGoogleUserInfo(tokens.access_token);
      profile = {
        name: userInfo.name,
        given_name: userInfo.given_name,
        family_name: userInfo.family_name,
      };
    } else if (credential) {
      const payload = await verifyIdToken(credential, clientId);
      email = payload.email;
      profile = {
        name: payload.name,
        given_name: payload.given_name,
        family_name: payload.family_name,
      };
    } else if (accessToken) {
      const tokenInfo = await verifyAccessToken(accessToken, clientId);
      email = tokenInfo.email;
      const userInfo = await fetchGoogleUserInfo(accessToken);
      profile = {
        name: userInfo.name,
        given_name: userInfo.given_name,
        family_name: userInfo.family_name,
      };
    } else {
      return NextResponse.json(
        { error: 'Missing Google credential or accessToken.' },
        { status: 400 }
      );
    }
  } catch (err) {
    console.error('Google token verification failed:', err);
    return NextResponse.json({ error: 'Google authentication failed.' }, { status: 401 });
  }

  if (!email) {
    return NextResponse.json(
      { error: 'Google account did not provide an email address.' },
      { status: 400 }
    );
  }

  const result = await syncGoogleCustomerWithShopify(email, profile);

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 422 });
  }

  return NextResponse.json({
    accessToken: result.accessToken,
    email,
  });
}

async function exchangeAuthCode(code, clientId, clientSecret) {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: 'postmessage',
      grant_type: 'authorization_code',
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error_description || err.error || 'Code exchange failed');
  }
  return res.json();
}

async function verifyIdToken(idToken, clientId) {
  const res = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`
  );
  if (!res.ok) {
    throw new Error('Invalid ID token');
  }
  const payload = await res.json();
  if (payload.aud !== clientId) {
    throw new Error('Token audience mismatch');
  }
  if (payload.email_verified !== 'true' && payload.email_verified !== true) {
    throw new Error('Email not verified');
  }
  return payload;
}

async function verifyAccessToken(accessToken, clientId) {
  const res = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?access_token=${encodeURIComponent(accessToken)}`
  );
  if (!res.ok) {
    throw new Error('Invalid access token');
  }
  const payload = await res.json();
  const audience = payload.azp || payload.aud;
  if (audience !== clientId) {
    throw new Error('Token audience mismatch');
  }
  return payload;
}

async function fetchGoogleUserInfo(accessToken) {
  const res = await fetch(GOOGLE_USERINFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    throw new Error('Invalid access token');
  }
  return res.json();
}
