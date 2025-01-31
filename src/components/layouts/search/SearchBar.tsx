import React from "react";

interface SearchBarProps {
  query: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ query, onChange }) => (
  <input
    type="text"
    value={query}
    onChange={onChange}
    placeholder="Search for images..."
    className="w-full max-w-xl px-6 py-3 border border-transparent rounded-full shadow-lg text-gray-700 
               placeholder-gray-400 bg-gradient-to-r from-blue-100 via-purple-100 to-blue-100
               bg-200% animate-gradient-wave
               focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50
               focus:scale-105
               transition duration-200 ease-in-out transform"
  />
);

export default SearchBar;
