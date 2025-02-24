import axiosInstance from "./axiosInstance";
import { getCache, cacheData } from "../utils/cacheUtils";
import { checkRateLimit, updateRateLimit } from "../utils/rateLimitUtils";
import useRateLimitStore from "../store/useStore";

export const fetchPhotos = async (
  query: string,
  page = 1,
  collectionId?: string
) => {
  if (!query.trim() && !collectionId) {
    return [];
  }

  const cacheKey = collectionId
    ? `photos_collection_${collectionId}_page_${page}`
    : `photos_${query}_page_${page}`;
  const cachedPhotos = getCache(cacheKey);

  if (cachedPhotos) {
    return cachedPhotos;
  }

  if (!checkRateLimit()) {
    return [];
  }

  const url = collectionId
    ? `/collections/${collectionId}/photos`
    : "/search/photos";
  const params = {
    query: collectionId ? undefined : query || "default",
    page,
    per_page: 30,
  };

  try {
    const response = await axiosInstance.get(url, { params });
    updateRateLimit(response);
    const photos = response.data.results || response.data;
    cacheData(cacheKey, photos);
    return photos;
  } catch (error) {
    return [];
  }
};

export const fetchPhoto = async (id: string) => {
  const cacheKey = `photo_${id}`;
  const cachedPhoto = getCache(cacheKey);

  if (cachedPhoto) {
    return cachedPhoto;
  }

  if (!checkRateLimit()) {
    return null;
  }

  const url = `/photos/${id}`;

  try {
    const response = await axiosInstance.get(url);
    updateRateLimit(response);
    const photo = response.data;
    cacheData(cacheKey, photo);
    return photo;
  } catch (error) {
    return null;
  }
};

export const fetchTrendingPhotos = async (page = 1) => {
  const cacheKey = `trending_photos_page_${page}`;
  const cachedPhotos = getCache(cacheKey);

  if (cachedPhotos) {
    return cachedPhotos;
  }

  if (!checkRateLimit()) {
    return [];
  }

  const url = `/photos?page=${page}&per_page=30&order_by=popular`;

  try {
    const response = await axiosInstance.get(url);
    const photos = response.data;
    cacheData(cacheKey, photos);
    return photos;
  } catch (error) {
    return [];
  }
};

export const fetchCollections = async (page = 1, perPage = 10) => {
  const cacheKey = `collections_page_${page}_perPage_${perPage}`;
  const cachedCollections = getCache(cacheKey);

  if (cachedCollections) {
    return cachedCollections.filter(
      (collection) =>
        collection.user?.username !== "plus" &&
        !collection.cover_photo?.urls?.raw.includes("plus.unsplash.com") &&
        !collection.tags?.some((tag) =>
          tag.title.toLowerCase().includes("premium")
        )
    );
  }

  if (!checkRateLimit()) {
    return [];
  }

  const url = `/collections?page=${page}&per_page=${perPage}`;

  try {
    const response = await axiosInstance.get(url);
    const filteredCollections = response.data.filter(
      (collection) =>
        collection.user?.username !== "plus" &&
        !collection.cover_photo?.urls?.raw.includes("plus.unsplash.com") &&
        !collection.tags?.some((tag) =>
          tag.title.toLowerCase().includes("premium")
        )
    );

    cacheData(cacheKey, filteredCollections);

    return filteredCollections;
  } catch (error) {
    return [];
  }
};

export const useRequestCounter = () => {
  return useRateLimitStore((state) => state.remaining);
};
