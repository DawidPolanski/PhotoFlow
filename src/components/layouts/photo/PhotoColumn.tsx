import React from "react";
import { motion } from "framer-motion";
import { Photo } from "../../../types/Photo";
import PhotoCard from "./PhotoCard";

interface PhotoColumnProps {
  photos: Photo[];
  hoveredPhoto: Photo | null;
  onHover: (photo: Photo | null) => void;
  onClick: (photoId: string) => void;
  onLoad: (photoId: string, height: number) => void;
}

const PhotoColumn: React.FC<PhotoColumnProps> = ({
  photos,
  hoveredPhoto,
  onHover,
  onClick,
  onLoad,
}) => (
  <div className="flex flex-col gap-4" style={{ flex: 1 }}>
    {photos.map((photo, index) => (
      <motion.div
        key={photo.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        <PhotoCard
          photo={photo}
          hoveredPhoto={hoveredPhoto}
          onHover={onHover}
          onClick={onClick}
          onLoad={onLoad}
        />
      </motion.div>
    ))}
  </div>
);

export default PhotoColumn;
