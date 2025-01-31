import axiosInstance from "./axiosInstance";
import { updateRateLimit } from "../utils/rateLimitUtils";
import { getCache, cacheData } from "../utils/cacheUtils";

export const fetchPhotos = async (query: string, page = 1) => {
  const cacheKey = `photos_${query}_page_${page}`;
  const cachedPhotos = getCache(cacheKey);

  if (cachedPhotos) {
    console.log("Dane pobrane z cache");
    return cachedPhotos;
  }

  try {
    const response = await axiosInstance.get("/search/photos", {
      params: {
        query: query || "default",
        page,
        per_page: 30,
      },
    });

    updateRateLimit(response);
    console.log("Dane pobrane z API:", response.data.results);

    cacheData(cacheKey, response.data.results);

    return response.data.results;
  } catch (error) {
    console.error("Błąd podczas pobierania zdjęć:", error);
    return [];
  }
};
