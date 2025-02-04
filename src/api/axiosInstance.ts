import axios from "axios";

export const fetchPhotos = async (query: string, page: number) => {
  try {
    const response = await axios.get("/search/photos", {
      params: {
        query: query || "trending",
        page,
        per_page: 30,
        order_by: "popular",
      },
    });
    return response.data.results;
  } catch (error) {
    console.error("Error fetching photos:", error);
    return [];
  }
};

export const fetchTrendingPhotos = async (page: number) => {
  try {
    const response = await axios.get("/photos", {
      params: {
        page,
        per_page: 30,
        order_by: "popular",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching trending photos:", error);
    return [];
  }
};
export default fetchPhotos;
