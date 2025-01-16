import React, { useEffect } from "react";
import CloseIcon from "./shared/assets/icons/CloseIcon";
import NewTabIcon from "./shared/assets/icons/NewTabIcon";
import InfoIcon from "../components/shared/assets/icons/InfoIcon";
import tippy, { followCursor } from "tippy.js";
import "tippy.js/dist/tippy.css";

interface Photo {
  id: string;
  urls: {
    regular: string;
  };
  alt_description: string;
  user: {
    name: string;
    username: string;
    profile_image: {
      medium: string;
    };
  };
  likes: number;
  tags?: { title: string }[];
  created_at?: string;
  views?: number;
}

interface PhotoModalProps {
  photo: Photo;
  onClose: () => void;
}

const PhotoModal: React.FC<PhotoModalProps> = ({ photo, onClose }) => {
  const isPortrait = photo.urls.regular.width < photo.urls.regular.height;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    tippy(".info-icon", {
      content: `
        <div class="text-left">
          <p><strong>Likes:</strong> ${photo.likes || "N/A"}</p>
          <p><strong>Views:</strong> ${photo.views || "N/A"}</p>
        </div>
      `,
      allowHTML: true,
      placement: "top",
      theme: "translucent",
      followCursor: true,
      plugins: [followCursor],
      animation: "scale-subtle",
    });
  }, [photo]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <button
        onClick={onClose}
        className="fixed top-4 right-4 z-50 p-0 m-0 border-none bg-transparent"
      >
        <CloseIcon className="w-8 h-8 text-white hover:opacity-80 transition-opacity" />
      </button>

      <div
        className={`flex ${
          isPortrait
            ? "w-[90%] lg:w-[80%] xl:w-[75%]"
            : "w-[95%] lg:w-[90%] xl:w-[85%]"
        } max-w-[1600px] max-h-[90vh] bg-white relative rounded-lg overflow-hidden shadow-lg`}
      >
        {/* Left: Image */}
        <div className="relative group flex items-center justify-center bg-black">
          <img
            src={photo.urls.regular}
            alt={photo.alt_description || "Photo description"}
            className="h-full w-full object-contain"
          />

          {/* Info Icon */}
          <div className="absolute bottom-4 right-4 z-50 opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-opacity transition-transform duration-300 ease-out">
            <InfoIcon className="w-6 h-6 text-white info-icon select-none focus:outline-none" />
          </div>

          {/* Download Icon */}
          <div className="absolute top-4 right-4 z-50 opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-opacity transition-transform duration-300 ease-out">
            <a
              href={photo.urls.regular}
              target="_blank"
              rel="noopener noreferrer"
            >
              <NewTabIcon className="w-8 h-8 text-blue-500 hover:text-blue-700 transition-all" />
            </a>
          </div>
        </div>

        {/* Right: Details */}
        <div
          className={`space-y-6 overflow-y-auto bg-white px-8 py-6 ${
            isPortrait ? "flex-[2]" : "flex-[1.5]"
          } relative flex flex-col`}
        >
          {/* User Info */}
          <div className="flex items-center space-x-4 border-b pb-4">
            <img
              src={photo.user.profile_image.medium}
              alt={photo.user.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h4 className="text-xl font-semibold">{photo.user.name}</h4>
              <a
                href={`https://unsplash.com/@${photo.user.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-500 hover:underline"
              >
                View Profile
              </a>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-2xl font-medium mb-2">Description</h3>
            <p>{photo.alt_description || "No description available"}</p>
          </div>

          {/* Tags */}
          {photo.tags?.length > 0 && (
            <div>
              <h4 className="text-xl font-medium mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {photo.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded-full"
                  >
                    {tag.title}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Likes and Views */}
          <div className="flex-grow" />
          <div className="mt-2 pt-2 text-sm text-gray-500">
            <div className="border-t border-gray-300 my-2" />
            <div className="mt-2 flex flex-col space-y-1 items-start text-gray-800">
              {photo.likes && (
                <div className="flex items-center space-x-1 text-sm text-gray-700">
                  <span>
                    <strong>Likes: {photo.likes.toLocaleString()}</strong>
                  </span>
                </div>
              )}
              {photo.views && (
                <div className="flex items-center space-x-1 text-sm text-gray-700">
                  <span>
                    <strong>Views: {photo.views.toLocaleString()}</strong>
                  </span>
                </div>
              )}
              {photo.created_at && (
                <div className="mt-2 text-sm text-gray-500">
                  {new Intl.DateTimeFormat("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }).format(new Date(photo.created_at))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoModal;
