import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://kvzlzxhuufeaibiezytw.supabase.co';
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2emx6eGh1dWZlYWliaWV6eXR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyNzU4NTcsImV4cCI6MjA5NDg1MTg1N30.dT1quEcbWCBB-oEj_659TBYMssCzA0MVaXdJVetc8Fg';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function cloudSync(userId, payload) {
  const { error } = await supabase.from('user_financial_states').upsert({
    user_id: userId,
    payload,
    updated_at: new Date().toISOString(),
  });
  return !error;
}

export async function cloudFetch(userId) {
  const { data, error } = await supabase
    .from('user_financial_states')
    .select('payload')
    .eq('user_id', userId)
    .maybeSingle();
  if (error || !data) return null;
  return data.payload;
}
