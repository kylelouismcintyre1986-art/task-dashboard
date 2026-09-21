export const dashboardData = { facilityHealth: 96, activeBatches: 17, agingBarrels: 263, currentYield: 94.2, revenueForecast: 218650, yieldForecast: 182 };
export const batches = [
  { id: '218', name: 'Bourbon Mash #218', recipe: 'Bourbon Whiskey', status: 'fermenting', gravity: '1.031', temperature: '68°F', yield: '182 L', health: 'Healthy', updated: '8 min ago' },
  { id: '217', name: 'Wildflower Mead', recipe: 'Wildflower Mead', status: 'fermenting', gravity: '1.084', temperature: '72°F', yield: '96 L', health: 'Attention', updated: '12 min ago' },
  { id: '216', name: 'Apple Brandy', recipe: 'Apple Brandy', status: 'distilling', gravity: '1.012', temperature: '64°F', yield: '128 L', health: 'Healthy', updated: '1 hr ago' },
  { id: '215', name: 'Rye Reserve', recipe: 'Rye Whiskey', status: 'aging', gravity: '1.078', temperature: '61°F', yield: '155 L', health: 'Healthy', updated: '3 hr ago' },
];
export const recipes = [
  { id: 'bourbon-v2', name: 'Bourbon Whiskey', category: 'Whiskey', version: 2, batchSize: 200, og: '1.080', abv: '8.6%', yield: 182, confidence: 96, ingredients: [{ name: 'Corn', amount: 70, unit: 'kg' }, { name: 'Rye', amount: 15, unit: 'kg' }, { name: 'Malted Barley', amount: 15, unit: 'kg' }] },
  { id: 'mead-v1', name: 'Wildflower Mead', category: 'Mead', version: 1, batchSize: 120, og: '1.110', abv: '12.8%', yield: 96, confidence: 91, ingredients: [{ name: 'Wildflower Honey', amount: 45, unit: 'kg' }, { name: 'Water', amount: 86, unit: 'L' }] },
];
export const alerts = [
  { severity: 'warning', title: 'Tank F02 temperature high', message: '72°F is 4°F above the recipe target. Reduce temperature to 68°F.', time: '12 min ago' },
  { severity: 'info', title: 'Barrel BARREL-104 ready for tasting', message: '42 months in American Oak, char #4. Schedule the next sample.', time: '2 hr ago' },
  { severity: 'success', title: 'Batch 218 yield improved', message: 'Forecast is up 2.3% compared with the previous reading.', time: '4 hr ago' },
];
