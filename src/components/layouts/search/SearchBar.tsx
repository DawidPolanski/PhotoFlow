import React, { useState, useEffect, useRef } from "react";
import images from "../../../assets/CategoriesPhoto";
import CloseIcon from "../../shared/assets/icons/CloseIcon";

interface SearchBarProps {
  query: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
  recentSearches: string[];
  onClearRecentSearches: () => void;
  onCategoryClick: (category: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  query,
  onChange,
  onSearch,
  recentSearches,
  onClearRecentSearches,
  onCategoryClick,
}) => {
  const [isActive, setIsActive] = useState(false);
  const searchBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target as Node)
      ) {
        setIsActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch();
      setIsActive(false);
    } else if (e.key === "Escape") {
      setIsActive(false);
    }
  };

  const handleCategoryClick = (category: string) => {
    onChange({
      target: { value: category },
    } as React.ChangeEvent<HTMLInputElement>);
    onCategoryClick(category);
    setIsActive(false);
  };

  const handleClear = () => {
    onChange({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div
      className="w-full max-w-xl relative flex items-center gap-2"
      ref={searchBarRef}
    >
      <input
        type="text"
        value={query}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsActive(true)}
        placeholder="Search for images..."
        className="w-full px-6 py-3 border border-transparent rounded-full shadow-lg text-gray-700 
                   placeholder-gray-400 bg-gradient-to-r from-blue-100 via-purple-100 to-blue-100
                   focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50
                   focus:scale-105 transition-all duration-150 ease-in-out transform"
      />
      {query && (
        <div
          onClick={handleClear}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
        >
          <CloseIcon className="w-5 h-5 text-purple-500 hover:text-purple-700 transition-colors duration-150" />
        </div>
      )}
      {isActive && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg p-4 z-50">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Collections</h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(images)
                .slice(0, 8)
                .map(([category, imageUrl]) => (
                  <div
                    key={category}
                    className="flex items-center p-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200 transition-all duration-150"
                    onClick={() => handleCategoryClick(category.toLowerCase())}
                  >
                    <img
                      src={imageUrl}
                      alt={category}
                      className="w-10 h-10 rounded-md object-cover mr-2"
                      loading="lazy"
                    />
                    <span className="text-gray-700 text-sm font-medium">
                      {category}
                    </span>
                  </div>
                ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Recent Searches</h3>
            {recentSearches.length > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  {recentSearches.slice(0, 8).map((searchTerm) => (
                    <div
                      key={searchTerm}
                      className="p-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200 text-sm transition-all duration-150"
                      onClick={() => {
                        onChange({
                          target: { value: searchTerm },
                        } as React.ChangeEvent<HTMLInputElement>);
                        onSearch();
                        setIsActive(false);
                      }}
                    >
                      {searchTerm}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    onClearRecentSearches();
                    setIsActive(false);
                  }}
                  className="mt-2 text-sm text-red-500 hover:text-red-700"
                >
                  Clear
                </button>
              </>
            ) : (
              <p className="text-gray-500">No recent searches.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
