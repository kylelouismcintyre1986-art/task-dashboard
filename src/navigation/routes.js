/**
 * Web-compatible route registry. The same route IDs can be mapped to Expo
 * Router file routes when this project is migrated to a native Expo shell.
 */
export const appRoutes = Object.freeze([
  { id: 'overview', path: '/', label: 'Overview' },
  { id: 'batches', path: '/batches', label: 'Batches' },
  { id: 'recipes', path: '/recipes', label: 'Recipes' },
  { id: 'beer', path: '/recipes/beer', label: 'Beer making' },
  { id: 'wine', path: '/recipes/wine', label: 'Wine making' },
  { id: 'timers', path: '/timers', label: 'Timers' },
]);

export const routeFor = (id) => appRoutes.find((route) => route.id === id) || appRoutes[0];
