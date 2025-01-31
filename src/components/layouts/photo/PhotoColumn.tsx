import React from "react";
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
    {photos.map((photo) => (
      <PhotoCard
        key={photo.id}
        photo={photo}
        hoveredPhoto={hoveredPhoto}
        onHover={onHover}
        onClick={onClick}
        onLoad={onLoad}
      />
    ))}
  </div>
);

export default PhotoColumn;
