export const scaleRecipe = (ingredients, fromLitres, toLitres) => {
  if (!Number.isFinite(fromLitres) || fromLitres <= 0 || !Number.isFinite(toLitres) || toLitres <= 0) {
    throw new Error('Recipe volumes must be greater than zero.');
  }
  const factor = toLitres / fromLitres;
  return ingredients.map((ingredient) => ({ ...ingredient, amount: Number((ingredient.amount * factor).toFixed(3)) }));
};

export const calculateAbv = (originalGravity, finalGravity) => {
  const og = Number(originalGravity);
  const fg = Number(finalGravity);
  if (!Number.isFinite(og) || !Number.isFinite(fg) || og <= fg) return null;
  return Number(((og - fg) * 131.25).toFixed(2));
};

export const calculateYield = ({ volumeLitres, startingAbv, targetAbv, lossPercent = 0 }) => {
  const volume = Number(volumeLitres);
  const starting = Number(startingAbv);
  const target = Number(targetAbv);
  if (![volume, starting, target].every(Number.isFinite) || volume <= 0 || starting <= 0 || target <= 0) {
    throw new Error('Yield inputs must be positive numbers.');
  }
  return Number((volume * starting / target * (1 - Number(lossPercent) / 100)).toFixed(2));
};

export const calculateWaterAddition = (volumeLitres, currentPpm, targetPpm) => {
  const volume = Number(volumeLitres);
  if (!Number.isFinite(volume) || volume <= 0 || !Number.isFinite(Number(currentPpm)) || !Number.isFinite(Number(targetPpm))) {
    throw new Error('Water calculation inputs are invalid.');
  }
  return Number((volume * Math.max(0, Number(targetPpm) - Number(currentPpm)) / 100).toFixed(2));
};
