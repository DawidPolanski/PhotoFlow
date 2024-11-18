import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchPhotos } from "../api/unsplash";

const PhotoDetails = () => {
  const { id } = useParams();
  const [photo, setPhoto] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getPhoto = async () => {
      setLoading(true);
      const data = await fetchPhotos(id || "", 1);
      setPhoto(data.results[0]);
      setLoading(false);
    };
    getPhoto();
  }, [id]);

  return (
    <div className="container mx-auto p-4">
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        photo && (
          <div className="relative group">
            {/* Zdjęcie */}
            <img
              src={photo.urls.regular}
              alt={photo.alt_description}
              className="w-full h-auto rounded-lg shadow-lg transition-transform transform group-hover:scale-105"
            />

            {/* Nakładka */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-75 transition-opacity duration-300 ease-in-out flex items-center justify-center rounded-lg">
              <div className="text-center">
                {/* Opis */}
                <h2 className="text-white text-3xl font-semibold">
                  {photo.description || "No description available"}
                </h2>
                <p className="mt-2 text-white text-xl">By {photo.user.name}</p>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};
export default PhotoDetails;
