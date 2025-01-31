import React from "react";

const LoadingSkeleton: React.FC = () => (
  <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 mt-6">
    {[...Array(8)].map((_, index) => (
      <div
        key={index}
        className="animate-pulse flex flex-col items-center justify-center gap-4"
      >
        <div className="bg-gray-300 h-64 w-full rounded-lg" />
        <div className="bg-gray-300 h-4 w-2/3 rounded-md" />
      </div>
    ))}
  </div>
);

export default LoadingSkeleton;
