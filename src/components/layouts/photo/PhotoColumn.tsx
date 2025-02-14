import React, { memo } from "react";
import { motion } from "framer-motion";
import { Photo } from "../../../types/Photo";
import PhotoCard from "./PhotoCard";
import LoadingSkeleton from "../search/LoadingSkeleton";
interface PhotoColumnProps {
  photos: Photo[];
  hoveredPhoto: Photo | null;
  onHover: (photo: Photo | null) => void;
  onClick: (photoId: string) => void;
  onLoad: (photoId: string, height: number) => void;
}

const PhotoColumn: React.FC<PhotoColumnProps> = memo(
  ({ photos, hoveredPhoto, onHover, onClick, onLoad }) => (
    <div
      className="flex flex-col gap-4"
      style={{ flex: 1 }}
      aria-label="Photo column"
    >
      {photos.length === 0 ? (
        <LoadingSkeleton />
      ) : (
        photos.map((photo, index) => (
          <motion.div
            key={`${photo.id}_${index}`}
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
        ))
      )}
    </div>
  )
);

export default PhotoColumn;
