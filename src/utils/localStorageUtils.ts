export const cacheData = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getCache = (key: string) => {
  const cachedData = localStorage.getItem(key);
  return cachedData ? JSON.parse(cachedData) : null;
};
