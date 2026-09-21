export const createSyncQueue = () => {
  const queue = [];
  return {
    enqueue(operation) {
      if (!operation || !operation.type) throw new Error('Sync operations require a type.');
      queue.push({ ...operation, queuedAt: new Date().toISOString() });
    },
    pending() {
      return [...queue];
    },
    drain() {
      const operations = queue.splice(0);
      return operations;
    },
  };
};
