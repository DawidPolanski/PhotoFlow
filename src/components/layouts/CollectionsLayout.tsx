import React from "react";
import Navbar from "../shared/Navbar";

interface CollectionLayoutProps {
  children: React.ReactNode;
}

const CollectionLayout: React.FC<CollectionLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col  bg-white min-w-[50vh]">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4">{children}</div>
      </main>
    </div>
  );
};

export default CollectionLayout;
