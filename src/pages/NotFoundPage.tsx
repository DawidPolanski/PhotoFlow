import React from "react";
import { Link } from "react-router-dom";
import NotFoundImage from "../assets/404NotFound/404NotFound.jpg";

const NotFoundPage: React.FC = () => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-screen bg-gradient-to-b from-blue-800 via-blue-900 to-blue-950 text-gray-100 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-8 h-8 bg-blue-400 opacity-0 rounded-full blur-[6px] animate-light-reflection"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              transform: `scale(${Math.random() * 0.4 + 0.2})`,
            }}
          ></div>
        ))}
      </div>

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute w-[200%] h-24 bg-blue-600 opacity-10 rounded-full blur-3xl animate-wave"></div>
        <div className="absolute w-[180%] h-20 bg-blue-500 opacity-10 rounded-full blur-2xl animate-wave delay-2s"></div>
      </div>

      <div className="w-full max-w-md mb-6 z-10">
        <img
          src={NotFoundImage}
          alt="404 Not Found"
          className="w-full h-auto rounded-lg shadow-xl animate-fadeIn"
        />
      </div>

      <p className="text-xl italic text-blue-200 mb-6 text-center animate-fadeIn z-10">
        🌊 You’ve drifted into the abyss... Return to the surface! 🐠
      </p>

      <Link
        to="/"
        className="px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 z-10"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
