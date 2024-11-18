import axios from "axios";

export const fetchPhotos = async (query, page = 1) => {
  const url = `https://api.unsplash.com/search/photos?query=${query}&page=${page}&client_id=${
    import.meta.env.VITE_UNSPLASH_ACCESS_KEY
  }`;

  try {
    const response = await axios.get(url);
    console.log("Dane z API Unsplash:", response.data.results);
    return response.data.results;
  } catch (error) {
    console.error("Błąd:", error);
    return [];
  }
};
