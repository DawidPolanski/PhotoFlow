import { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { cacheData, getCache } from "../utils/cacheUtils";

export const cacheMiddleware = (config: InternalAxiosRequestConfig) => {
  const cacheKey = `${config.method}_${config.url}`;
  const cachedResponse = getCache(cacheKey);

  if (cachedResponse) {
    return Promise.reject({ data: cachedResponse, fromCache: true });
  }

  return config;
};

export const cacheResponseMiddleware = (response: AxiosResponse) => {
  const cacheKey = `${response.config.method}_${encodeURIComponent(
    response.config.url
  )}`;

  cacheData(cacheKey, response.data);
  return response;
};
