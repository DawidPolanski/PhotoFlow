import React from "react";

interface Photo {
  id: string;
  urls: {
    small: string;
  };
  alt_description: string;
  description?: string;
}

interface PhotoGridProps {
  photos: Photo[];
}

const PhotoGrid: React.FC<PhotoGridProps> = ({ photos }) => {
  return (
    <div className="w-full px-4">
      <div
        className="columns-1 sm:columns-2 lg:columns-3 gap-4"
        style={{
          columnGap: "16px",
        }}
      >
        {photos.map((photo) => (
          <div key={photo.id} className="mb-4 break-inside-avoid">
            <img
              src={photo.urls.small}
              alt={photo.alt_description}
              className="w-full rounded-lg shadow-md"
              style={{
                display: "block",
                width: "100%",
                height: "auto",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoGrid;
