import React, { useState } from "react";

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

  return (
    <div className="w-full px-4 pt-16">
      {" "}
      {/* Dodano pt-16 dla odstępu pod navbar */}
      <div
        className="columns-1 sm:columns-2 lg:columns-3 gap-4"
        style={{
          columnGap: "16px",
        }}
      >
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="mb-4 break-inside-avoid relative"
            onMouseEnter={() => setHoveredPhoto(photo)}
            onMouseLeave={() => setHoveredPhoto(null)}
          >
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={photo.urls.small}
                alt={photo.alt_description}
                className="w-full rounded-lg shadow-md transition-all duration-300"
                style={{
                  display: "block",
                  width: "100%",
                  height: "auto",
                }}
              />
              {/* Gradient ściemniania z krawędzi */}
              <div
                className={`absolute inset-0 transition-all duration-500 ease-out ${
                  hoveredPhoto?.id === photo.id ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  background:
                    hoveredPhoto?.id === photo.id
                      ? "linear-gradient(to bottom, rgba(0, 0, 0, 0.4), transparent 50%, rgba(0, 0, 0, 0.4))"
                      : "transparent",
                  zIndex: 1, // Zmniejszenie zIndex dla gradientu
                }}
              />
              {/* Nazwa autora nad gradientem */}
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoGrid;
