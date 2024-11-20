import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import MainLayout from "../components/layouts/MainLayout";

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
    </Routes>
  );
};

export default HomeRoutes;
