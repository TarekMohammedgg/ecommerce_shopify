import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const REQUESTS_FILE = path.join(DATA_DIR, 'website-requests.json');

const VALID_TYPES = ['fashion', 'restaurant', 'retail', 'other'];

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function appendRequest(entry) {
  await fs.mkdir(DATA_DIR, { recursive: true });

  let existing = [];
  try {
    const raw = await fs.readFile(REQUESTS_FILE, 'utf-8');
    existing = JSON.parse(raw);
  } catch {
    existing = [];
  }

  if (!Array.isArray(existing)) existing = [];

  existing.push(entry);
  await fs.writeFile(REQUESTS_FILE, JSON.stringify(existing, null, 2), 'utf-8');
}

export async function POST(request) {
  try {
    const body = await request.json();
    const businessName = String(body.businessName || '').trim();
    const businessType = String(body.businessType || '').trim();
    const contactName = String(body.contactName || '').trim();
    const email = String(body.email || '').trim();
    const phone = String(body.phone || '').trim();
    const message = String(body.message || '').trim();

    if (!businessName || !contactName || !email) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return Response.json({ error: 'Invalid email' }, { status: 400 });
    }

    if (!VALID_TYPES.includes(businessType)) {
      return Response.json({ error: 'Invalid business type' }, { status: 400 });
    }

    const entry = {
      id: crypto.randomUUID(),
      businessName,
      businessType,
      contactName,
      email,
      phone: phone || null,
      message: message || null,
      createdAt: new Date().toISOString(),
    };

    await appendRequest(entry);

    return Response.json({ ok: true, id: entry.id });
  } catch (err) {
    console.error('website-request error:', err);
    return Response.json({ error: 'Failed to save request' }, { status: 500 });
  }
}
