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
      className={`w-fit mx-auto sticky top-0 bg-transparent z-10 transition-transform duration-300 ease-in-out flex justify-center ${
        scrolling ? "translate-y-0" : "translate-y-[-30px]"
      }`}
      style={{ zIndex: 50 }}
    >
      <h1
        className={`text-center font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-blue-400 bg-200% animate-gradient-wave transition-all duration-300 ease-in-out p-4 w-fit ${
          isMobile
            ? scrolling
              ? "text-lg hidden"
              : "text-3xl"
            : window.innerWidth < 1024
            ? scrolling
              ? "text-xl hidden"
              : "text-4xl"
            : scrolling
            ? "text-2xl"
            : "text-5xl"
        }`}
      >
        Find beautiful images that{" "}
        <span
          className={`font-dancing transition-all duration-300 ease-in-out ${
            isMobile
              ? scrolling
                ? "text-xl hidden"
                : "text-4xl"
              : window.innerWidth < 1024
              ? scrolling
                ? "text-2xl hidden"
                : "text-5xl"
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
