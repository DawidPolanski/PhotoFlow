import { InternalAxiosRequestConfig } from "axios";
import { checkRateLimit } from "../utils/rateLimitUtils";

export const rateLimitMiddleware = (config: InternalAxiosRequestConfig) => {
  if (checkRateLimit()) {
    return config;
  } else {
    throw new Error("Limit requestów wyczerpany. Poczekaj do resetu.");
  }
};
