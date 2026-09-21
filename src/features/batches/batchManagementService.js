import { batchRepository } from './batchRepository';

const transitions = {
  Draft: ['Active'],
  Active: ['Resting', 'Complete'],
  Resting: ['Active', 'Complete'],
  Complete: [],
};

export const transitionBatch = (batch, nextStatus) => {
  if (!transitions[batch.status]?.includes(nextStatus)) throw new Error(`Cannot move a ${batch.status} batch to ${nextStatus}.`);
  const updated = { ...batch, status: nextStatus, updatedAt: new Date().toISOString() };
  return batchRepository.save(updated);
};

export const appendBatchNote = (batch, note) => {
  const text = String(note || '').trim();
  if (!text) throw new Error('A batch note cannot be empty.');
  return batchRepository.save({ ...batch, notes: [batch.notes, text].filter(Boolean).join('\n'), updatedAt: new Date().toISOString() });
};
