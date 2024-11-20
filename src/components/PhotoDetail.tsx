import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchPhoto } from "../api/unsplash";
import DownloadIcon from "../../src/components/shared/assets/icons/DownloadIcon";
import LocationIcon from "../../src/components/shared/assets/icons/LocationIcon";
import ViewIcon from "../../src/components/shared/assets/icons/ViewIcon";
import HeartIcon from "../../src/components/shared/assets/icons/HeartIcon";

interface PhotoDetailProps {}

const PhotoDetail: React.FC<PhotoDetailProps> = () => {
  const { id } = useParams();
  const [photo, setPhoto] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadPhoto = async () => {
      if (!id) return;
      setLoading(true);
      const fetchedPhoto = await fetchPhoto(id);
      setPhoto(fetchedPhoto);
      setLoading(false);
    };

    loadPhoto();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full px-4 pt-16">
      <div className="container mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col lg:flex-row w-full">
          <div className="lg:w-2/3 mb-8 lg:mb-0">
            <img
              src={photo?.urls?.regular}
              alt={photo?.alt_description || "Photo description not available"}
              className="w-full h-auto rounded-lg shadow-lg"
              style={{ maxHeight: "80vh", objectFit: "cover" }}
            />
          </div>

          <div className="lg:w-1/3 lg:pl-12">
            <div className="flex flex-wrap justify-between mb-6">
              <div className="flex items-center w-full lg:w-auto mb-4 lg:mb-0">
                <HeartIcon className="w-6 h-6 text-red-500 mr-2" />
                <span className="text-lg">{photo?.likes || 0}</span>
              </div>
              <div className="flex items-center w-full lg:w-auto mb-4 lg:mb-0">
                <ViewIcon className="w-6 h-6 text-gray-600 mr-2" />
                <span className="text-lg">{photo?.views || 0}</span>
              </div>
              <div className="flex items-center w-full lg:w-auto mb-4 lg:mb-0">
                <DownloadIcon className="w-6 h-6 text-gray-600 mr-2" />
                <span className="text-lg">{photo?.downloads || 0}</span>
              </div>
              {photo?.location && (
                <div className="flex items-center w-full lg:w-auto mb-4 lg:mb-0">
                  <LocationIcon className="w-6 h-6 text-gray-600 mr-2" />
                  <span className="text-lg">
                    {photo?.location.name || "Unknown"}
                  </span>
                </div>
              )}
            </div>

            <div className="text-gray-700 mb-6">
              <h3 className="text-2xl font-medium">Description</h3>
              <p>{photo?.description || "No description available"}</p>
              {photo?.tags && photo.tags.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-2xl font-medium">Tags</h3>
                  <div className="flex flex-wrap">
                    {photo.tags.map((tag: { title: string }) => (
                      <span
                        key={tag.title}
                        className="text-lg text-blue-500 mr-2 mb-2"
                      >
                        #{tag.title}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center mt-8 border-t pt-6">
          <div className="mr-4">
            <img
              src={photo?.user?.profile_image?.medium}
              alt={photo?.user?.username}
              className="w-16 h-16 rounded-full border-2 border-gray-300 object-cover"
              style={{ maxWidth: "none" }}
            />
          </div>
          <div className="text-gray-700">
            <h3 className="text-xl font-medium">User Information</h3>
            <div className="mt-4">
              <p className="text-lg">Username: {photo?.user?.username}</p>
              <p className="text-lg">Name: {photo?.user?.name}</p>
              {photo?.user?.location && (
                <p className="text-lg">Location: {photo?.user?.location}</p>
              )}
              {photo?.user?.bio && (
                <p className="text-lg">Bio: {photo?.user?.bio}</p>
              )}
              <p className="text-lg">
                Portfolio:{" "}
                <a
                  href={photo?.user?.links?.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {photo?.user?.links?.portfolio || "Not available"}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoDetail;
