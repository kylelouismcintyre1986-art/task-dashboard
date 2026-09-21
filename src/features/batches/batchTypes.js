/**
 * @typedef {'Fermentation'|'Distillation'|'Aging'} BatchProcess
 * @typedef {'Draft'|'Active'|'Resting'|'Complete'} BatchStatus
 * @typedef {{
 *   id: string,
 *   name: string,
 *   process: BatchProcess,
 *   status: BatchStatus,
 *   volumeLitres: number,
 *   originalGravity: number|null,
 *   finalGravity: number|null,
 *   temperatureF: number|null,
 *   notes: string,
 *   createdAt: string,
 *   updatedAt: string
 * }} Batch
 */

export const BATCH_STORAGE_KEY = 'fermentationlab-pro:batches';

export const createBatchDraft = (input = {}) => ({
  name: String(input.name || '').trim(),
  process: input.process || 'Fermentation',
  volumeLitres: Number(input.volumeLitres || 0),
  notes: String(input.notes || '').trim(),
});
