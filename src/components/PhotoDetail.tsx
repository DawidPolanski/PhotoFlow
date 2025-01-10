import React, { useState, useEffect } from "react";
import { fetchPhoto } from "../api/unsplash";
import CloseIcon from "./shared/assets/icons/CloseIcon";
import NewTabIcon from "./shared/assets/icons/NewTabIcon";
import InfoIcon from "../components/shared/assets/icons/InfoIcon";
import tippy, { followCursor } from "tippy.js";
import "tippy.js/dist/tippy.css";

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
      try {
        const fetchedPhoto = await fetchPhoto(photoId);
        setPhoto(fetchedPhoto);
      } catch (error) {
        console.error("Error fetching photo:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPhoto();
  }, [photoId]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    if (photo?.exif) {
      tippy(".info-icon", {
        content: `
          <div class="text-left">
            <p><strong>Make:</strong> ${photo.exif.make || "N/A"}</p>
            <p><strong>Model:</strong> ${photo.exif.model || "N/A"}</p>
            <p><strong>Aperture:</strong> f/${photo.exif.aperture || "N/A"}</p>
            <p><strong>Exposure:</strong> ${
              photo.exif.exposure_time || "N/A"
            }</p>
            <p><strong>Focal Length:</strong> ${
              photo.exif.focal_length || "N/A"
            }mm</p>
            <p><strong>ISO:</strong> ${photo.exif.iso || "N/A"}</p>
          </div>
        `,
        allowHTML: true,
        placement: "top",
        theme: "translucent",
        followCursor: true,
        plugins: [followCursor],
        animation: "scale-subtle",
      });
    }
  }, [photo]);

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const isPortrait = photo?.width < photo?.height;

  const formatNumber = (number: number) => number.toLocaleString();

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (!photo) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
        <div className="text-white text-lg">Photo not found</div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
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
        <div className="relative group flex items-center justify-center bg-black">
          <img
            src={photo?.urls?.regular}
            alt={photo?.alt_description || "Photo description not available"}
            className={`h-full w-full object-contain ${
              isPortrait ? "scale-105" : ""
            }`}
            style={{ userSelect: "none", pointerEvents: "none" }}
          />

          <div className="absolute bottom-4 right-4 z-50 opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-opacity transition-transform duration-300 ease-out">
            <InfoIcon className="w-6 h-6 text-white info-icon select-none focus:outline-none" />
          </div>

          <div className="absolute top-4 right-4 z-50 opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-opacity transition-transform duration-300 ease-out">
            <a
              href={photo?.links?.download}
              target="_blank"
              rel="noopener noreferrer"
            >
              <NewTabIcon className="w-8 h-8 text-blue-500 hover:text-blue-700 transition-all" />
            </a>
          </div>
        </div>

        <div
          className={`space-y-6 overflow-y-auto bg-white px-8 py-6 ${
            isPortrait ? "flex-[2]" : "flex-[1.5]"
          } relative flex flex-col`}
        >
          <div className="flex items-center space-x-4 border-b pb-4">
            <img
              src={photo?.user?.profile_image?.medium}
              alt={photo?.user?.name}
              className="w-16 h-16 rounded-full object-cover"
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
          <div>
            <h3 className="text-2xl font-medium mb-2">Description</h3>
            <p>{photo?.description || "No description available"}</p>
          </div>
          {photo?.tags?.length > 0 && (
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
          <div className="flex-grow" />{" "}
          {photo?.created_at && (
            <div className="mt-2 pt-2 text-sm text-gray-500">
              <div className="border-t border-gray-300 my-2" />
              <div className="mt-2 flex flex-col space-y-1 items-start text-gray-800">
                {photo?.likes && (
                  <div className="flex items-center space-x-1 text-sm text-gray-700">
                    <span>
                      <strong>Likes: {formatNumber(photo?.likes)}</strong>
                    </span>
                  </div>
                )}
                {photo?.views && (
                  <div className="flex items-center space-x-1 text-sm text-gray-700">
                    <span>
                      <strong>Views: {formatNumber(photo?.views)}</strong>
                    </span>
                  </div>
                )}
                <div className="mt-2 text-sm text-gray-500">
                  {new Intl.DateTimeFormat("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }).format(new Date(photo.created_at))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhotoModal;
