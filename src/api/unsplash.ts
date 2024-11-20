// src/api/unsplash.ts

import axios from "axios";

export const fetchPhotos = async (query: string, page = 1) => {
  const url = `https://api.unsplash.com/search/photos?query=${query}&page=${page}&per_page=30&client_id=${
    import.meta.env.VITE_UNSPLASH_ACCESS_KEY
  }`;

  try {
    const response = await axios.get(url);
    return response.data.results;
  } catch (error) {
    console.error("Błąd podczas pobierania zdjęć:", error);
    return [];
  }
};

// Add the fetchPhoto function
export const fetchPhoto = async (id: string) => {
  const url = `https://api.unsplash.com/photos/${id}?client_id=${
    import.meta.env.VITE_UNSPLASH_ACCESS_KEY
  }`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Błąd podczas pobierania zdjęcia:", error);
    return null;
  }
};
