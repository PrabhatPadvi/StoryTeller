import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vtocahxqnhqmkcnkgcyr.supabase.co';

const supabasePublishableKey =
  'sb_publishable_JRY8CYmQXvAhg0It0OtwqQ_4RGnlzFd';

export const supabase: SupabaseClient = createClient(
  supabaseUrl,
  supabasePublishableKey
);
