import React, { useState, useEffect, useRef } from "react";

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

    photos.forEach((photo) => {
      const shortestColumnIndex = columnHeights.current.indexOf(
        Math.min(...columnHeights.current)
      );
      newColumns[shortestColumnIndex].push(photo);

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
            {column.map((photo, rowIndex) => (
              <div
                key={photo.id}
                onMouseEnter={() => setHoveredPhoto(photo)}
                onMouseLeave={() => setHoveredPhoto(null)}
                className="relative overflow-hidden rounded-lg shadow-lg"
              >
                <span
                  className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs font-semibold px-2 py-1 rounded"
                  style={{ zIndex: 3 }}
                >
                  #{photos.indexOf(photo) + 1} -{" "}
                  {photoHeights[photo.id]
                    ? `${photoHeights[photo.id]}px`
                    : "Loading..."}
                </span>

                <div className="relative w-full">
                  {!photoHeights[photo.id] && (
                    <div className="w-full h-48 bg-gray-300 animate-pulse rounded-lg"></div>
                  )}
                  <img
                    ref={(el) => (imageRefs.current[rowIndex] = el)}
                    src={photo.urls.small}
                    alt={photo.alt_description}
                    className={`w-full h-auto object-cover rounded-lg transition-opacity duration-300 ${
                      photoHeights[photo.id] ? "opacity-100" : "opacity-0"
                    }`}
                    onLoad={(e) => {
                      const imgElement = e.currentTarget;
                      handleImageLoad(photo.id, imgElement.clientHeight);
                    }}
                  />
                </div>

                <div
                  className={`absolute inset-0 transition-all duration-500 ease-out ${
                    hoveredPhoto?.id === photo.id ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    background:
                      hoveredPhoto?.id === photo.id
                        ? "linear-gradient(to bottom, rgba(0, 0, 0, 0.5), transparent 50%, rgba(0, 0, 0, 0.5))"
                        : "transparent",
                    zIndex: 1,
                  }}
                />

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
