import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LogoIcon from "../../assets/LogoPhoto/LogoIcon.png";

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  const handleScroll = () => {
    if (window.scrollY > 0) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`${
        isScrolled
          ? "bg-white bg-opacity-90 backdrop-blur-lg text-black shadow-lg"
          : "bg-white text-black"
      } p-4 fixed w-full top-0 left-0 z-50 transition-all duration-300 ease-in-out h-16`}
    >
      <div className="container mx-auto flex justify-between items-center h-full">
        <Link
          to="/"
          className="text-2xl font-bold hover:text-blue-500 flex items-center"
        >
          <img src={LogoIcon} alt="PhotoFlow Logo" className="h-8 mr-2" />{" "}
          PhotoFlow
        </Link>
        <div className="space-x-6">
          <Link
            to="/collections"
            className="hover:text-blue-500 transition-all duration-300"
          >
            Collections
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
