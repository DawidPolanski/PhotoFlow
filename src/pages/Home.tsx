import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  fetchPhotos,
  fetchTrendingPhotos,
  fetchCollections,
} from "../api/useUnsplash";
import MainLayout from "../components/layouts/MainLayout";
import PhotoGrid from "../components/layouts/photo/PhotoGrid";
import Header from "../components/layouts/Header";
import SearchBar from "../components/layouts/search/SearchBar";
import LoadingSkeleton from "../components/layouts/search/LoadingSkeleton";

interface Photo {
  id: string;
  urls: { small: string };
  alt_description: string;
  likes: number;
  user: { name: string; profile_image: { small: string } };
}

interface Collection {
  id: string;
  title: string;
  cover_photo: { urls: { small: string } };
}

const Home: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [scrolling, setScrolling] = useState(false);
  const [showCollections, setShowCollections] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const loadingRef = useRef(false);
  const scrollPosition = useRef(0);

  const updateRecentSearches = (searchTerm: string) => {
    setRecentSearches((prevSearches) => {
      const updatedSearches = [
        searchTerm,
        ...prevSearches.filter((term) => term !== searchTerm),
      ];
      return updatedSearches.slice(0, 5);
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  const loadPhotos = async () => {
    if (loadingRef.current) return;

    loadingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      let fetchedPhotos;
      if (query.trim()) {
        fetchedPhotos = await fetchPhotos(query, page);
      } else {
        fetchedPhotos = await fetchTrendingPhotos(page);
      }

      const uniquePhotos = Array.from(
        new Set([...photos, ...fetchedPhotos].map((photo) => photo.id))
      ).map((id) => {
        return [...photos, ...fetchedPhotos].find((photo) => photo.id === id);
      });

      setPhotos(uniquePhotos);
    } catch (error) {
      console.error("Error fetching photos:", error);
      setError("Failed to load photos. Please try again later.");
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query.trim()) {
      setPage(1);
      setPhotos([]);
      loadPhotos();
      updateRecentSearches(query);
    }
  }, [query]);

  const loadCollections = async () => {
    if (collections.length === 0) {
      try {
        const fetchedCollections = await fetchCollections();
        setCollections(fetchedCollections);
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    }
  };

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    scrollPosition.current = currentScrollY;

    const bottom =
      window.innerHeight + currentScrollY >=
      document.documentElement.scrollHeight - 100;

    if (bottom && !loading) {
      setPage((prevPage) => prevPage + 1);
    }

    if (currentScrollY > 1) {
      setScrolling(true);
    } else {
      setScrolling(false);
    }
  };

  const handleCategoryClick = (categoryQuery: string) => {
    setQuery(categoryQuery);
  };

  const handleTagClick = (tag: string) => {
    setQuery(tag);
  };

  useEffect(() => {
    loadPhotos();
  }, [page]);

  useEffect(() => {
    loadCollections();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [loading]);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
  };

  return (
    <MainLayout>
      <div className="flex flex-col items-center min-h-screen px-4 py-8 pt-24">
        <Header scrolling={scrolling} />

        <div className="w-full flex justify-center mb-8 mt-8 sticky top-20 z-20">
          <SearchBar
            query={query}
            onChange={handleQueryChange}
            onSearch={() => {}}
            recentSearches={recentSearches}
            onClearRecentSearches={clearRecentSearches}
            onCategoryClick={handleCategoryClick}
          />
        </div>

        {error && <div className="text-red-500 text-center">{error}</div>}

        {showCollections ? (
          <div className="w-full max-w-4xl mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Collections
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {collections.map((collection) => (
                <motion.div
                  key={collection.id}
                  className="p-4 rounded-lg cursor-pointer hover:opacity-90 transition-opacity relative overflow-hidden shadow-lg"
                  onClick={() => handleCategoryClick(collection.title)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    backgroundImage: `url(${collection.cover_photo.urls.small})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: "200px",
                  }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <p className="text-center text-white font-medium text-lg">
                      {collection.title}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {loading && <LoadingSkeleton />}
            <PhotoGrid photos={photos} onTagClick={handleTagClick} />
            {loading && (
              <div className="w-full flex justify-center py-4">
                <div className="animate-pulse">
                  <div className="bg-gray-300 h-8 w-16 rounded-md" />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Home;
