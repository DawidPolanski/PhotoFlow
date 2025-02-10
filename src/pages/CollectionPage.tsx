import React, { useEffect, useState, useCallback } from "react";
import { fetchCollections } from "../api/useUnsplash";
import Collections from "../components/layouts/collections/Collections";
import Spinner from "../components/ui/Spinner";
import CollectionsLayout from "../components/layouts/CollectionsLayout";
import { debounce } from "lodash";

const CollectionsPage: React.FC = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const loadCollections = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      const fetchedCollections = await fetchCollections(page, 30);
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

  if (loading && page === 1) {
    return <Spinner />;
  }

  return (
    <CollectionsLayout>
      <div className="py-8">
        <Collections collections={collections} />
        {loading && <Spinner />}
      </div>
    </CollectionsLayout>
  );
};

export default CollectionsPage;
