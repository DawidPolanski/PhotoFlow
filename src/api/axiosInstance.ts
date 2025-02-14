import axios from "axios";
import {
  rateLimitMiddleware,
  rateLimitResponseMiddleware,
} from "./rateLimitMiddleware";

export const axiosInstance = axios.create({
  baseURL: "https://api.unsplash.com",
  headers: {
    Authorization: `Client-ID ${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}`,
  },
});

axiosInstance.interceptors.request.use(rateLimitMiddleware);
axiosInstance.interceptors.response.use(rateLimitResponseMiddleware);

export default axiosInstance;
