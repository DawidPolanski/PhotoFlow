import React, { useState, useEffect, useRef } from "react";
import HeartIcon from "../components/shared/assets/icons/HeartIcon";
import PhotoModal from "../components/PhotoModal";

interface Photo {
  id: string;
  urls: {
    small: string;
    regular: string;
  };
  alt_description: string;
  user: {
    name: string;
    username: string;
    profile_image: {
      small: string;
      medium: string;
    };
  };
  likes: number;
}

interface PhotoGridProps {
  photos: Photo[];
}

const PhotoGrid: React.FC<PhotoGridProps> = ({ photos }) => {
  const [hoveredPhoto, setHoveredPhoto] = useState<Photo | null>(null);
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);
  const columnCount = 5;
  const [columns, setColumns] = useState<Photo[][]>(
    Array.from({ length: columnCount }, () => [])
  );
  const [photoHeights, setPhotoHeights] = useState<Record<string, number>>({});
  const columnHeights = useRef<number[]>(Array(columnCount).fill(0));
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  useEffect(() => {
    const newColumns: Photo[][] = Array.from({ length: columnCount }, () => []);
    columnHeights.current = Array(columnCount).fill(0);

    photos.forEach((photo) => {
      const shortestColumnIndex = columnHeights.current.indexOf(
        Math.min(...columnHeights.current)
      );
      newColumns[shortestColumnIndex].push(photo);
      columnHeights.current[shortestColumnIndex] += photoHeights[photo.id] || 0;
    });

    setColumns(newColumns);
  }, [photos, photoHeights]);

  useEffect(() => {
    imageRefs.current = [];
  }, [columns]);

  const handleImageLoad = (photoId: string, height: number) => {
    setPhotoHeights((prevHeights) => ({
      ...prevHeights,
      [photoId]: height,
    }));
  };

  const openModal = (photoId: string) => {
    setSelectedPhotoId(photoId);
  };

  const closeModal = () => {
    setSelectedPhotoId(null);
  };

  return (
    <div className="w-full px-4 pt-16">
      <div className="flex gap-4">
        {columns.map((column, colIndex) => (
          <div
            key={colIndex}
            className="flex flex-col gap-4"
            style={{ flex: 1 }}
          >
            {column.map((photo) => (
              <div
                key={photo.id}
                onMouseEnter={() => setHoveredPhoto(photo)}
                onMouseLeave={() => setHoveredPhoto(null)}
                className="relative overflow-hidden rounded-lg shadow-lg group"
              >
                <div
                  onClick={() => openModal(photo.id)}
                  className="cursor-pointer"
                >
                  <img
                    ref={(el) => imageRefs.current.push(el)}
                    src={photo.urls.small}
                    alt={photo.alt_description}
                    className="w-full h-auto object-cover rounded-lg group-hover:brightness-75 transition duration-300"
                    onLoad={(e) => {
                      const imgElement = e.currentTarget;
                      handleImageLoad(photo.id, imgElement.clientHeight);
                    }}
                  />
                </div>
                <div
                  className={`absolute top-2 right-2 flex items-center gap-1 p-2 transform transition-all duration-300 ease-in-out ${
                    hoveredPhoto?.id === photo.id
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-[20px]"
                  }`}
                  style={{ zIndex: 3 }}
                >
                  <HeartIcon />
                  <span className="text-white text-sm font-semibold">
                    {photo.likes}
                  </span>
                </div>
                <div
                  className={`absolute bottom-0 left-0 p-3 text-white transform transition-all duration-300 ease-in-out ${
                    hoveredPhoto?.id === photo.id
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                  style={{ zIndex: 2 }}
                >
                  <div className="flex items-center space-x-2">
                    <img
                      src={photo.user.profile_image.small}
                      alt={photo.user.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm font-semibold">
                      {photo.user.name}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {selectedPhotoId && (
        <PhotoModal photoId={selectedPhotoId} onClose={closeModal} />
      )}
    </div>
  );
};

export default PhotoGrid;
