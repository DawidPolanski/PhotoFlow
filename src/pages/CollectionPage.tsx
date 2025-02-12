import React, { useEffect, useState, useCallback } from "react";
import { fetchCollections } from "../api/useUnsplash";
import Collections from "../components/layouts/collections/Collections";
import CollectionsLayout from "../components/layouts/CollectionsLayout";
import LoadingCollectionSkeleton from "../components/layouts/search/LoadingCollectionSkeleton";
import { debounce } from "lodash";

const CollectionsPage: React.FC = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const loadCollections = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const fetchedCollections = await fetchCollections(page, 30);
      if (fetchedCollections.length === 0) {
        setError("No more collections to load.");
      }
      setCollections((prevCollections) => {
        const newCollections = fetchedCollections.filter(
          (newCollection) =>
            !prevCollections.some(
              (existingCollection) => existingCollection.id === newCollection.id
            )
        );
        return [...prevCollections, ...newCollections];
      });
    } catch (error) {
      console.error("Error fetching collections:", error);
      setError("Failed to load collections. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [page, loading]);

  useEffect(() => {
    loadCollections();
  }, [page, loadCollections]);

  const handleScroll = debounce(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  }, 200);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <CollectionsLayout>
      <div className="py-8">
        {error && <p className="text-red-500 text-center">{error}</p>}
        {loading && page === 1 ? (
          <LoadingCollectionSkeleton />
        ) : (
          <Collections collections={collections} loading={loading} />
        )}
        {loading && page > 1 && <LoadingCollectionSkeleton />}
      </div>
    </CollectionsLayout>
  );
};

export default CollectionsPage;
