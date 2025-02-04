import React from "react";

const LoadingSkeleton: React.FC = () => (
  <div className="animate-pulse relative overflow-hidden rounded-lg shadow-lg">
    <div className="bg-gray-300 h-64 w-full rounded-lg" />
    <div className="absolute top-2 right-2 flex items-center gap-1 p-2">
      <div className="bg-gray-400 w-6 h-6 rounded-full" />
      <div className="bg-gray-400 h-4 w-8 rounded-md" />
    </div>
    <div className="absolute bottom-0 left-0 p-3">
      <div className="flex items-center space-x-2">
        <div className="bg-gray-400 w-8 h-8 rounded-full" />
        <div className="bg-gray-400 h-4 w-20 rounded-md" />
      </div>
    </div>
  </div>
);

export default LoadingSkeleton;
