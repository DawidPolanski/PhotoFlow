import axiosInstance from "./axiosInstance";

export const fetchPhotos = async (query: string, page: number) => {
  try {
    const response = await axiosInstance.get("/search/photos", {
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
    const response = await axiosInstance.get("/photos", {
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
