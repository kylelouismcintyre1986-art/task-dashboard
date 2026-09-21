import { supabaseRequest } from './supabaseClient';

export const listRemoteBatches = () => supabaseRequest('batches?select=*&order=created_at.desc');

export const saveRemoteBatch = (batch) => supabaseRequest('batches', {
  method: 'POST',
  headers: { Prefer: 'return=representation' },
  body: JSON.stringify({
    id: batch.id,
    name: batch.name,
    process: batch.process,
    status: batch.status,
    volume_litres: batch.volumeLitres,
    notes: batch.notes,
    created_at: batch.createdAt,
    updated_at: batch.updatedAt,
  }),
});
