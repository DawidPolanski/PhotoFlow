import { useQuery } from "react-query";
import { fetchPhotos } from "../api/unsplash";

export const usePhotos = (query: string, page: number) => {
  return useQuery(["photos", query, page], () => fetchPhotos(query, page), {
    keepPreviousData: true,
  });
};
