export const validateBatchDraft = (draft) => {
  const errors = {};
  if (!draft.name || draft.name.length < 2) errors.name = 'Give this batch a name.';
  if (!['Fermentation', 'Distillation', 'Aging'].includes(draft.process)) errors.process = 'Choose a supported process.';
  if (!Number.isFinite(draft.volumeLitres) || draft.volumeLitres <= 0) errors.volumeLitres = 'Volume must be greater than zero.';
  if (draft.volumeLitres > 100000) errors.volumeLitres = 'Volume is outside the supported range.';
  return errors;
};

export const isValidBatchDraft = (draft) => Object.keys(validateBatchDraft(draft)).length === 0;
