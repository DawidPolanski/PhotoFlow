import React from "react";
import Navbar from "../shared/Navbar";

interface PhotoDetailLayoutProps {
  children: React.ReactNode;
}

const PhotoDetailLayout: React.FC<PhotoDetailLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-8 px-4 sm:px-8 ">{children}</main>
    </div>
  );
};

export default PhotoDetailLayout;
