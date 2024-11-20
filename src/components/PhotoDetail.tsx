import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchPhotos } from "../api/unsplash";

interface PhotoDetailProps {}

const PhotoDetail: React.FC<PhotoDetailProps> = () => {
  const { id } = useParams();
  const [photo, setPhoto] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadPhoto = async () => {
      if (!id) return;
      setLoading(true);
      const fetchedPhotos = await fetchPhotos(id);
      setPhoto(fetchedPhotos[0]);
      setLoading(false);
    };

    loadPhoto();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full px-4 pt-16">
      <div className="max-w-4xl mx-auto">
        <div className="relative">
          <img
            src={photo?.urls?.regular}
            alt={photo?.alt_description}
            className="w-full h-auto rounded-lg shadow-lg"
          />
          <div className="absolute top-4 left-4 text-white">
            <h2 className="text-3xl font-semibold">{photo?.alt_description}</h2>
            <p className="text-lg">{photo?.user?.name}</p>
          </div>
        </div>
        <div className="mt-6 text-gray-700">
          <p>{photo?.description || "No description available"}</p>
        </div>
      </div>
    </div>
  );
};

export default PhotoDetail;
