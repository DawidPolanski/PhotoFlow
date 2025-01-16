import { AxiosResponse, InternalAxiosRequestConfig } from "axios";

export const cacheData = (key: string, data: any) => {
  try {
    if (localStorage.length >= 100) {
      const firstKey = localStorage.key(0);
      if (firstKey) {
        localStorage.removeItem(firstKey);
        console.log(`Usunięto najstarszy klucz: ${firstKey}`);
      }
    }

    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    if (e.name === "QuotaExceededError") {
      console.error("Przekroczono limit przestrzeni w localStorage");
    }
  }
};

export const getCache = (key: string) => {
  const cachedData = localStorage.getItem(key);
  return cachedData ? JSON.parse(cachedData) : null;
};

export const cacheMiddleware = (config: InternalAxiosRequestConfig) => {
  const cacheKey = `${config.method}_${config.url}`;
  const cachedResponse = getCache(cacheKey);

  if (cachedResponse) {
    console.log(`[CACHE] Dane dla ${cacheKey} pobrane z cache`);
    return Promise.resolve({ ...cachedResponse, fromCache: true });
  }

  return config;
};

export const cacheResponseMiddleware = (response: AxiosResponse) => {
  const cacheKey = `${response.config.method}_${response.config.url}`;
  cacheData(cacheKey, response);
  console.log(`[CACHE] Dane dla ${cacheKey} zapisane w cache`);
  return response;
};
