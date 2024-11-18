import React, { useEffect, useState } from "react";
import { fetchPhotos } from "../../api/unsplash";
import PhotoGrid from "../PhotoGrid";
import MainLayout from "../layouts/MainLayout";

const Home = () => {
  const [photos, setPhotos] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    const loadPhotos = async () => {
      setLoading(true);
      const fetchedPhotos = await fetchPhotos(query);
      setPhotos(fetchedPhotos);
      setLoading(false);
    };

    loadPhotos();
  }, [query]);

  useEffect(() => {
    let lastScrollY = 0;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 50 && lastScrollY <= 50) {
        setScrolling(true);
      } else if (currentScrollY <= 50 && lastScrollY > 50) {
        setScrolling(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <MainLayout>
      <div className="flex flex-col items-center min-h-screen px-4 py-8 pt-24">
        <div
          className={`w-full sticky top-0 bg-transparent z-10 transition-all duration-500 flex justify-center`}
        >
          <h1
            className={`text-center font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-blue-400 bg-200% animate-gradient-wave text-center shadow-sm ${
              scrolling ? "text-2xl" : "text-5xl"
            } p-4 w-fit transition-all duration-500`}
          >
            Find beautiful images that{" "}
            <span
              className={`font-dancing transition-all duration-500 ${
                scrolling ? "text-3xl" : "text-6xl"
              } animate-text`}
            >
              inspire
            </span>{" "}
            your creativity!
          </h1>
        </div>

        <div className="w-full flex justify-center mb-8 mt-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="w-full max-w-xl px-6 py-3 border-2 border-transparent rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-gradient-to-r from-blue-400 via-purple-500 to-blue-400 transition-all duration-500"
          />
        </div>

        {loading ? (
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
        ) : (
          <PhotoGrid photos={photos} />
        )}
      </div>
    </MainLayout>
  );
};

export default Home;
