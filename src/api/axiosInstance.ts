import axios from "axios";
import { cacheMiddleware, cacheResponseMiddleware } from "./cacheMiddleware";
import { rateLimitMiddleware } from "./rateLimitMiddleware";

const axiosInstance = axios.create({
  baseURL: "https://api.unsplash.com",
  params: {
    client_id: import.meta.env.VITE_UNSPLASH_ACCESS_KEY,
  },
});

axiosInstance.interceptors.request.use(cacheMiddleware);
axiosInstance.interceptors.request.use(rateLimitMiddleware);
axiosInstance.interceptors.response.use(cacheResponseMiddleware);

export default axiosInstance;
