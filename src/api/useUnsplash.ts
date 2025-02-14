import axiosInstance from "./axiosInstance";
import { getCache, cacheData } from "../utils/cacheUtils";
import { checkRateLimit } from "../utils/rateLimitUtils";

export const fetchPhotos = async (
  query: string,
  page = 1,
  collectionId?: string
) => {
  if (!query.trim() && !collectionId) {
    console.log("Brak zapytania lub ID kolekcji – nie pobieramy zdjęć.");
    return [];
  }

  const cacheKey = collectionId
    ? `photos_collection_${collectionId}_page_${page}`
    : `photos_${query}_page_${page}`;
  const cachedPhotos = getCache(cacheKey);

  if (cachedPhotos) {
    console.log("Dane pobrane z cache");
    return cachedPhotos;
  }

  if (!checkRateLimit()) {
    console.log("Limit requestów wyczerpany. Poczekaj do resetu.");
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

    const photos = response.data.results || response.data;

    console.log("Dane pobrane z API:", photos);
    cacheData(cacheKey, photos);

    return photos;
  } catch (error) {
    console.error("Błąd podczas pobierania zdjęć:", error);
    return [];
  }
};

/**
 * Pobiera pojedyncze zdjęcie na podstawie jego ID.
 */
export const fetchPhoto = async (id: string) => {
  const cacheKey = `photo_${id}`;
  const cachedPhoto = getCache(cacheKey);

  if (cachedPhoto) {
    return cachedPhoto;
  }

  if (!checkRateLimit()) {
    console.log("Limit requestów wyczerpany. Poczekaj do resetu.");
    return null;
  }

  const url = `/photos/${id}`;

  try {
    const response = await axiosInstance.get(url);

    const photo = response.data;

    console.log(`Pobrano zdjęcie o ID: ${id}`);
    cacheData(cacheKey, photo);

    return photo;
  } catch (error) {
    console.error("Błąd podczas pobierania zdjęcia:", error);
    return null;
  }
};

/**
 * Pobiera popularne zdjęcia.
 */
export const fetchTrendingPhotos = async (page = 1) => {
  const cacheKey = `trending_photos_page_${page}`;
  const cachedPhotos = getCache(cacheKey);

  if (cachedPhotos) {
    return cachedPhotos;
  }

  if (!checkRateLimit()) {
    console.log("Limit requestów wyczerpany. Poczekaj do resetu.");
    return [];
  }

  const url = `/photos?page=${page}&per_page=30&order_by=popular`;

  try {
    const response = await axiosInstance.get(url);

    const photos = response.data;

    console.log("Dane pobrane z API:", photos);
    cacheData(cacheKey, photos);

    return photos;
  } catch (error) {
    console.error("Błąd podczas pobierania popularnych zdjęć:", error);
    return [];
  }
};

/**
 * Pobiera kolekcje zdjęć.
 */
export const fetchCollections = async (page = 1, perPage = 10) => {
  const cacheKey = `collections_page_${page}_perPage_${perPage}`;
  const cachedCollections = getCache(cacheKey);

  if (cachedCollections) {
    console.log("Pobrano kolekcje z cache.");
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
    console.log("Limit API wyczerpany. Poczekaj na reset.");
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

    console.log("Kolekcje (bez Unsplash+ i premium):", filteredCollections);

    cacheData(cacheKey, filteredCollections);

    return filteredCollections;
  } catch (error) {
    console.error("Błąd podczas pobierania kolekcji:", error);
    return [];
  }
};
