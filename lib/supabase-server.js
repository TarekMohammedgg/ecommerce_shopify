import { createClient } from '@supabase/supabase-js';
import ws from 'ws';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(
    'Missing Supabase server env vars. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local'
  );
}

// Server-only client. The service role key bypasses RLS — never import this from a Client Component.
// Node 20 has no native WebSocket, so we pass `ws` as the realtime transport.
export const supabaseServer = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
  realtime: { transport: ws },
});
