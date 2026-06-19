/**
 * Exchange a Google Identity Services credential (ID token) for a Shopify session.
 */
export async function exchangeGoogleCredential(credential) {
  const res = await fetch('/api/auth/google', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credential }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Google sign-in failed.');
  }
  return data;
}
