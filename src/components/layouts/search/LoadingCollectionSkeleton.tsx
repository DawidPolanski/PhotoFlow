import React from "react";

const LoadingCollectionSkeleton: React.FC = () => {
  return (
    <div className="rounded-lg overflow-hidden shadow-lg bg-white flex flex-col animate-pulse">
      <div className="relative grid gap-1">
        <div className="h-48 bg-gray-200"></div>
        <div className="grid grid-cols-2 gap-1 h-24">
          <div className="bg-gray-200"></div>
          <div className="bg-gray-200"></div>
        </div>
      </div>
      <div className="p-4 bg-white border-t border-gray-200 min-h-[80px] flex flex-col justify-center">
        <div className="h-6 bg-gray-200 w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 w-1/2 mb-2"></div>
        <div className="flex flex-wrap mt-2">
          <div className="h-4 bg-gray-200 w-1/4 mr-2"></div>
          <div className="h-4 bg-gray-200 w-1/4 mr-2"></div>
          <div className="h-4 bg-gray-200 w-1/4"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingCollectionSkeleton;
