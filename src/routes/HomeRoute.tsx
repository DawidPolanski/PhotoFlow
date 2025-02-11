import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import CollectionPage from "../pages/CollectionPage";
import MainLayout from "../components/layouts/MainLayout";
import CollectionPhotos from "../components/layouts/photo/CollectionPhotos";

const HomeRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <MainLayout>
            <Home />
          </MainLayout>
        }
      />
      <Route
        path="/collections"
        element={
          <MainLayout>
            <CollectionPage />
          </MainLayout>
        }
      />
      <Route
        path="/collections/:collectionId"
        element={
          <MainLayout>
            <CollectionPhotos />
          </MainLayout>
        }
      />
    </Routes>
  );
};

export default HomeRoutes;
