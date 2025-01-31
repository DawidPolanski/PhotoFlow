import { cacheData, getCache } from "../utils/cacheUtils"; // Upewnij się, że importujesz z poprawnego pliku
import axios from "axios";

let remainingRequests = 50;
let resetTime = Date.now() + 3600 * 1000;

/**
 * Pobiera zdjęcia z Unsplash API na podstawie zapytania i numeru strony.
 * @param query - Zapytanie wyszukiwania.
 * @param page - Numer strony (domyślnie 1).
 * @returns Zwraca tablicę zdjęć lub pustą tablicę w przypadku błędu.
 */
export const fetchPhotos = async (query: string, page = 1) => {
  if (!query.trim()) {
    console.log("Brak zapytania – nie pobieramy zdjęć.");
    return []; // Zwracamy pustą tablicę, aby nie renderować domyślnych zdjęć
  }

  const cacheKey = `photos_${query}_page_${page}`;
  const cachedPhotos = getCache(cacheKey);

  if (cachedPhotos) {
    console.log("Dane pobrane z cache");
    return cachedPhotos;
  }

  if (remainingRequests <= 0 && Date.now() < resetTime) {
    console.log("Limit requestów wyczerpany. Poczekaj do resetu.");
    return [];
  }

  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
    query
  )}&page=${page}&per_page=30&client_id=${
    import.meta.env.VITE_UNSPLASH_ACCESS_KEY
  }`;

  try {
    const response = await axios.get(url);

    remainingRequests = parseInt(response.headers["x-ratelimit-remaining"], 10);
    resetTime = parseInt(response.headers["x-ratelimit-reset"], 10) * 1000;

    const photos = response.data.results;

    console.log("Dane pobrane z API:", photos);
    cacheData(cacheKey, photos);

    return photos;
  } catch (error) {
    console.error("Błąd podczas pobierania zdjęć:", error);
    return [];
  }
};

export const fetchPhoto = async (id: string) => {
  const cacheKey = `photo_${id}`;
  const cachedPhoto = getCache(cacheKey);

  if (cachedPhoto) {
    console.log("Zdjęcie pobrane z cache");
    return cachedPhoto;
  }

  if (remainingRequests <= 0 && Date.now() < resetTime) {
    console.log("Limit requestów wyczerpany. Poczekaj do resetu.");
    return null;
  }

  const url = `https://api.unsplash.com/photos/${id}?client_id=${
    import.meta.env.VITE_UNSPLASH_ACCESS_KEY
  }`;

  try {
    const response = await axios.get(url);

    remainingRequests = parseInt(response.headers["x-ratelimit-remaining"], 10);
    resetTime = parseInt(response.headers["x-ratelimit-reset"], 10) * 1000;

    const photo = response.data;

    console.log("Dane pobrane z API:", photo);
    cacheData(cacheKey, photo);

    return photo;
  } catch (error) {
    console.error("Błąd podczas pobierania zdjęcia:", error);
    return null;
  }
};
