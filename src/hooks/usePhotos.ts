import { useQuery } from "react-query";
import { fetchPhotos } from "../api/useUnsplash";

export const usePhotos = (query: string, page: number) => {
  return useQuery(["photos", query, page], () => fetchPhotos(query, page), {
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });
};
