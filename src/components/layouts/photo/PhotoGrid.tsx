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
  const [columns, setColumns] = useState<Photo[][]>([]);
  const [photoHeights, setPhotoHeights] = useState<Record<string, number>>({});
  const [columnCount, setColumnCount] = useState(5);
  const columnHeights = useRef<number[]>([]);

  const calculateColumnCount = () => {
    const width = window.innerWidth;
    if (width < 640) return 1;
    if (width < 768) return 2;
    if (width < 1024) return 3;
    if (width < 1280) return 4;
    return 5;
  };

  useEffect(() => {
    const handleResize = () => {
      setColumnCount(calculateColumnCount());
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const newColumns: Photo[][] = Array.from({ length: columnCount }, () => []);
    columnHeights.current = Array(columnCount).fill(0);

    photos?.forEach((photo) => {
      const shortestColumnIndex = columnHeights.current.indexOf(
        Math.min(...columnHeights.current)
      );
      newColumns[shortestColumnIndex].push(photo);
      columnHeights.current[shortestColumnIndex] += photoHeights[photo.id] || 0;
    });

    setColumns(newColumns);
  }, [photos, photoHeights, columnCount]);

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
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
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
