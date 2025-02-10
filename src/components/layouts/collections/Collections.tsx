import React from "react";
import { motion } from "framer-motion";
import { Collection } from "../../../types/Collection";

interface CollectionsProps {
  collections: Collection[];
}

const Collections: React.FC<CollectionsProps> = ({ collections }) => {
  return (
    <div className="w-full max-w-6xl mx-auto mb-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Collections</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((collection) => {
          console.log("Collection data:", collection);
          const images =
            collection.preview_photos && collection.preview_photos.length >= 3
              ? collection.preview_photos.slice(0, 3)
              : collection.cover_photo
              ? [collection.cover_photo]
              : [];

          return (
            <motion.div
              key={collection.id}
              className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white flex flex-col"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative grid gap-1">
                {images[0] && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={images[0].urls.small}
                      alt={`Collection ${collection.title} image 1`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="grid grid-cols-2 gap-1 h-24">
                  {images[1] && (
                    <div className="overflow-hidden">
                      <img
                        src={images[1].urls.small}
                        alt={`Collection ${collection.title} image 2`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  {images[2] && (
                    <div className="overflow-hidden">
                      <img
                        src={images[2].urls.small}
                        alt={`Collection ${collection.title} image 3`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-white border-t border-gray-200 min-h-[80px] flex flex-col justify-center">
                <h3 className="text-lg font-bold text-gray-800">
                  {collection.title || "Untitled Collection"}
                </h3>
                <p className="text-sm text-gray-600">
                  {collection.total_photos || 0} images
                </p>
                <div className="flex flex-wrap mt-2">
                  {collection.tags?.length > 0 ? (
                    collection.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full m-1"
                      >
                        {tag.title}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-500">No tags</span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Collections;
