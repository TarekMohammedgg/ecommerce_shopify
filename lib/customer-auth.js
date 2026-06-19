async function postAuth(path, payload) {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
}

export async function registerCustomerAccount({ email, password, firstName, lastName }) {
  return postAuth('/api/auth/register', { email, password, firstName, lastName });
}

export async function loginCustomerAccount({ email, password }) {
  return postAuth('/api/auth/login', { email, password });
}

export async function fetchCustomerProfile(accessToken) {
  return postAuth('/api/auth/me', { accessToken });
}

export async function logoutCustomerSession(accessToken) {
  return postAuth('/api/auth/logout', { accessToken });
}
