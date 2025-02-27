import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import {
  fetchPhotos,
  fetchTrendingPhotos,
  fetchCollections,
} from "../api/useUnsplash";
import MainLayout from "../components/layouts/MainLayout";
import PhotoGrid from "../components/layouts/photo/PhotoGrid";
import Header from "../components/layouts/Header";
import SearchBar from "../components/layouts/search/SearchBar";
import { Photo } from "../types/Photo";
import { Collection } from "../types/Collection";
import LoadingSkeleton from "../components/layouts/search/LoadingSkeleton";

const Home: React.FC = () => {
  const location = useLocation();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [scrolling, setScrolling] = useState(false);
  const [showCollections, setShowCollections] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showSearchBar, setShowSearchBar] = useState(true);
  const [showArrow, setShowArrow] = useState(false);
  const loadingRef = useRef(false);
  const scrollPosition = useRef(0);

  useEffect(() => {
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tag = params.get("tag");
    if (tag) {
      setQuery(tag);
    }
  }, [location.search]);

  const updateRecentSearches = (searchTerm: string) => {
    setRecentSearches((prevSearches) => {
      const updatedSearches = [
        searchTerm,
        ...prevSearches.filter((term) => term !== searchTerm),
      ].slice(0, 6);
      localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
      return updatedSearches;
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
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

      const uniquePhotos = fetchedPhotos.filter(
        (newPhoto) =>
          !photos.some((existingPhoto) => existingPhoto.id === newPhoto.id)
      );

      if (page === 1) {
        setPhotos(uniquePhotos);
      } else {
        setPhotos((prevPhotos) => [...prevPhotos, ...uniquePhotos]);
      }
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

  useEffect(() => {
    if (page > 1) {
      loadPhotos();
    }
  }, [page]);

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
      setShowSearchBar(false);
      setShowArrow(true);
    } else {
      setScrolling(false);
      setShowSearchBar(true);
      setShowArrow(false);
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
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setQuery(searchQuery);
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col items-center min-h-screen px-4 py-8 pt-24">
        <Header scrolling={scrolling} />

        {showArrow && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-[4.5rem] left-1/2 transform -translate-x-1/2 cursor-pointer z-30"
            onClick={() => setShowSearchBar((prev) => !prev)}
          >
            <div className="bg-white rounded-full p-1 shadow-lg">
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                initial={{ rotate: showSearchBar ? 0 : 180 }}
                animate={{ rotate: showSearchBar ? 0 : 180 }}
                transition={{ duration: 0.3 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </motion.svg>
            </div>
          </motion.div>
        )}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{
            opacity: showSearchBar ? 1 : 0,
            y: showSearchBar ? 0 : -20,
          }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-2xl sticky top-24 z-20 mb-8 mx-auto"
        >
          <SearchBar
            query={searchQuery}
            onChange={handleQueryChange}
            onSearch={handleSearch}
            recentSearches={recentSearches}
            onClearRecentSearches={clearRecentSearches}
            onCategoryClick={handleCategoryClick}
          />
        </motion.div>
        {error && <div className="text-red-500 text-center">{error}</div>}

        {showCollections ? (
          <div className="w-full max-w-4xl mb-8">
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
            <PhotoGrid photos={photos} onTagClick={handleTagClick} />
            {loading && (
              <div className="w-full flex justify-center py-4">
                <LoadingSkeleton />
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Home;
