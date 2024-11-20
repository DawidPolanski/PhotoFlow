import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import HeartIcon from "../components/shared/assets/icons/HeartIcon";

interface Photo {
  id: string;
  urls: {
    small: string;
  };
  alt_description: string;
  user: {
    name: string;
    username: string;
    profile_image: {
      small: string;
    };
  };
}

interface PhotoGridProps {
  photos: Photo[];
}

const PhotoGrid: React.FC<PhotoGridProps> = ({ photos }) => {
  const [hoveredPhoto, setHoveredPhoto] = useState<Photo | null>(null);
  const columnCount = 5;
  const [columns, setColumns] = useState<Photo[][]>(
    Array.from({ length: columnCount }, () => [])
  );
  const [photoHeights, setPhotoHeights] = useState<Record<string, number>>({});
  const columnHeights = useRef<number[]>(Array(columnCount).fill(0));
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  useEffect(() => {
    const newColumns = Array.from({ length: columnCount }, () => []);
    columnHeights.current = Array(columnCount).fill(0);

    photos.forEach((photo, index) => {
      const shortestColumnIndex = columnHeights.current.indexOf(
        Math.min(...columnHeights.current)
      );
      newColumns[shortestColumnIndex].push({ ...photo, index });

      if (photoHeights[photo.id]) {
        columnHeights.current[shortestColumnIndex] += photoHeights[photo.id];
      }
    });

    setColumns(newColumns);
  }, [photos, photoHeights]);

  const handleImageLoad = (photoId: string, height: number) => {
    setPhotoHeights((prevHeights) => ({
      ...prevHeights,
      [photoId]: height,
    }));
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
                className="relative overflow-hidden rounded-lg shadow-lg"
              >
                <Link to={`/photo/${photo.id}`} className="block">
                  <div className="relative">
                    <img
                      ref={(el) => imageRefs.current.push(el)}
                      src={photo.urls.small}
                      alt={photo.alt_description}
                      className="w-full h-auto object-cover rounded-lg"
                      onLoad={(e) => {
                        const imgElement = e.currentTarget;
                        handleImageLoad(photo.id, imgElement.clientHeight);
                      }}
                    />

                    <div
                      className={`absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 transform transition-all duration-300 ${
                        hoveredPhoto?.id === photo.id
                          ? "opacity-50"
                          : "opacity-0"
                      }`}
                    />
                  </div>
                </Link>

                <div className="absolute top-2 left-2 bg-black text-white px-2 py-1 rounded">
                  {photo.index + 1}
                </div>

                <div
                  className={`absolute top-2 right-2 p-2 transform transition-all duration-300 ease-in-out ${
                    hoveredPhoto?.id === photo.id
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-[20px]"
                  }`}
                  style={{ zIndex: 3 }}
                >
                  <HeartIcon />
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
    </div>
  );
};

export default PhotoGrid;
