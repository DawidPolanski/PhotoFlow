import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPhotos, fetchCollectionDetails } from "../../../api/PhotoService";
import PhotoGrid from "./PhotoGrid";
import LoadingSkeleton from "../search/LoadingSkeleton";
import { Photo } from "../../../types/Photo";
import { Collection } from "../../../types/Collection";

const CollectionPhotos: React.FC = () => {
  const { collectionId } = useParams<{ collectionId: string }>();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [collection, setCollection] = useState<Collection | null>(null);
  const [scrolling, setScrolling] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const scrollPosition = useRef(0);
  const isRequestInProgress = useRef(false);

  useEffect(() => {
    const loadCollectionDetails = async () => {
      try {
        const collectionDetails = await fetchCollectionDetails(collectionId!);
        setCollection(collectionDetails);
      } catch (error) {
        console.error("Error loading collection details:", error);
      }
    };

    loadCollectionDetails();
  }, [collectionId]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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

  const handleScroll = () => {
    const scrollY = window.scrollY;
    setScrolling(scrollY > 50);
    scrollPosition.current = scrollY;

    if (
      window.innerHeight + scrollY >=
      document.documentElement.offsetHeight - 100
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!loading) {
      window.scrollTo(0, scrollPosition.current);
    }
  }, [loading]);

  if (error && page === 1) {
    return (
      <div className="w-full text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto px-4 pt-[100px]">
      {collection && (
        <div
          className={`w-fit mx-auto sticky top-0 bg-transparent z-10 transition-all duration-100 flex justify-center ${
            scrolling ? "top-0" : "top-[-30px]"
          }`}
          style={{ zIndex: 50 }}
        >
          <h1
            className={`text-center font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-blue-400 bg-200% animate-gradient-wave transition-all duration-100 p-4 w-fit ${
              isMobile
                ? scrolling
                  ? "text-lg"
                  : "text-3xl"
                : scrolling
                ? "text-2xl"
                : "text-5xl"
            } ${isMobile && scrolling ? "opacity-0" : "opacity-100"}`}
          >
            {collection.title}{" "}
          </h1>
        </div>
      )}

      {collection && !scrolling && (
        <div className="text-center mb-8">
          {collection.description && (
            <p className="text-gray-600 mb-4">{collection.description}</p>
          )}
          <div className="flex items-center justify-center space-x-4">
            <div>
              <p className="text-gray-600">
                By{" "}
                <a
                  href={`https://unsplash.com/@${collection.user.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {collection.user.name}
                </a>
              </p>
              <p className="text-gray-500 text-sm">
                <strong>{collection.total_photos}</strong> photos
              </p>
              {collection.published_at && (
                <p className="text-gray-500 text-sm">
                  Created on{" "}
                  {new Date(collection.published_at).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {loading && page === 1 ? (
        <LoadingSkeleton />
      ) : (
        <PhotoGrid
          photos={photos}
          onTagClick={(tag) => navigate(`/search/${tag}`)}
        />
      )}

      {loading && page > 1 && <LoadingSkeleton />}
      {error && page > 1 && (
        <div className="w-full text-center py-8">
          <p className="text-red-500">{error}</p>
        </div>
      )}
    </div>
  );
};

export default CollectionPhotos;
