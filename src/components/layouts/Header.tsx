import React from "react";

interface HeaderProps {
  scrolling: boolean;
}

const Header: React.FC<HeaderProps> = ({ scrolling }) => (
  <div
    className={`w-full sticky top-0 bg-transparent z-10 transition-all duration-100 flex justify-center ${
      scrolling ? "top-0" : "top-[-30px]"
    }`}
  >
    <h1
      className={`text-center font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-blue-400 bg-200% animate-gradient-wave text-center transition-all duration-100 ${
        scrolling ? "text-2xl" : "text-5xl"
      } p-4 w-fit`}
    >
      Find beautiful images that{" "}
      <span
        className={`font-dancing transition-all duration-100 ${
          scrolling ? "text-3xl" : "text-6xl"
        }`}
      >
        inspire
      </span>{" "}
      your creativity!
    </h1>
  </div>
);

export default Header;
