export const createBatchQrPayload = (batch) => ({
  type: 'fermentationlab.batch',
  version: 1,
  batchId: batch.id,
  name: batch.name,
});

export const encodeBatchQr = (batch) => JSON.stringify(createBatchQrPayload(batch));

export const scanBatchQr = () => {
  throw new Error('QR camera scanning requires a native camera adapter; the web app exposes payload generation only.');
};
