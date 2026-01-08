const cache = new Map();

export const getCache = (key) => {
  const cached = cache.get(key);
  if (!cached) return null;

  const { data, expiresAt } = cached;

  // expire check
  if (Date.now() > expiresAt) {
    cache.delete(key);
    return null;
  }

  return data;
};

export const setCache = (key, data, ttlSeconds = 3600) => {
  cache.set(key, {
    data,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
};
