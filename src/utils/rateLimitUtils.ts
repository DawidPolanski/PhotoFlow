import { AxiosResponse } from "axios";

let remainingRequests = 50;
let resetTime = Date.now() + 3600 * 1000;

export const checkRateLimit = () => {
  if (remainingRequests <= 0 && Date.now() < resetTime) {
    return false;
  }
  return true;
};

export const updateRateLimit = (response: AxiosResponse) => {
  remainingRequests = parseInt(response.headers["x-ratelimit-remaining"], 10);
  resetTime = parseInt(response.headers["x-ratelimit-reset"], 10) * 1000;
};
