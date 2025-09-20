import { createClient } from '@supabase/supabase-js';

// Server-only client using Service Role key (bypasses RLS). NEVER expose to the browser.
export const supabaseAdmin = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
