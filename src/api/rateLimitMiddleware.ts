import { InternalAxiosRequestConfig, AxiosResponse } from "axios";
import useRateLimitStore from "../store/useStore";
  checkRateLimit,
  updateRateLimit,
  getRemainingRequests,
} from "../utils/rateLimitUtils";

export const rateLimitMiddleware = (config: InternalAxiosRequestConfig) => {
  if (checkRateLimit()) {
    return config;
  } else {
    throw new Error("Limit requestów wyczerpany. Poczekaj do resetu.");
  }
};

export const rateLimitResponseMiddleware = (response: AxiosResponse) => {
  updateRateLimit(response);
  const remainingRequests = getRemainingRequests();

  if (remainingRequests !== null && remainingRequests <= 0) {
    return Promise.reject(
      new Error("Limit requestów wyczerpany. Poczekaj do resetu.")
    );
  }

  return response;
};
