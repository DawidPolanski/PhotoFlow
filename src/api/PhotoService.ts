import axiosInstance from "./axiosInstance";
import { updateRateLimit } from "../utils/rateLimitUtils";
import { getCache, cacheData } from "../utils/cacheUtils";

export const fetchPhotos = async (
  query: string,
  page = 1,
  collectionId?: string
) => {
  const cacheKey = collectionId
    ? `photos_collection_${collectionId}_page_${page}`
    : `photos_${query}_page_${page}`;
  const cachedPhotos = getCache(cacheKey);

  if (cachedPhotos) {
    console.log("Dane pobrane z cache");
    return cachedPhotos;
  }

  try {
    const url = collectionId
      ? `/collections/${collectionId}/photos`
      : "/search/photos";
    const params = {
      query: collectionId ? undefined : query || "default",
      page,
      per_page: 30,
    };

    console.log("API Request URL:", url);
    console.log("API Request Params:", params);

    const response = await axiosInstance.get(url, { params });

    updateRateLimit(response);
    console.log("Dane pobrane z API:", response.data);

    const photos = collectionId ? response.data : response.data.results;

    if (!photos || photos.length === 0) {
      console.warn("No photos found for the given query or collection.");
      return [];
    }

    cacheData(cacheKey, photos);

    return photos;
  } catch (error) {
    console.error("Błąd podczas pobierania zdjęć:", error);
    return [];
  }
};
