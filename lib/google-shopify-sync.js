import { loginCustomer, registerCustomer } from '@/lib/shopify';

/** Deterministic password for Google-linked Shopify accounts (same as legacy fake flow). */
export function googleSecurePassword(email) {
  const localPart = email.split('@')[0];
  return `GAuth_${localPart}_NeoMirai2026!`;
}

export function parseGoogleProfile({ name, given_name, family_name }) {
  if (given_name) {
    return {
      firstName: given_name,
      lastName: family_name || 'User',
    };
  }
  const names = (name || '').trim().split(/\s+/).filter(Boolean);
  return {
    firstName: names[0] || 'Google',
    lastName: names.length > 1 ? names.slice(1).join(' ') : 'User',
  };
}

/**
 * Login or auto-register a Shopify customer for a verified Google email.
 * @returns {{ accessToken: string } | { error: string }}
 */
export async function syncGoogleCustomerWithShopify(email, profile) {
  const password = googleSecurePassword(email);
  const { firstName, lastName } = parseGoogleProfile(profile);

  let loginRes = await loginCustomer(email, password);

  if (loginRes?.customerAccessToken?.accessToken) {
    return { accessToken: loginRes.customerAccessToken.accessToken };
  }

  const registerRes = await registerCustomer(email, password, firstName, lastName);
  const taken = registerRes?.customerUserErrors?.some((e) => e.code === 'TAKEN');

  if (registerRes?.customer?.id || taken) {
    loginRes = await loginCustomer(email, password);
    if (loginRes?.customerAccessToken?.accessToken) {
      return { accessToken: loginRes.customerAccessToken.accessToken };
    }
  }

  const errMsg =
    registerRes?.customerUserErrors?.[0]?.message ||
    loginRes?.customerUserErrors?.[0]?.message ||
    'Google account sync with Shopify failed.';
  return { error: errMsg };
}
