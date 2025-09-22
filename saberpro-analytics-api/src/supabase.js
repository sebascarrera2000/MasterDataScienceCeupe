// src/supabase.js
import { createClient } from '@supabase/supabase-js';

const { SUPABASE_URL, SUPABASE_ANON_KEY } = process.env;

export const supabase =
  SUPABASE_URL && SUPABASE_ANON_KEY
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

export function needDB(res) {
  if (!supabase) {
    res.status(503).json({ error: 'BD no configurada (SUPABASE_URL/SUPABASE_ANON_KEY)' });
    return true;
  }
  return false;
}
