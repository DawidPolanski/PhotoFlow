import React, { useState, useEffect, useRef } from "react";
import CloseIcon from "./shared/assets/icons/CloseIcon";
import NewTabIcon from "./shared/assets/icons/NewTabIcon";
import InfoIcon from "../components/shared/assets/icons/InfoIcon";
import MagnifierIcon from "./shared/assets/icons/MagnifierIcon";
import tippy, { followCursor } from "tippy.js";
import "tippy.js/dist/tippy.css";
import { fetchPhoto } from "../api/useUnsplash";
import Spinner from "./ui/Spinner";

interface Tag {
  title: string;
}

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
  tags?: Tag[];
  created_at?: string;
  views?: number;
  exif?: {
    make?: string;
    model?: string;
    aperture?: string;
    exposure_time?: string;
    focal_length?: string;
    iso?: string;
  };
}

interface PhotoModalProps {
  photoId: string;
  onClose: () => void;
}

const PhotoModal: React.FC<PhotoModalProps> = ({ photoId, onClose }) => {
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [loading, setLoading] = useState(true);
  const [magnifierMode, setMagnifierMode] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const loadPhoto = async () => {
      setLoading(true);
      const fetchedPhoto = await fetchPhoto(photoId);
      setPhoto(fetchedPhoto);
      setLoading(false);
    };

    loadPhoto();
  }, [photoId]);

  useEffect(() => {
    if (photo?.exif && Object.keys(photo.exif).length > 0) {
      const tooltipElement = document.querySelector(".info-icon");
      tippy(tooltipElement, {
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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setMagnifierMode(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMagnifierToggle = () => {
    setMagnifierMode((prev) => !prev);
  };

  const handleMagnifierOff = () => {
    setMagnifierMode(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!magnifierMode) return;
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMagnifierPosition({ x, y, width: rect.width, height: rect.height });
  };

  if (loading) {
    return <Spinner />;
  }

  if (!photo) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
        <p className="text-white text-xl">Failed to load photo details.</p>
      </div>
    );
  }

  const isPortrait = photo.urls.regular.includes("portrait");
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      ref={modalRef}
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
        } max-w-[1600px] max-h-[90vh] relative rounded-lg overflow-hidden shadow-lg`}
      >
        <div
          className="relative group flex items-center justify-center bg-black"
          onMouseMove={handleMouseMove}
        >
          <img
            src={photo.urls.regular}
            alt={photo.alt_description || "Photo description"}
            className={`h-full w-full object-contain ${
              magnifierMode ? "cursor-none" : ""
            }`}
            onClick={handleMagnifierOff}
          />
          {magnifierMode && (
            <div
              className="absolute pointer-events-none border-2 border-white"
              style={{
                width: "225px",
                height: "225px",
                border: "none",
                transform: "translate(-50%, -50%)",
                top: magnifierPosition.y,
                left: magnifierPosition.x,
                backgroundImage: `url(${photo.urls.regular})`,
                backgroundSize: "900%", // zoom level
                backgroundPosition: `${
                  (magnifierPosition.x / magnifierPosition.width) * 100
                }% ${(magnifierPosition.y / magnifierPosition.height) * 100}%`,
              }}
            />
          )}
          <div
            onClick={handleMagnifierToggle}
            className="absolute top-4 left-4 cursor-pointer opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-opacity transition-transform duration-300 ease-out"
          >
            <MagnifierIcon className="w-5 h-5 text-white" />
          </div>

          <div className="absolute bottom-4 right-4 z-50 opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-opacity transition-transform duration-300 ease-out">
            <InfoIcon className="w-6 h-6 text-white info-icon select-none focus:outline-none" />
          </div>
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

        <div
          className={`space-y-6 overflow-y-auto bg-white px-8 py-6 ${
            isPortrait ? "flex-[2]" : "flex-[1.5]"
          } relative flex flex-col`}
        >
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

          <div className="flex flex-col flex-grow">
            <div>
              <h3 className="text-2xl font-medium mb-2">Description</h3>
              <p>{photo.alt_description || "No description available"}</p>
              {photo.tags && photo.tags.length > 0 && (
                <div className="mt-4">
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
            </div>

            <div className="mt-auto pt-4">
              <div className="border-t border-gray-300 my-2" />
              <div className="flex flex-col space-y-2 text-gray-700">
                {photo.likes && (
                  <div className="text-sm">
                    <strong>Likes:</strong> {photo.likes.toLocaleString()}
                  </div>
                )}
                {photo.views && (
                  <div className="text-sm">
                    <strong>Views:</strong> {photo.views.toLocaleString()}
                  </div>
                )}
                {photo.created_at && (
                  <div className="text-sm text-gray-500">
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
    </div>
  );
};

export default PhotoModal;
