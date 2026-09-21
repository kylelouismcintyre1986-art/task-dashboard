export const validateYieldInput = (input) => {
  const errors = {};
  if (!Number.isFinite(Number(input.volumeLitres)) || Number(input.volumeLitres) <= 0) errors.volumeLitres = 'Volume must be greater than zero.';
  if (!Number.isFinite(Number(input.startingAbv)) || Number(input.startingAbv) <= 0 || Number(input.startingAbv) > 30) errors.startingAbv = 'Starting ABV must be between 0 and 30%.';
  if (!Number.isFinite(Number(input.targetAbv)) || Number(input.targetAbv) <= 0 || Number(input.targetAbv) > 96) errors.targetAbv = 'Target ABV must be between 0 and 96%.';
  return errors;
};

export const predictYield = async (input) => {
  const errors = validateYieldInput(input);
  if (Object.keys(errors).length) {
    const error = new Error('Yield prediction input is invalid.');
    error.details = errors;
    throw error;
  }
  if (!import.meta.env.VITE_YIELD_API_URL) {
    throw new Error('AI yield prediction is not configured. Set VITE_YIELD_API_URL to enable it.');
  }
  const response = await fetch(import.meta.env.VITE_YIELD_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!response.ok) throw new Error(`Yield prediction failed (${response.status}).`);
  return response.json();
};
