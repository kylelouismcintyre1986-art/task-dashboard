const getConfig = () => ({
  url: import.meta.env.VITE_SUPABASE_URL,
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
});

export const isSupabaseConfigured = () => {
  const { url, anonKey } = getConfig();
  return Boolean(url && anonKey);
};

export const supabaseRequest = async (path, options = {}) => {
  const { url, anonKey } = getConfig();
  if (!url || !anonKey) {
    throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  if (!response.ok) throw new Error(`Supabase request failed (${response.status}).`);
  return response.status === 204 ? null : response.json();
};
