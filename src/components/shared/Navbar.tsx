import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white text-black p-4 shadow-lg fixed w-full top-0 left-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold hover:text-blue-500">
          MyApp
        </Link>
        <div className="space-x-6">
          <Link
            to="/"
            className="hover:text-blue-500 transition-all duration-300"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="hover:text-blue-500 transition-all duration-300"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="hover:text-blue-500 transition-all duration-300"
          >
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
