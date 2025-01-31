import React from "react";
import HeartIcon from "../../shared/assets/icons/HeartIcon";
import { Photo } from "../../../types/Photo";

interface PhotoCardProps {
  photo: Photo;
  hoveredPhoto: Photo | null; // Dodaj hoveredPhoto jako prop
  onHover: (photo: Photo | null) => void;
  onClick: (photoId: string) => void;
  onLoad: (photoId: string, height: number) => void;
}

const PhotoCard: React.FC<PhotoCardProps> = ({
  photo,
  hoveredPhoto,
  onHover,
  onClick,
  onLoad,
}) => (
  <div
    key={photo.id}
    onMouseEnter={() => onHover(photo)}
    onMouseLeave={() => onHover(null)}
    className="relative overflow-hidden rounded-lg shadow-lg group"
  >
    <div onClick={() => onClick(photo.id)} className="cursor-pointer">
      <img
        src={photo.urls.small}
        alt={photo.alt_description}
        className="w-full h-auto object-cover rounded-lg group-hover:brightness-75 transition duration-300"
        onLoad={(e) => {
          const imgElement = e.currentTarget;
          onLoad(photo.id, imgElement.clientHeight);
        }}
      />
    </div>
    <div
      className={`absolute top-2 right-2 flex items-center gap-1 p-2 transform transition-all duration-300 ease-in-out ${
        hoveredPhoto?.id === photo.id // Użyj hoveredPhoto
          ? "opacity-100 translate-x-0"
          : "opacity-0 translate-x-[20px]"
      }`}
      style={{ zIndex: 3 }}
    >
      <HeartIcon />
      <span className="text-white text-sm font-semibold">{photo.likes}</span>
    </div>
    <div
      className={`absolute bottom-0 left-0 p-3 text-white transform transition-all duration-300 ease-in-out ${
        hoveredPhoto?.id === photo.id // Użyj hoveredPhoto
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
        <span className="text-sm font-semibold">{photo.user.name}</span>
      </div>
    </div>
  </div>
);

export default PhotoCard;
