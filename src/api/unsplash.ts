import axios from "axios";

const cacheData = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
  console.log(`Dane zapisane w cache pod kluczem: ${key}`, data);
};

const getCache = (key: string) => {
  const cachedData = localStorage.getItem(key);
  if (cachedData) {
    console.log(
      `Dane pobrane z cache pod kluczem: ${key}`,
      JSON.parse(cachedData)
    );
    return JSON.parse(cachedData);
  }
  return null;
};

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
