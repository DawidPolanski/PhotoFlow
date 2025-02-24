import { create } from "zustand";

interface Store {
  query: string;
  setQuery: (query: string) => void;
}

export const useStore = create<Store>((set) => ({
  query: "",
  setQuery: (query) => set({ query }),
}));

interface RateLimitState {
  limit: number | null;
  remaining: number | null;
  resetTime: number | null;
  setLimit: (limit: number | null) => void;
  setRemaining: (remaining: number | null) => void;
  setResetTime: (resetTime: number | null) => void;
}

const useRateLimitStore = create<RateLimitState>((set) => ({
  limit: null,
  remaining: null,
  resetTime: null,
  setLimit: (limit) => set({ limit }),
  setRemaining: (remaining) => set({ remaining }),
  setResetTime: (resetTime) => set({ resetTime }),
}));

export default useRateLimitStore;
