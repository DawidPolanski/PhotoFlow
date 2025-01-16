import axiosInstance from "./axiosInstance";

export const fetchPhotos = async (query: string, page = 1) => {
  try {
    const response = await axiosInstance.get("/search/photos", {
      params: { query, page, per_page: 30 },
    });

    console.log("Dane pobrane:", response.data.results);
    return response.data.results;
  } catch (error) {
    console.error("Błąd podczas pobierania zdjęć:", error);
    return [];
  }
};

export const fetchPhoto = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/photos/${id}`);
    console.log("Zdjęcie pobrane:", response.data);
    return response.data;
  } catch (error) {
    console.error("Błąd podczas pobierania zdjęcia:", error);
    return null;
  }
};
