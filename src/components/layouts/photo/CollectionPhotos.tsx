import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { fetchPhotos } from "../../../api/PhotoService";
import PhotoGrid from "./PhotoGrid";
import LoadingSkeleton from "../search/LoadingSkeleton";
import { Photo } from "../../../types/Photo";
import { debounce } from "lodash";

const CollectionPhotos: React.FC = () => {
  const { collectionId } = useParams<{ collectionId: string }>();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const scrollPosition = useRef(0);
  const isRequestInProgress = useRef(false);

  const loadCollectionPhotos = useCallback(async () => {
    if (isRequestInProgress.current) return;
    isRequestInProgress.current = true;
    setLoading(true);
    setError(null);
    try {
      const fetchedPhotos = await fetchPhotos("", page, collectionId);
      console.log("Fetched photos:", fetchedPhotos);

      if (fetchedPhotos.length === 0) {
        setError("No more photos to load.");
      }
      setPhotos((prevPhotos) => {
        const newPhotos = fetchedPhotos.filter(
          (newPhoto) =>
            !prevPhotos.some(
              (existingPhoto) => existingPhoto.id === newPhoto.id
            )
        );
        return [...prevPhotos, ...newPhotos];
      });
    } catch (error) {
      console.error("Error fetching collection photos:", error);
      setError("Failed to load photos. Please try again later.");
    } finally {
      setLoading(false);
      isRequestInProgress.current = false;
    }
  }, [collectionId, page]);

  useEffect(() => {
    loadCollectionPhotos();
  }, [loadCollectionPhotos]);

  const handleScroll = debounce(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100
    ) {
      setPage((prevPage) => prevPage + 1);
    }
    scrollPosition.current = window.scrollY;
  }, 200);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    if (!loading) {
      window.scrollTo(0, scrollPosition.current);
    }
  }, [loading]);

  if (loading && page === 1) {
    return <LoadingSkeleton />;
  }

  if (error && page === 1) {
    return (
      <div className="w-full text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const handleTagClick = (tag: string) => {
    console.log("Tag clicked:", tag);
  };

  return (
    <div className="w-full">
      <PhotoGrid
        photos={photos}
        onTagClick={handleTagClick}
        loading={loading && page === 1}
      />
      {loading && page > 1 && <LoadingSkeleton />}
    </div>
  );
};

export default CollectionPhotos;
