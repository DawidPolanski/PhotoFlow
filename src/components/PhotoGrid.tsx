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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
        {photos.map((photo) => (
          <div key={photo.id} className="relative group">
            <img
              src={photo.urls.small}
              alt={photo.alt_description}
              className="w-full h-64 object-cover rounded-lg shadow-md"
            />

            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 ease-in-out flex items-center justify-center rounded-lg">
              <p className="text-white text-sm p-2 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {photo.description || "No description"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoGrid;
