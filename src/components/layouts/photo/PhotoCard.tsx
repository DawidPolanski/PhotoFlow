import React from "react";
import { motion } from "framer-motion";
import HeartIcon from "../../shared/assets/icons/HeartIcon";
import { Photo } from "../../../types/Photo";

interface PhotoCardProps {
  photo: Photo;
  hoveredPhoto: Photo | null;
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
  <motion.div
    key={photo.id}
    onMouseEnter={() => onHover(photo)}
    onMouseLeave={() => onHover(null)}
    className="relative overflow-hidden rounded-lg shadow-lg group"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div onClick={() => onClick(photo.id)} className="cursor-pointer">
      <motion.img
        src={photo.urls.small}
        alt={photo.alt_description}
        className="w-full h-auto object-cover rounded-lg group-hover:brightness-50 transition duration-300"
        onLoad={(e) => {
          const imgElement = e.currentTarget;
          onLoad(photo.id, imgElement.clientHeight);
        }}
      />
    </div>

    <motion.div
      className="absolute top-2 right-2 flex items-center gap-1 p-2"
      style={{ zIndex: 3 }}
      initial={{ opacity: 0, x: 20 }}
      animate={{
        opacity: hoveredPhoto?.id === photo.id ? 1 : 0,
        x: hoveredPhoto?.id === photo.id ? 0 : 20,
      }}
      transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
    >
      <HeartIcon />
      <span className="text-white text-sm font-semibold">{photo.likes}</span>
    </motion.div>

    <motion.div
      className="absolute bottom-0 left-0 p-3 text-white"
      style={{ zIndex: 2 }}
      initial={{ opacity: 0, y: 8 }}
      animate={{
        opacity: hoveredPhoto?.id === photo.id ? 1 : 0,
        y: hoveredPhoto?.id === photo.id ? 0 : 8,
      }}
      transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
    >
      <div className="flex items-center space-x-2">
        <img
          src={photo.user.profile_image.small}
          alt={photo.user.name}
          className="w-8 h-8 rounded-full"
        />
        <span className="text-sm font-semibold">{photo.user.name}</span>
      </div>
    </motion.div>
  </motion.div>
);

export default PhotoCard;
