import { AxiosResponse } from "axios";
import useRateLimitStore from "../store/useStore";

export const checkRateLimit = (): boolean => {
  const { remaining, resetTime } = useRateLimitStore.getState();

  if (remaining === null) {
    return true;
  }

  const now = Date.now();
  if (resetTime !== null && now >= resetTime) {
    useRateLimitStore.setState({ remaining: 1 });
    return true;
  }

  if (remaining <= 0) {
    return false;
  }

  return true;
};

export const updateRateLimit = (response: AxiosResponse) => {
  const limitHeader = response.headers["x-ratelimit-limit"];
  const remainingHeader = response.headers["x-ratelimit-remaining"];
  const resetTimeHeader = response.headers["x-ratelimit-reset"];

  const limit = limitHeader ? parseInt(limitHeader, 10) : null;
  const remaining = remainingHeader ? parseInt(remainingHeader, 10) : null;
  const resetTime = resetTimeHeader
    ? parseInt(resetTimeHeader, 10) * 1000
    : null;

  useRateLimitStore.getState().setLimit(limit);
  useRateLimitStore.getState().setRemaining(remaining);
  useRateLimitStore.getState().setResetTime(resetTime);
};

export const getRemainingRequests = (): number | null => {
  const { remaining } = useRateLimitStore.getState();
  return remaining;
};

export const getResetTime = (): number | null => {
  const { resetTime } = useRateLimitStore.getState();
  return resetTime;
};
