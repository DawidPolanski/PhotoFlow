import React from "react";
import { Route, Routes } from "react-router-dom";
import PhotoDetail from "../pages/PhotoDetailPage";
import MainLayout from "../components/layouts/MainLayout";

const PhotoRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/photo/:id"
        element={
          <MainLayout>
            <PhotoDetail />
          </MainLayout>
        }
      />
    </Routes>
  );
};

export default PhotoRoutes;
