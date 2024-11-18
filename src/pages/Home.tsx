import React, { useEffect, useState } from "react";
import { fetchPhotos } from "../api/unsplash";
import PhotoGrid from "../components/PhotoGrid";

const Home = () => {
  const [photos, setPhotos] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPhotos = async () => {
      setLoading(true);
      const fetchedPhotos = await fetchPhotos(query);
      setPhotos(fetchedPhotos);
      setLoading(false);
    };

    loadPhotos();
  }, [query]);

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-8">
      <div className="w-full sticky top-0 bg-white z-10">
        <h1 className="text-5xl font-semibold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-blue-400 bg-200% animate-gradient-wave text-center shadow-sm leading-loose">
          Find beautiful images that inspire your creativity!
        </h1>

        <div className="w-full flex justify-center mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            style={{
              padding: "16px 24px",
              border: "1px solid #e0e0e0",
              borderRadius: "9999px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              outline: "none",
              transition: "border-color 0.25s, box-shadow 0.25s",
              width: "500px",
            }}
            className="w-full max-w-xl focus:ring-2 focus:ring-indigo-500"
          />
        </div>
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
  );
};
export default Home;
