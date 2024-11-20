import React from "react";
import PhotoDetailLayout from "../components/layouts/PhotoDetailLayout";
import PhotoDetail from "../components/PhotoDetail.tsx";

const PhotoDetailPage: React.FC = () => {
  return (
    <PhotoDetailLayout>
      <PhotoDetail />
    </PhotoDetailLayout>
  );
};

export default PhotoDetailPage;
