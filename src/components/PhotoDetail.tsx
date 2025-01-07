import React, { useState, useEffect } from "react";
import { fetchPhoto } from "../api/unsplash";
import DownloadIcon from "../components/shared/assets/icons/DownloadIcon";
import LocationIcon from "../components/shared/assets/icons/LocationIcon";
import ViewIcon from "../components/shared/assets/icons/ViewIcon";
import HeartIcon from "../components/shared/assets/icons/HeartIcon";
import CloseIcon from "./shared/assets/icons/CloseIcon";

interface PhotoModalProps {
  photoId: string;
  onClose: () => void;
}

const PhotoModal: React.FC<PhotoModalProps> = ({ photoId, onClose }) => {
  const [photo, setPhoto] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadPhoto = async () => {
      setLoading(true);
      const fetchedPhoto = await fetchPhoto(photoId);
      setPhoto(fetchedPhoto);
      setLoading(false);
    };

    loadPhoto();
  }, [photoId]);

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const isPortrait = photo?.width < photo?.height;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-lg"
      onClick={handleOutsideClick}
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
        <div
          className={`flex items-center justify-center bg-black ${
            isPortrait ? "flex-[3]" : "flex-[4]"
          }`}
        >
          <img
            src={photo?.urls?.regular}
            alt={photo?.alt_description || "Photo description not available"}
            className={`h-full w-full object-contain ${
              isPortrait ? "scale-105" : ""
            }`}
          />
        </div>

        <div
          className={`space-y-6 overflow-y-auto bg-white p-8 ${
            isPortrait ? "flex-[2]" : "flex-[1.5]"
          }`}
        >
          <div>
            <h3 className="text-2xl font-medium mb-2">Description</h3>
            <p>{photo?.description || "No description available"}</p>
          </div>

          {photo?.tags && photo?.tags.length > 0 && (
            <div>
              <h4 className="text-xl font-medium mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {photo.tags.map((tag: any, index: number) => (
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

          <div className="flex items-center space-x-4">
            <img
              src={photo?.user?.profile_image?.small}
              alt={photo?.user?.name}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h4 className="text-xl font-semibold">{photo?.user?.name}</h4>
              <a
                href={`https://unsplash.com/@${photo?.user?.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-500 hover:underline"
              >
                View Profile
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoModal;
