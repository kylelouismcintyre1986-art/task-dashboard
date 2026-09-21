import { isSupabaseConfigured } from './supabaseClient';

export const subscribeToBatchChanges = (batchId, onChange) => {
  if (!isSupabaseConfigured()) throw new Error('Supabase is not configured; realtime subscriptions are unavailable.');
  if (typeof WebSocket === 'undefined') throw new Error('Realtime subscriptions require WebSocket support.');
  const socket = new WebSocket(`${import.meta.env.VITE_SUPABASE_REALTIME_URL || import.meta.env.VITE_SUPABASE_URL}/realtime/v1/websocket`);
  socket.addEventListener('message', (event) => {
    const payload = JSON.parse(event.data);
    if (payload?.record?.batch_id === batchId) onChange(payload);
  });
  return () => socket.close();
};
