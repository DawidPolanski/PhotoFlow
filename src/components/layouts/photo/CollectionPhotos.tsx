import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPhotos } from "../../../api/PhotoService";
import PhotoGrid from "./PhotoGrid";
import Spinner from "../../ui/Spinner";
import { Photo } from "../../../types/Photo";

const CollectionPhotos: React.FC = () => {
  const { collectionId } = useParams<{ collectionId: string }>();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCollectionPhotos = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedPhotos = await fetchPhotos("", 1, collectionId);
        if (fetchedPhotos.length === 0) {
          setError("No photos found in this collection.");
        }
        setPhotos(fetchedPhotos);
      } catch (error) {
        console.error("Error fetching collection photos:", error);
        setError("Failed to load photos. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (collectionId) {
      loadCollectionPhotos();
    }
  }, [collectionId]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="w-full text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const handleTagClick = (tag: string) => {
    console.log("Tag clicked:", tag);
  };

  return (
    <div className="w-full">
      <PhotoGrid photos={photos} onTagClick={handleTagClick} />
    </div>
  );
};

export default CollectionPhotos;
