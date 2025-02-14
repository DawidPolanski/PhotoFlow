import { AxiosResponse } from "axios";

let remainingRequests: number | null = null;
let resetTime: number | null = null;

export const checkRateLimit = (): boolean => {
  if (remainingRequests === null) {
    return true;
  }

  const now = Date.now();
  if (resetTime !== null && now >= resetTime) {
    remainingRequests = 50;
  }

  if (remainingRequests <= 1) {
    return false;
  }

  return true;
};

export const updateRateLimit = (response: AxiosResponse) => {
  const remainingRequestsHeader = response.headers["x-ratelimit-remaining"];
  remainingRequests = parseInt(remainingRequestsHeader, 10);

  const now = new Date();
  const minutesToNextHour = 60 - now.getMinutes();
  resetTime = now.getTime() + minutesToNextHour * 60 * 1000;
};

export const getRemainingRequests = (): number | null => remainingRequests;

export const getResetTime = (): number | null => resetTime;
