import React, { useEffect, useState, useRef } from "react";
import { fetchPhotos } from "../api/useUnsplash";
import MainLayout from "../components/layouts/MainLayout";
import PhotoGrid from "../components/layouts/photo/PhotoGrid";
import Header from "../components/layouts/Header";
import SearchBar from "../components/layouts/search/SearchBar";
import LoadingSkeleton from "../components/layouts/search/LoadingSkeleton";

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
    if (!debouncedQuery.trim()) {
      setPhotos([]);
      return;
    }

    if (loadingRef.current) return;

    loadingRef.current = true;
    setLoading(true);

    try {
      const fetchedPhotos = await fetchPhotos(debouncedQuery, page);
      setPhotos((prevPhotos) =>
        page === 1 ? fetchedPhotos : [...prevPhotos, ...fetchedPhotos]
      );
    } catch (error) {
      console.error("Error fetching photos:", error);
    } finally {
      loadingRef.current = false;
      setLoading(false);
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

  useEffect(() => {
    if (debouncedQuery) {
      setPage(1);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    loadPhotos();
  }, [debouncedQuery, page]);

  useEffect(() => {
    const onScroll = () => {
      requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [loading]);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <MainLayout>
      <div className="flex flex-col items-center min-h-screen px-4 py-8 pt-24">
        <Header scrolling={scrolling} />

        <div className="w-full flex justify-center mb-8 mt-8 sticky top-20 z-20">
          <SearchBar query={query} onChange={handleQueryChange} />
        </div>

        {loading && <LoadingSkeleton />}

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
