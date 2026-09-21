import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
export const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: true, autoRefreshToken: true } }) : null;

export async function signInWithPassword(email, password) {
  if (!supabase) throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  return supabase.auth.signInWithPassword({ email, password });
}
export async function signOut() { return supabase ? supabase.auth.signOut() : { error: null }; }
export async function fetchTable(table, query = {}) {
  if (!supabase) return { data: null, error: new Error('Supabase is not configured.') };
  let request = supabase.from(table).select(query.select || '*');
  if (query.order) request = request.order(query.order, { ascending: query.ascending !== false });
  if (query.limit) request = request.limit(query.limit);
  return request;
}
