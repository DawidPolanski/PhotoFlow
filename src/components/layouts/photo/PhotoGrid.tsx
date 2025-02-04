import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Photo } from "../../../types/Photo";
import PhotoColumn from "../photo/PhotoColumn";
import PhotoModal from "./PhotoModal";

interface PhotoGridProps {
  photos: Photo[];
  onTagClick: (tag: string) => void;
}

const PhotoGrid: React.FC<PhotoGridProps> = ({ photos, onTagClick }) => {
  const [hoveredPhoto, setHoveredPhoto] = useState<Photo | null>(null);
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);
  const columnCount = 5;
  const [columns, setColumns] = useState<Photo[][]>(
    Array.from({ length: columnCount }, () => [])
  );
  const [photoHeights, setPhotoHeights] = useState<Record<string, number>>({});
  const columnHeights = useRef<number[]>(Array(columnCount).fill(0));

  useEffect(() => {
    const newColumns: Photo[][] = Array.from({ length: columnCount }, () => []);
    columnHeights.current = Array(columnCount).fill(0);

    photos.forEach((photo) => {
      const shortestColumnIndex = columnHeights.current.indexOf(
        Math.min(...columnHeights.current)
      );
      newColumns[shortestColumnIndex].push(photo);
      columnHeights.current[shortestColumnIndex] += photoHeights[photo.id] || 0;
    });

    setColumns(newColumns);
  }, [photos, photoHeights]);

  const handleImageLoad = (photoId: string, height: number) => {
    setPhotoHeights((prevHeights) => ({
      ...prevHeights,
      [photoId]: height,
    }));
  };

  const openModal = (photoId: string) => {
    setSelectedPhotoId(photoId);
  };

  const closeModal = () => {
    setSelectedPhotoId(null);
  };

  return (
    <div className="w-full px-4 pt-16">
      <motion.div
        className="flex gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        aria-label="Photo grid"
      >
        {columns.map((column, colIndex) => (
          <PhotoColumn
            key={colIndex}
            photos={column}
            hoveredPhoto={hoveredPhoto}
            onHover={setHoveredPhoto}
            onClick={openModal}
            onLoad={handleImageLoad}
          />
        ))}
      </motion.div>

      {selectedPhotoId && (
        <PhotoModal
          photoId={selectedPhotoId}
          onClose={closeModal}
          onTagClick={onTagClick}
        />
      )}
    </div>
  );
};

export default PhotoGrid;
