import React, { useEffect, useState } from "react";

interface HeaderProps {
  scrolling: boolean;
}

const Header: React.FC<HeaderProps> = ({ scrolling }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      className={`w-fit mx-auto sticky top-0 bg-transparent z-10 transition-all duration-100 flex justify-center ${
        scrolling ? "top-0" : "top-[-30px]"
      }`}
    >
      <h1
        className={`text-center font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-blue-400 bg-200% animate-gradient-wave transition-all duration-100 p-4 w-fit ${
          isMobile
            ? scrolling
              ? "text-lg"
              : "text-3xl"
            : scrolling
            ? "text-2xl"
            : "text-5xl"
        } ${isMobile && scrolling ? "opacity-0" : "opacity-100"}`}
      >
        Find beautiful images that{" "}
        <span
          className={`font-dancing transition-all duration-100 ${
            isMobile
              ? scrolling
                ? "text-xl"
                : "text-4xl"
              : scrolling
              ? "text-3xl"
              : "text-6xl"
          }`}
        >
          inspire
        </span>{" "}
        your creativity!
      </h1>
    </div>
  );
};

export default Header;
