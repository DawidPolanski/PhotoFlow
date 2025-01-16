import { cacheData, getCache } from "./cacheMiddleware";
import axios from "axios";

export const fetchPhotos = async (query: string, page = 1) => {
  const cacheKey = `photos_${query}_page_${page}`;
  const cachedPhotos = getCache(cacheKey);

  if (cachedPhotos) {
    console.log("Dane pobrane z cache");
    return cachedPhotos;
  }

  const url = `https://api.unsplash.com/search/photos?query=${query}&page=${page}&per_page=30&client_id=${
    import.meta.env.VITE_UNSPLASH_ACCESS_KEY
  }`;

  try {
    const response = await axios.get(url);
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

  const url = `https://api.unsplash.com/photos/${id}?client_id=${
    import.meta.env.VITE_UNSPLASH_ACCESS_KEY
  }`;

  try {
    const response = await axios.get(url);
    const photo = response.data;

    console.log("Dane pobrane z API:", photo);

    cacheData(cacheKey, photo);

    return photo;
  } catch (error) {
    console.error("Błąd podczas pobierania zdjęcia:", error);
    return null;
  }
};
