import { supabaseServer } from '@/lib/supabase-server';

const VALID_TYPES = ['clothes&fashion', 'restaurant', 'other'];

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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

    const { data, error } = await supabaseServer
      .from('website_requests')
      .insert({
        business_name: businessName,
        business_type: businessType,
        contact_name: contactName,
        email,
        phone: phone || null,
        message: message || null,
      })
      .select('id')
      .single();

    if (error) {
      console.error('website-request supabase error:', error);
      return Response.json({ error: 'Failed to save request' }, { status: 500 });
    }

    return Response.json({ ok: true, id: data.id });
  } catch (err) {
    console.error('website-request error:', err);
    return Response.json({ error: 'Failed to save request' }, { status: 500 });
  }
}
