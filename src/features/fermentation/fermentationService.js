export const analyzeFermentation = (readings) => {
  const ordered = [...readings].sort((a, b) => new Date(a.recordedAt) - new Date(b.recordedAt));
  if (ordered.length < 2) return { status: 'insufficient-data', recommendation: 'Log at least two readings to establish a trend.', curve: ordered };
  const latest = ordered[ordered.length - 1];
  const previous = ordered[ordered.length - 2];
  const gravityChange = Number(previous.gravity) - Number(latest.gravity);
  const stuck = gravityChange < 0.001 && ordered.length >= 3;
  const temperatureAlert = Number(latest.temperatureF) < 55 || Number(latest.temperatureF) > 80;
  return {
    status: stuck ? 'stuck' : temperatureAlert ? 'temperature-alert' : 'progressing',
    recommendation: stuck
      ? 'Gravity has barely moved. Verify temperature, yeast health, sanitation, and consult your recipe before intervening.'
      : temperatureAlert
        ? 'Temperature is outside the common fermentation monitoring range. Verify your yeast manufacturer guidance.'
        : 'Fermentation is progressing. Keep logging gravity and temperature until readings are stable.',
    curve: ordered.map((reading) => ({ date: reading.recordedAt, gravity: Number(reading.gravity), pH: Number(reading.pH), temperatureF: Number(reading.temperatureF) })),
  };
};

export const createFermentationReading = (input) => {
  const gravity = Number(input.gravity);
  const pH = Number(input.pH);
  const temperatureF = Number(input.temperatureF);
  if (![gravity, pH, temperatureF].every(Number.isFinite)) throw new Error('Gravity, pH, and temperature are required readings.');
  if (pH < 0 || pH > 14) throw new Error('pH must be between 0 and 14.');
  return { id: crypto.randomUUID(), gravity, pH, temperatureF, notes: String(input.notes || '').trim(), recordedAt: new Date().toISOString() };
};
