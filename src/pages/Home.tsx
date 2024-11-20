import React, { useEffect, useState, useRef } from "react";
import { fetchPhotos } from "../api/unsplash";
import PhotoGrid from "../components/PhotoGrid";
import MainLayout from "../components/layouts/MainLayout";

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const Home = () => {
  const [photos, setPhotos] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [scrolling, setScrolling] = useState(false);

  const loadingRef = useRef(false);
  const scrollPosition = useRef(0);

  const debouncedQuery = useDebounce(query, 500);

  const loadPhotos = async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);

    const fetchedPhotos = await fetchPhotos(debouncedQuery, page);
    setPhotos((prevPhotos) => [...prevPhotos, ...fetchedPhotos]);

    loadingRef.current = false;
    setLoading(false);
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

    if (currentScrollY > 50) {
      setScrolling(true);
    } else {
      setScrolling(false);
    }
  };

  useEffect(() => {
    if (debouncedQuery) {
      setPage(1);
      setPhotos([]);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    if (debouncedQuery) {
      loadPhotos();
    }
  }, [debouncedQuery, page]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setPage(1);
      setPhotos([]);
      loadPhotos();
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col items-center min-h-screen px-4 py-8 pt-24">
        <div
          className={`w-full sticky top-0 bg-transparent z-10 transition-all duration-500 flex justify-center`}
        >
          <h1
            className={`text-center font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-blue-400 bg-200% animate-gradient-wave text-center transition-all duration-500 ${
              scrolling ? "text-2xl" : "text-5xl"
            } ${
              scrolling ? "transform scale-90" : "transform scale-100"
            } p-4 w-fit`}
          >
            Find beautiful images that{" "}
            <span
              className={`font-dancing transition-all duration-500 ${
                scrolling ? "text-3xl" : "text-6xl"
              }`}
            >
              inspire
            </span>{" "}
            your creativity!
          </h1>
        </div>

        <div className="w-full flex justify-center mb-8 mt-8 sticky top-20 z-20">
          <input
            type="text"
            value={query}
            onChange={handleQueryChange}
            onKeyDown={handleKeyPress}
            placeholder="Search for images..."
            className="w-full max-w-xl px-6 py-3 border border-transparent rounded-full shadow-lg text-gray-700 
               placeholder-gray-400 bg-gradient-to-r from-blue-100 via-purple-100 to-blue-100
               bg-200% animate-gradient-wave
               focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50
               focus:scale-105
               transition duration-300 ease-in-out transform"
          />
        </div>

        {loading && (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 mt-6">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="animate-pulse flex flex-col items-center justify-center gap-4"
              >
                <div className="bg-gray-300 h-64 w-full rounded-lg" />
                <div className="bg-gray-300 h-4 w-2/3 rounded-md" />
              </div>
            ))}
          </div>
        )}

        <PhotoGrid photos={photos} />

        {loading && (
          <div className="w-full flex justify-center py-4">
            <div className="animate-pulse">
              <div className="bg-gray-300 h-8 w-16 rounded-md" />
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Home;
