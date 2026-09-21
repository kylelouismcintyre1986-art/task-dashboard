import { BATCH_STORAGE_KEY } from './batchTypes';

const readStoredBatches = () => {
  try {
    const stored = window.localStorage.getItem(BATCH_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    throw new Error(`Unable to read saved batches: ${error.message}`);
  }
};

const writeStoredBatches = (batches) => {
  try {
    window.localStorage.setItem(BATCH_STORAGE_KEY, JSON.stringify(batches));
  } catch (error) {
    throw new Error(`Unable to save batches: ${error.message}`);
  }
};

export const batchRepository = {
  list() {
    return readStoredBatches();
  },
  save(batch) {
    const batches = readStoredBatches().filter((item) => item.id !== batch.id);
    writeStoredBatches([batch, ...batches]);
    return batch;
  },
  remove(id) {
    writeStoredBatches(readStoredBatches().filter((batch) => batch.id !== id));
  },
};
