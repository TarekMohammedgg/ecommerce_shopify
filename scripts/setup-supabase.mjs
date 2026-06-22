import { createClient } from '@supabase/supabase-js';
import ws from 'ws';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
  realtime: { transport: ws },
});

const __dirname = dirname(fileURLToPath(import.meta.url));
const migrationPath = join(__dirname, '..', 'supabase', 'migrations', '0001_create_website_requests.sql');

const { data, error } = await supabase
  .from('website_requests')
  .select('id')
  .limit(1);

if (error) {
  const missing =
    error.code === '42P01' ||
    error.code === 'PGRST205' ||
    /relation .* does not exist/i.test(error.message) ||
    /Could not find the table/i.test(error.message);
  if (missing) {
    console.error('Table website_requests does not exist yet.');
    console.error('Run this SQL in the Supabase Dashboard -> SQL Editor:\n');
    console.error(readFileSync(migrationPath, 'utf-8'));
    process.exit(1);
  }
  console.error('Connection/verify failed:', error.code, error.message);
  process.exit(1);
}

console.log('website_requests table ready. Existing rows:', data.length);
