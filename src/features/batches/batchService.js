import { batchRepository } from './batchRepository';
import { createBatchDraft } from './batchTypes';
import { validateBatchDraft } from './batchValidation';

export const createBatch = (input) => {
  const draft = createBatchDraft(input);
  const errors = validateBatchDraft(draft);
  if (Object.keys(errors).length) {
    const error = new Error('Batch validation failed.');
    error.details = errors;
    throw error;
  }
  const now = new Date().toISOString();
  const batch = {
    id: crypto.randomUUID(),
    name: draft.name,
    process: draft.process,
    status: 'Draft',
    volumeLitres: draft.volumeLitres,
    originalGravity: null,
    finalGravity: null,
    temperatureF: null,
    notes: draft.notes,
    createdAt: now,
    updatedAt: now,
  };
  return batchRepository.save(batch);
};

export const listBatches = () => batchRepository.list();
