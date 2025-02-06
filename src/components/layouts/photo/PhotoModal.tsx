import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import CloseIcon from "../../shared/assets/icons/CloseIcon";
import NewTabIcon from "../../shared/assets/icons/NewTabIcon";
import InfoIcon from "../../shared/assets/icons/InfoIcon";
import MagnifierIcon from "../../shared/assets/icons/MagnifierIcon";
import tippy, { followCursor } from "tippy.js";
import "tippy.js/dist/tippy.css";
import { fetchPhoto } from "../../../api/useUnsplash";
import Spinner from "../../ui/Spinner";
import ColorThief from "colorthief";
import { Photo } from "../../../types/Photo";

interface PhotoModalProps {
  photoId: string;
  onClose: () => void;
  onTagClick: (tag: string) => void;
}

const PhotoModal: React.FC<PhotoModalProps> = ({
  photoId,
  onClose,
  onTagClick,
}) => {
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [loading, setLoading] = useState(true);
  const [magnifierMode, setMagnifierMode] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [colors, setColors] = useState<string[]>([]);
  const [activeColorIndex, setActiveColorIndex] = useState<number | null>(null);
  const [copiedColorIndex, setCopiedColorIndex] = useState<number | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      return window.innerWidth <= 768;
    };
    setIsMobile(checkIsMobile());
    const meta = document.createElement("meta");
    meta.name = "viewport";
    meta.content =
      "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
    document.head.appendChild(meta);

    return () => {
      document.head.removeChild(meta);
    };
  }, []);

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
    if (photo) {
      const img = new Image();
      img.src = photo.urls.regular;
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const colorThief = new ColorThief();
        const palette = colorThief.getPalette(img, 6);
        const hexColors = palette.map(
          (color) =>
            `#${color.map((c) => c.toString(16).padStart(2, "0")).join("")}`
        );
        setColors(hexColors);
      };
    }
  }, [photo]);

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
    if (!magnifierMode || !modalRef.current || isMobile) return; // Wyłącz lupy na mobilnych
    const container = modalRef.current.querySelector(".relative.group");
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMagnifierPosition({
      x,
      y,
      width: rect.width,
      height: rect.height,
    });
  };

  const handleColorHover = (index: number) => {
    if (isMobile) return;
    setActiveColorIndex(index);
  };

  const handleColorLeave = () => {
    if (isMobile) return;
    setActiveColorIndex(null);
  };

  const handleColorClick = (color: string, index: number) => {
    navigator.clipboard.writeText(color).then(() => {
      setCopiedColorIndex(index);
      setTimeout(() => {
        setCopiedColorIndex(null);
      }, 2000);
    });
  };

  const handleTagClick = (tag: string) => {
    onTagClick(tag);
    onClose();
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

  const isPortrait = photo.height > photo.width;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      ref={modalRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.button
        onClick={onClose}
        className="fixed top-4 right-4 z-50 p-0 m-0 border-none bg-transparent"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <CloseIcon className="w-8 h-8 text-white hover:opacity-80 transition-opacity" />
      </motion.button>
      <motion.div
        className={`flex flex-col lg:flex-row w-[90%] lg:w-[80%] xl:w-[75%] max-w-[1600px] max-h-[90vh] relative rounded-lg overflow-y-auto shadow-lg bg-white`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div
          className={`relative group flex items-center justify-center bg-black cursor-default ${
            isPortrait ? "h-auto" : "h-auto"
          }`}
          onMouseMove={!isMobile ? handleMouseMove : undefined}
        >
          <img
            src={photo.urls.regular}
            alt={photo.alt_description || "Photo description"}
            className={`h-full w-full object-contain ${
              magnifierMode ? "cursor-none" : ""
            }`}
            onMouseMove={!isMobile ? handleMouseMove : undefined}
            onMouseLeave={!isMobile ? handleMagnifierOff : undefined}
            onClick={handleMagnifierOff}
          />
          {magnifierMode && !isMobile && (
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
                backgroundSize: `${magnifierPosition.width * 2}px ${
                  magnifierPosition.height * 2
                }px`,
                backgroundPosition: `${
                  (magnifierPosition.x / magnifierPosition.width) * 100
                }% ${(magnifierPosition.y / magnifierPosition.height) * 100}%`,
              }}
            />
          )}
          {!isMobile && (
            <>
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
                  <NewTabIcon className="w-6 h-6 text-blue-500 hover:text-blue-700 transition-all" />
                </a>
              </div>
            </>
          )}
        </div>

        <div
          className={`space-y-6 bg-white px-8 py-6 ${
            isPortrait ? "lg:flex-[2]" : "lg:flex-[1.5]"
          } relative flex flex-col min-h-[200px]`}
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
                        className="bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded-full cursor-pointer hover:bg-gray-300"
                        onClick={() => handleTagClick(tag.title)}
                      >
                        {tag.title}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="mt-auto pt-4">
              {colors.length > 0 && (
                <div className="w-full mb-4">
                  <div className="flex gap-2 w-full">
                    {colors.map((color, index) => (
                      <motion.div
                        key={index}
                        className="relative flex-1 h-12 rounded-lg shadow-md cursor-pointer"
                        style={{ backgroundColor: color }}
                        onMouseEnter={() => handleColorHover(index)}
                        onMouseLeave={handleColorLeave}
                        onClick={() => handleColorClick(color, index)}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        {(activeColorIndex === index ||
                          copiedColorIndex === index) && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                            <span className="text-white font-semibold">
                              {copiedColorIndex === index ? "Copied!" : color}
                            </span>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
              <div className="border-t border-gray-300 my-2" />
              <div className="flex flex-col space-y-0.5 text-gray-700">
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
      </motion.div>
    </motion.div>
  );
};

export default PhotoModal;
