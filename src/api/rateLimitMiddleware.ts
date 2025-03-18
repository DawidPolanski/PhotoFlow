import { InternalAxiosRequestConfig, AxiosResponse } from "axios";
import {
  checkRateLimit,
  updateRateLimit,
  getRemainingRequests,
} from "../utils/rateLimitUtils";
export const rateLimitMiddleware = (config: InternalAxiosRequestConfig) => {
  console.log("rateLimitMiddleware: Sprawdzam limit requestów");
  if (checkRateLimit()) {
    console.log(
      "rateLimitMiddleware: Limit nie wyczerpany, pozwalam na request"
    );
    return config;
  } else {
    console.log("rateLimitMiddleware: Limit wyczerpany, blokuję request");
    throw new Error("Limit requestów wyczerpany. Poczekaj do resetu.");
  }
};

export const rateLimitResponseMiddleware = (response: AxiosResponse) => {
  console.log(
    "rateLimitResponseMiddleware: Aktualizuję limit na podstawie nagłówków"
  );
  updateRateLimit(response);
  const remainingRequests = getRemainingRequests();

  if (remainingRequests !== null && remainingRequests <= 0) {
    console.log(
      "rateLimitResponseMiddleware: Limit wyczerpany, odrzucam odpowiedź"
    );
    return Promise.reject(
      new Error("Limit requestów wyczerpany. Poczekaj do resetu.")
    );
  }

  console.log(
    "rateLimitResponseMiddleware: Limit nie wyczerpany, pozwalam na odpowiedź"
  );
  return response;
};
